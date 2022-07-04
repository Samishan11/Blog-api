const mongoose = require('mongoose')

const ReplyComment  = mongoose.model("ReplyComment",{
    text:{
        type:String
    },
    username:{
        type:mongoose.Schema.Types.ObjectId , ref:"User"
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId , ref:"comment"
    }
})

module.exports = ReplyComment;