const mongoose = require('mongoose')

const catagory = mongoose.model('Catagory',{
    catagory:{
       type:[ "Animal","Nature","Travell","Food","Universe"]
    }
})
module.exports = catagory;