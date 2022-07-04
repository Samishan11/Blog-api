const mongoose = require('mongoose')

const Notification  = mongoose.Schema({
    notification_by:{
        type:mongoose.Schema.Types.ObjectId , ref:"User"
    },
    notification_to:{
        type:mongoose.Schema.Types.ObjectId , ref:"User"
    },
    date:{
        type: String
    },
    notification:{
        type:String
    }
})

// module.exports = Comment;
module.exports = mongoose.model("Notification",Notification)