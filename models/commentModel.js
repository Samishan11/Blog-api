const mongoose = require('mongoose')

// const Comment  = mongoose.model("Comment",{
const Comment  = mongoose.Schema({
    text:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId , ref:"User"
    },
    blog:{
        type:String
    },
    date:{
        type:String
    }
})

// module.exports = Comment;
module.exports = mongoose.model("Comment",Comment)