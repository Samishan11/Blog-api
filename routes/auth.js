const express = require('express');
const authRoute = express.Router();
const User = require("../models/userModel")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/verfiyUser');
const Blog = require('../models/blogModel')
const Commentmodel = require('../models/commentModel')
const upload = require('../upload/upload')
// register api
authRoute.post('/register', async (req, res) => {
    const password = req.body.password;
    const retypepassword = req.body.retypepassword
    const username = req.body.username
    const email = req.body.email
    User.findOne({ email: email }).then(function (userData) {
        // check if the user already exist in database or not 
        if (userData != null) {
            res.status(200).json({ message: "username already exist" })
        } else if (password === retypepassword) {
            bcryptjs.hash(password, 10, async (e, has_password) => {
                const register = await new User({
                    username: username,
                    email: email,
                    password: has_password
                })
                register.save().then(
                    (result) => {
                        res.json({ message: "register sucessfully" })
                    }
                ).catch(
                    (e) => {
                        res.json(e)
                    }
                )
            })
        }
        else {
            res.json({ message: "password not match" })
        }
    })
})

// login api 
authRoute.post('/login', async (req, res) => {
    try {
        const password = req.body.password;
        const email = req.body.email;
        // taking user email from database 
        const userData = await User.findOne({ email: email });
        // comparing the user register password and login password
        const passcompare = await bcryptjs.compare(password, userData.password);
        if (passcompare) {
            // generating token for the login - jsonwebtoken(jwt token)
            const jwt_token = await jwt.sign({ userId: userData._id }, "anysecretkey");
            res.json({ message: "login success", "token": jwt_token })
        } else {
            res.json({ message: "username or password not match " })
        }
    } catch (e) {
        res.json({ message: "username or password not match" })
    }
});

// update user detail api
authRoute.put('/user/update/:userId', upload.single('image'), auth.verifyUser, async (req, res) => {
    try {
        const id = req.userInfo._id;
        const image = req.file.path
        const userUpdate = await User.findByIdAndUpdate(id, {
            username: req.body.username,
            email: req.body.email,
            bio: req.body.bio,
            image: image
        },
            { new: true }
        ).then((e) => {
            res.json({ message: "Profile Update Sucessfully" })
        }).catch((e) => {
            res.json({ message: "someting went wrong" })
        })
    } catch (e) {
        res.status(500).json("something went wrong")
    }
})
// upload profile pic api

// authRoute.put('/profilepic/update', upload.single('image'), auth.verifyUser, async (req, res) => {
//     try {
//         const id = req.userInfo._id;
//         const image = req.file.path
//         console.log(image);
//         const userUpdate = await User.findByIdAndUpdate(id, {
//             image: image
//         },
//             { new: true }
//         ).then((e) => {
//             res.json({ message: "Profile Pic Update Sucessfully" })
//             console.log(e);
//         }).catch((e) => {
//             res.json({ message: "someting went wrong" })
//             console.log(e);
//         })
//     } catch (e) {
//         res.json({ message: "something went wrong" })
//         console.log(e);
//     }
// })

// change password api
authRoute.put('/change/password', auth.verifyUser, async (req, res) => {
    try {
        const id = req.userInfo._id;
        const password = req.body.password
        const oldpass = req.body.oldpassword
        const userPass = await User.findOne({ _id: id })
        const len = password.length
        const passcompare = await bcryptjs.compare(oldpass, userPass.password);
        if (oldpass === password) {
            res.json({ message: 'Old password and new password is too similar' })
        } else if (passcompare) {
            if (len < 6) {
                res.json({ message: 'Password must be more that 6 charector' })
            } else {
                bcryptjs.hash(password, 10, async (e, has_password) => {
                    // change the user password
                    const userData = await User.findByIdAndUpdate(id, {
                        password: has_password,
                    })
                    res.json({ message: 'Password update sucessfully' })
                    // console.log("success");
                })
            }
        } else {
            res.json({ message: 'Old password not match' })
            // console.log("err");
        }
    } catch (e) {
        res.status(500).json("something went wrong")
    }
})

// delete user api
authRoute.delete('/user/delete/:userId', auth.verifyUser, async (req, res) => {
    try {
        const id = req.params.userId
        try {
            await User.deleteOne({ _id: id })
            await Blog.deleteMany({ user: id })
            await Commentmodel.deleteMany({ user: id })
            // console.log("user deleted")
            res.json("user deleted")
        } catch (error) {
            res.json(error)
        }
    } catch (e) {
        res.status(500).json(e)
    }
})

authRoute.get("/profile/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        const profile = await User.findOne({ _id: userId })
        res.json(profile)
    } catch (error) {
        res.json(error)
    }
})

module.exports = authRoute;
