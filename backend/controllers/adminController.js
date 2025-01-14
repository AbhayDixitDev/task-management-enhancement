const User = require("../models/userModel")

const AdminLogin = async(req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
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
            res.status(200).json({ message: "Login successful", user:{ name: user.name, email: user.email, department: user.department, position: user.position} })
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
    }


const CreateUser= async(req, res) => {
    const { name, email, password, department, position } = req.body
    console.log(req.body);
    
    try {
        const user = await User.create({ name, email, password, department, position })
        
        
        res.status(200).json({ message: "User created successfully", user })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

module.exports = {
    AdminLogin,
    CreateUser
}