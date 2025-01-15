const mongoose = require('mongoose')

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    task:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',        
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Employee', employeeSchema)