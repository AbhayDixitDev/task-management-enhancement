const Employee = require("../models/employeeModel")

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

const showUsers = async(req, res) => {
    try {
        
        let users = await Employee.find()
        users = users.filter((user) => !user.isAdmin)
        res.status(200).json({ message: "Users fetched successfully", users })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const deleteUser = async(req, res) => {
    const { id } = req.params
    try {
        const user = await Employee.findByIdAndDelete(id)
        console.log(id);
        
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const fetchUser = async(req, res) => {
    const { id } = req.params
    try {
        const user = await Employee.findById(id)
        res.status(200).json({ message: "User fetched successfully", user })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const editUser = async(req, res) => {
    const { id } = req.params
    const { name, email, password, department, position, manager } = req.body
    try {
        const user = await Employee.findByIdAndUpdate(id, { name, email, password, department, position, manager })
        res.status(200).json({ message: "User updated successfully", user })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}



module.exports = {
    AdminLogin,
    CreateUser,
    showUsers,
    deleteUser,
    fetchUser,
    editUser
}