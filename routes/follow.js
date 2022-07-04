const express = require('express');
const FollowRoute = express.Router();
const FollowModel = require('../models/followModel')
const auth = require('../middleware/verfiyUser');

// follow bloger api
FollowRoute.post('/follow/bloger', auth.verifyUser, async (req, res) => {
    try {
        const followingid = req.body.followingid
        const followPost = await new FollowModel({
            follower: req.userInfo._id,
            following: followingid,
        }).save()
        res.json(followPost)
    } catch (error) {
        res.json('something went wrong')
    }
})

// unfollow bloger api
FollowRoute.delete('/unfollow/blogger', auth.verifyUser, async (req, res) => {
    try {
        const unfollow = await FollowModel.findOneAndDelete({ _id: req.body.followid, follower: req.userInfo._id })
        res.json({ message: "unfollow sussfully" })
    } catch (error) {
        res.json(error)
    }
})

// show followers only
FollowRoute.get('/show/followers/:userId', (req, res) => {
    const userId = req.params.userId
    FollowModel.find({ following: userId }).then((result) => {
        res.json(result)
    })
})

// show following users only
FollowRoute.get('/show/followings/:userId', (req, res) => {
    const userId = req.params.userId
    FollowModel.find({ follower: userId }).then((result) => {
        res.json(result)
    })
})

module.exports = FollowRoute;