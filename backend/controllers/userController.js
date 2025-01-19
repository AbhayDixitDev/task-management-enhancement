const Employee = require("../models/employeeModel");
const TaskModel = require('../models/taskModel'); 
const ReportModel = require('../models/reportModel');

const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const { google } = require('googleapis');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const UserLogin = async (req, res) => {
        
    try {
        const { email, password } = req.body;
        const user = await Employee.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "either username or password is incorrect" });
        }
        if (user.password !== password) {
            return res.status(400).json({ message: "either username or password is incorrect" });
        }
        if (user && !user.isAdmin && user.password === password) {
            res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email, department: user.department, position: user.position, id: user._id } });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const ShowUserTasks=async (req, res) => {
    try {
        const {userId}=req.body
        
        const tasks = await TaskModel.find({ userId: userId }).populate('userId');
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}



const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

const SubmitTaskReport=async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one file is required" });
        }
        // console.log(req.body);
        // console.log(req.files);
        
        const { description, taskid, files,status } = req.body;
       console.log(req.body);
       
        const fileLinks = [];

        for (const file of req.files) {
            const fileMetadata = {
                name: file.originalname,
                mimeType: file.mimetype
            };
            const media = {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path)
            };

            const driveResponse = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id'
            });

            const fileId = driveResponse.data.id;

            await drive.permissions.create({
                fileId: fileId,
                resource: {
                    role: 'reader',
                    type: 'anyone'
                }
            });

            const publicUrl = `https://drive.google.com/file/d/${fileId}/preview`;
            fileLinks.push(publicUrl);

            fs.unlinkSync(file.path);
        }

        const report = await ReportModel.create({ description, task:taskid, reportFiles: fileLinks, status });
        console.log(report);
        

        const task = await TaskModel.findByIdAndUpdate(taskid, { $push: { reports: report._id } });
        // console.log(fileLinks);
        console.log(task);
        
        
        res.status(200).json({ report, message: "Report submitted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const TaskReports = async(req,res)=>{
    try {
        const {id}=req.params
        const taskReports=await TaskModel.find({_id:id}).populate('reports')
        console.log(taskReports);
        
        res.status(200).json({message:"Task reports fetched successfully",taskReports})
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const ChangePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;
        const user = await Employee.findById(id);
        if (user.password !== oldPassword) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        if (user.password === newPassword) {
            return res.status(400).json({ message: "New password cannot be same as old password" });
        }
        await Employee.findByIdAndUpdate(id, { password: newPassword });

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

let otpStore = {};

const ResetSendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Employee.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        

        const otp = crypto.randomInt(100000, 999999).toString();
        otpStore[email] = otp;

        const transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: {
                user: 'apikey', // This is the string "apikey", literally
                pass: process.env.SENDGRID_API_KEY, // Your SendGrid API key
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email.toLowerCase(),
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return res.status(500).json({ message: 'Error sending OTP' });

            res.status(200).json({ message: 'OTP sent successfully' });
        });
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
};

const ConfirmOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!otpStore[email]) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        if (otpStore[email] !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        delete otpStore[email]
        res.status(200).json({ message: "otp verified" });
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
};

const NewPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await Employee.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
       
        await Employee.findOneAndUpdate({ email: email.toLowerCase() }, { password: newPassword })
        res.status(200).json({ message: "Password changed successfully" })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}


module.exports= {
    UserLogin,
    ShowUserTasks,
    SubmitTaskReport,
    TaskReports,
    ChangePassword,
    ResetSendOtp,
    ConfirmOtp,
    NewPassword
}