const mongoose = require('mongoose')

const Follow = mongoose.Schema({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
module.exports = mongoose.model("Follow",Follow)