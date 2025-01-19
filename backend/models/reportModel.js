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



// {
//     "_id": {
//       "$oid": "678aa08ca2262165d18ae082"
//     },
//     "subject": "WebSite BackEnd",
//     "description": "Please Complete website backend as soon as possible, cause it is urgest!",
//     "dueDate": {
//       "$date": "2025-01-22T00:00:00.000Z"
//     },
//     "userId": {
//       "$oid": "6787f5d1713fb43a2bd6c5a8"
//     },
//     "file": [
//       "https://drive.google.com/file/d/1lCwahr34H8777p0MUmM8_vYxB9Q6NwZc/preview",
//       "https://drive.google.com/file/d/1_y2un2z5XwF3VbYGCiOsW6E8pSXGSxRk/preview"
//     ],
//     "status": "Pending",
//     "createdAt": {
//       "$date": "2025-01-17T18:25:16.308Z"
//     },
//     "updatedAt": {
//       "$date": "2025-01-19T10:14:14.211Z"
//     },
//     "__v": 0,
//     "reports": [
//       ""
//     ]
//   }