const mongoose = require('mongoose');

const Register = mongoose.model("User",{
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:false,
    },
    bio:{
        type:String,
        require:false,
    }
})

module.exports = Register;
