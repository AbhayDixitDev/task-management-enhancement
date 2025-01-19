const mongoose = require('mongoose')

const reportSchema = mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    description: {
        type: String,
        required: true
    },
    reportFiles: [{
        type: String
    }],
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    reportDate: {
        type: Date,
        default: () => new Date().toISOString().split('T')[0]
    },
    reportTime: {
        type: String,
        default: () => new Date().toLocaleTimeString('en-US')
    },
    feedback:{
        type: String,
        default: ''        
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Report', reportSchema)


