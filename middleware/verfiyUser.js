const jwt = require("jsonwebtoken");
const User = require('../models/userModel');

// middlewarre api to verify the user 
module.exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, "anysecretkey");
        // console.log(data);
        await User.findOne({ _id: data.userId }).then((result) =>{
            req.userInfo = result;
            // console.log(result);
            next();
        }).catch((e) => {
            res.json({ 'error': e })
        })
    } catch (e) {
        res.json({ "error": e })
    }
}