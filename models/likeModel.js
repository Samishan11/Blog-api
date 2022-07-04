const mongoose = require('mongoose')

const Like  = mongoose.model("Like",{
    user:{
        type:mongoose.Schema.Types.ObjectId , ref:"User"
    },
    blog:{
        type:mongoose.Schema.Types.ObjectId , ref:"Blog"
    }
})

module.exports = Like;