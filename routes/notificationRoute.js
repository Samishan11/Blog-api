const express = require('express');
const notificationRoute = express.Router();
const Notification = require("../models/notificationModel")
const auth = require('../middleware/verfiyUser')
const FollowModel = require('../models/followModel');

// show notification
notificationRoute.get("/notifications/:userId", auth.verifyUser, async (req, res) => {
    const userId = req.userInfo._id
    const notification = await Notification.find({ notification_to: userId }).populate("notification_by")
    res.json(notification)
})

// clear notification
notificationRoute.delete("/clearnotification/:userId", auth.verifyUser, async (req, res) => {
    const userId = req.userInfo._id
    const clearNotify = await Notification.deleteMany({ notification_to: userId })
    res.json('clear notification')
})


module.exports = notificationRoute;