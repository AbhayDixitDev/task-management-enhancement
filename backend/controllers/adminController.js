const Employee = require("../models/employeeModel")
const fs = require('fs');
const TaskModel = require('../models/taskModel'); 
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();


const AdminLogin = async(req, res) => {
    const { email, password } = req.body
    try {
        const user = await Employee.findOne({ email })
        if(!user){
            res.status(400).json({ message: "either username or password is incorrect" })
        }
        if(!user.isAdmin){
            res.status(400).json({ message: "You are not an admin" })
        }
        if(user.password !== password){
           res.status(400).json({ message: "either username or password is incorrect" })
        }
        if(user && user.isAdmin && user.password === password){
            res.status(200).json({ message: "Login successful", user:{ name: user.name, email: user.email, department: user.department, position: user.position, id:user._id} })
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
    }


const CreateUser= async(req, res) => {
    const { name, email, password, department, position, manager } = req.body
    console.log(req.body);
    
    try {
        const user = await Employee.create({ name, email, password, department, position, manager })
        console.log(user);
        
        
        res.status(200).json({ message: "User created successfully", user })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const ShowUsers = async(req, res) => {
    try {
        
        let users = await Employee.find()
        users = users.filter((user) => !user.isAdmin)
        res.status(200).json({ message: "Users fetched successfully", users })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const DeleteUser = async(req, res) => {
    const { id } = req.params
    try {
        const user = await Employee.findByIdAndDelete(id)
        console.log(id);
        
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const FetchUser = async(req, res) => {
    const { id } = req.params
    try {
        const user = await Employee.findById(id)
        res.status(200).json({ message: "User fetched successfully", user })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const EditUser = async(req, res) => {
    const { id } = req.params
    const { name, email, password, department, position, manager } = req.body
    try {
        const user = await Employee.findByIdAndUpdate(id, { name, email, password, department, position, manager })
        res.status(200).json({ message: "User updated successfully", user })
    } catch (error) {
        res.status(404).json({ message: error.message })
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

const AssignTask = async (req, res) => {
    console.log(req.body);
    console.log(req.file);

    try {
        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const { subject, description, dueDate, userid } = req.body;

    
        const fileMetadata = {
            name: req.file.originalname,
            mimeType: req.file.mimetype,
        };
        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path),
        };

        const driveResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        const fileId = driveResponse.data.id;
        console.log("Uploaded File ID:", fileId);

        await drive.permissions.create({
            fileId: fileId,
            resource: {
                role: 'reader',
                type: 'anyone',
            },
        });

        const publicUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  
        

        // Create task in the database
        const task = await TaskModel.create({
            subject,
            description,
            dueDate,
            userId: userid,
            file: publicUrl,
            status: "pending"
        });

  
        fs.unlinkSync(req.file.path);

        res.status(201).json({ message: "Task assigned successfully", task });
    } catch (error) {
        console.error("Error assigning task:", error);
        res.status(500).json({ message: error.message });
    }
}

const ShowTasks = async(req, res) => {
    try {
        const tasks = await TaskModel.find().populate('userId');
        res.status(200).json({ message: "Tasks fetched successfully", tasks })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const DeleteTask = async (req, res) => {
    try {
        const { id } = req.params
        // console.log(id);
        
        const res = await TaskModel.findByIdAndDelete(id)
        // console.log(res);
        
        res.status(200).json({ message: "Task deleted successfully" })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const UpdateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const task = await TaskModel.findByIdAndUpdate(id, { status })
        console.log(task);
        
        res.status(200).json({ message: "Task status updated successfully" })
    } catch (error) {
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
    UpdateTaskStatus
}