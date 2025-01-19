const Employee = require("../models/employeeModel");
const TaskModel = require('../models/taskModel'); 

const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const { google } = require('googleapis');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const AdminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Employee.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "either username or password is incorrect" });
        }
        if (!user.isAdmin) {
            return res.status(400).json({ message: "You are not an admin" });
        }
        if (user.password !== password) {
            return res.status(400).json({ message: "either username or password is incorrect" });
        }
        if (user && user.isAdmin && user.password === password) {
            res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email, department: user.department, position: user.position, id: user._id } });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const CreateUser = async (req, res) => {
    const { name, email, password, department, position, manager } = req.body;
    console.log(req.body);
    

    try {
        const user = await Employee.create({ name, email, password, department, position, manager });

        res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const ShowUsers = async (req, res) => {
    try {
        let users = await Employee.find();
        // console.log(users)
        users = users.filter(user => !user.isAdmin);
        res.status(200).json({ message: "Users fetched successfully", users });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const DeleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Employee.findByIdAndDelete(id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const FetchUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Employee.findById(id);
        res.status(200).json({ message: "User fetched successfully", user });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const EditUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, department, position, manager } = req.body;
    try {
        const user = await Employee.findByIdAndUpdate(id, { name, email, password, department, position, manager });
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oAuth2Client });
const AssignTask = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one file is required" });
        }

        const { subject, description, dueDate, userid } = req.body;
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

        const task = await TaskModel.create({
            subject,
            description,
            dueDate,
            userId: userid,
            file: fileLinks,
            status: "pending"
        });

        res.status(201).json({ message: "Task assigned successfully", task });
    } catch (error) {
        console.error("Error assigning task:", error);
        res.status(500).json({ message: error.message });
    }
};

const ShowTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find().populate('userId');
        res.status(200).json({ message: "Tasks fetched successfully", tasks });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const DeleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const res = await TaskModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const UpdateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const task = await TaskModel.findByIdAndUpdate(id, { status });

        res.status(200).json({ message: "Task status updated successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const ChangePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;
        const admin = await Employee.findById(id);
        if (admin.password !== oldPassword) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        if (admin.password === newPassword) {
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

        const admin = await Employee.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!admin.isAdmin) {
            return res.status(400).json({ message: "Only admins can reset passwords" });
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

        const admin = await Employee.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!admin.isAdmin) {
            return res.status(400).json({ message: "Only admins can reset passwords" });
        }
        await Employee.findOneAndUpdate({ email: email.toLowerCase() }, { password: newPassword })
        res.status(200).json({ message: "Password changed successfully" })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
     
        
    }
}
module.exports = {
    AdminLogin,
    CreateUser,
    ShowUsers,
    DeleteUser,
    FetchUser,
    EditUser,
    AssignTask,
    ShowTasks,
    DeleteTask,
    UpdateTaskStatus,
    ChangePassword,
    ResetSendOtp,
    ConfirmOtp,
    NewPassword
}