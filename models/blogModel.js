const mongoose = require('mongoose');
const Schema = mongoose.Schema

// const Blog = mongoose.model("Blog",{
const Blog = mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
    user:{
        type:Schema.Types.ObjectId , ref:"User"
    },
    catagory:{
        type:String
    },
    like:[{ type:Schema.Types.ObjectId , ref:"User"}],
    date:{
        type:String
    }
})

// module.exports = Blog;
module.exports = mongoose.model("Blog",Blog)