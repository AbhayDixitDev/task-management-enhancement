const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    file: {
        type:[],
        // required: true
    },
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    }],
    status: {
        type: String,
        required: true,
        default: 'pending'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Task', taskSchema)




