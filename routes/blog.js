const express = require('express');
const route = express.Router();
const Blog = require('../models/blogModel')
const Catagory = require('../models/catagoryModel')
const auth = require('../middleware/verfiyUser')
const upload = require('../upload/upload')
const Comment = require('../models/commentModel');
const Replycomment = require('../models/replyComment');
const Like = require('../models/likeModel');
const Followuser = require('../models/followModel')


// blog post api
route.post('/blog/post', auth.verifyUser, upload.single("image"), async (req, res) => {
    try {
        const date = new Date().toDateString()
        const _post = await new Blog({
            title: req.body.title,
            description: req.body.description,
            image: req.file.path,
            user: req.userInfo._id,
            date: date,
            catagory: req.body.catagory
        })
        _post.save()
        res.json({ message: "Blog Post Sucessfully" });
    } catch (e) {
        res.json({ message: "Something went wrong" })
    }
})

// blog update api
route.put('/blog/update/:blogid', auth.verifyUser, upload.single('image'), async (req, res) => {
    try {
        const blogid = req.params.blogid
        const date = new Date().toDateString()
        await Blog.findOneAndUpdate({ _id: blogid, username: req.userInfo._id }, {
            $set: {
                title: req.body.title,
                description: req.body.description,
                image: req?.file?.path,
                user: req.userInfo._id,
                date: date,
                catagory: req.body.catagory
            }
        },
            { new: true }
        ).then((e) =>
            res.json({ message: "Blog update sucessfully" })
        ).catch((e) => {
            res.json({ message: "cannot delete other user" })
        })
    } catch (error) {
        res.json('something went wrong')
    }
})

// blog delete api
route.delete('/blog/delete/:blogid', auth.verifyUser, async (req, res) => {
    try {
        const blogid = req.params.blogid
        const deleteBlog = await Blog.findOneAndDelete({ _id: blogid, user: req.userInfo._id });
        res.json({ message: "Blog deleted" })
    } catch (error) {
        res.json({ message: 'SOMETHING WENT WRONG' })
    }
})

// blog comment post api
route.post('/blog/comment', auth.verifyUser, async (req, res) => {
    try {
        const id = req.body.blogid
        const comment = await new Comment({
            username: req.userInfo._id,
            text: req.body.comment,
            blog: id
        })
        comment.save()
        res.json(comment)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})
// blog replycomment post api
route.post('/blog/replycomment', auth.verifyUser, async (req, res) => {
    try {
        const id = req.body.commentid
        const comment = await new Replycomment({
            username: req.userInfo._id,
            text: req.body.replycomment,
            comment: id
        })
        comment.save()
        res.json(comment)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})
//  delete comment
route.delete('/delete/comment/:commentid', auth.verifyUser, async (req, res) => {
    try {
        const commentid = req.params.commentid
        const deletecomment = await Comment.deleteOne({ _id: commentid, user: req.userInfo._id })
    } catch (error) {

    }
})

// show comment 
route.get('/show/comment/:blog', async (req, res) => {
    try {
        const blog = req.params.blog
        const _comments = await Comment.find({ blog: blog }).populate("user")
        res.json(_comments)
    } catch (error) {
        res.json(error)
    }
})

// like
route.put('/blog/like/:blogid', auth.verifyUser, async (req, res) => {
    try {
        const blogid = req.body.blogid
        const blog = await Blog.findOneAndUpdate({ _id: req.params.blogid }, {
            $push: {
                like: req.userInfo._id
            }
        },
            { new: true })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})
// unlike
route.put('/blog/unlike/:blogid', auth.verifyUser, async (req, res) => {
    try {
        const blogid = req.body.blogid
        const blog = await Blog.findOneAndUpdate({ _id: req.params.blogid }, {
            $pull: {
                like: req.userInfo._id
            }
        },
            { new: true })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

// // blog like api 
// route.post('/blog/like', auth.verifyUser, async (req, res) => {
//     try {
//         const blogid = req.body.blogid
//         const like = await new Like({
//             user: req.userInfo._id,
//             blog: blogid
//         })
//         like.save()
//         res.json({ message: like })
//     } catch (error) {
//         res.status(500).json({ message: error })
//     }
// })
// // blog unlike api 
// route.delete('/blog/unlike', auth.verifyUser, async (req, res) => {
//     try {
//         const likeid = req.body.likeid
//         const unlike = await Like.findOneAndDelete({ _id: likeid, user: req.userInfo._id }).then(() => {
//             res.json({ message: "blog unliked" })
//         }).catch((e) => {
//             res.json({ message: "Cannot unlike the blog", e })
//         })
//     } catch (error) {
//         res.status(500).json({ message: error })
//     }
// })

//  get blopg by id  
route.get('/blog/:blogid', (req, res) => {

    const blogid = req.params.blogid
    Blog.findOne({ _id: blogid }).populate('user').populate('user').then(result => {
        // console.log(result);
        res.json(result)
    })
})
// find blog by catagory
route.get('/get/allblog/:catagory', async (req, res) => {
    try {
        const allBlog = await Blog.find({catagory:req.params.catagory});
        res.json(allBlog)
    } catch (error) {
        res.json(error)
    }
})
// all blog get api 
route.get('/get/allblog', async (req, res) => {
    try {
        const allBlog = await Blog.find();
        res.json(allBlog)
    } catch (error) {
        res.json(error)
    }
})

// get blog belong to user
route.get('/userblog/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        const userBlog = await Blog.find({ user: userId })
        res.json(userBlog)
    } catch (error) {
        res.json({ message: "something went wrong" })
    }
})

// blog serach blog api 
route.get('/search/:name', async (req, res) => {
    try {
        const regex = new RegExp(req.params.name, "i");
        const getbyName = await Blog.find({ name: regex });
        res.status(200).json({ message: getbyName })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

// filter follower

route.get('/filter/follower/:userId', auth.verifyUser, (req, res) => {

    const follower = req.userInfo._id
    const following = req.params.userId
    Followuser.findOne({ follower: follower, following: following }).then(function (result) {
        res.json(result)
    })
})

module.exports = route;