const express = require('express');
const app = express();
const Commentmodel = require("./models/commentModel")
const NotificationModel = require("./models/notificationModel")
const FollowModel = require('./models/followModel')
require('./connection/conn');
const cors = require('cors');
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Blogmodel = require("./models/blogModel")
const Usermodel = require('./models/userModel')
const Notification = require('./routes/notificationRoute')
app.use(Notification)
// socket 
const { Server } = require("socket.io")
const http = require("http")
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
});
var onlineUsers = [];
function removeUser(id) {
    onlineUsers = onlineUsers.filter(user => user.socketId != id)
}
// get users
function getUser(userId) {
    const sockets = [];
    for (var i = 0; i <= onlineUsers.length; i++) {
        const data = onlineUsers[i]
        if (data) {
            const data_ = JSON.parse(data)
            // console.log(userId)
            // console.log(data_.userId)
            if (data_.userId === userId) {
                // console.log("found")
                sockets.push(data_.socketId)
            }
        }

    }
    return sockets;
}
io.on("connection", (socket) => {
    console.log("client connected");

    // adding clients
    socket.on("addClient", (data) => {
        if (data.socketId !== undefined) {
            if (onlineUsers.indexOf(data) === -1) {
                onlineUsers.push(JSON.stringify(data))
                const uniqueChar = [... new Set(onlineUsers)]
                onlineUsers = [...uniqueChar].reverse().reverse()
                // console.log(onlineUsers);
            }
        }
    })
    // commetn post using socket 
    socket.on("commentPost", (data) => {
        const user = data.user
        const blog = data.blog
        const text = data.text
        const date = new Date().toDateString()
        // 
        var followername = ""
        Usermodel.findOne({ _id: user }).then((user) => {
            followername = user.username
            // 
            const commentSave = new Commentmodel({
                user: user,
                blog: blog,
                text: text,
                date: date
            })
            commentSave.save()
            if (commentSave) {
                // get blog user and pus notification 
                Blogmodel.findOne({ _id: blog }).then((val) => {
                    const notification = new NotificationModel({
                        notification_by: user,
                        notification_to: val.user,
                        date: date,
                        notification: followername + " commented on your post at " + date
                    })
                    notification.save()
                    // push notification
                    const sockets = getUser(val.user)
                    // console.log("sockets", sockets);
                    for (var i = 0; i < sockets.length; i++) {
                        io.to(sockets[i]).emit("notification", {
                            notification: notification
                        })
                        // console.log("usocket", sockets);
                    }
                })

            }
        })
    })

    // follow user
    socket.on('follow', (data) => {
        const follower = data.follower
        const following = data.following
        const date = new Date().toDateString()
        // 
        var followername = ""
        Usermodel.findOne({ _id: follower }).then((user) => {
            followername = user.username
            // 
            const followUser = new FollowModel({
                follower: follower,
                following: following
            })
            followUser.save()
            if (followUser) {
                const notification = new NotificationModel({
                    notification_by: follower,
                    notification_to: following,
                    date: date,
                    notification: followername + " followed you " + date
                })
                notification.save()
            }
        })
    })

    // unfollow user
    socket.on('unfollow',(data)=>{
        const follower = data.follower
        const following = data.following
        FollowModel.deleteOne({
            follower:follower,
            following:following
        },(function(err ,user){
            if(!err){
                console.log("unfollow");
            }
        })) 
    })

    // disconnect
    socket.on('disconnect', () => {
        console.log('disconnected');
        removeUser(socket.id)
    })
})
// static files
app.use("/uploads/images", express.static('uploads/images'));
app.use("/blog/uploads/images", express.static('uploads/images'));
app.use("/profile/uploads/images", express.static('uploads/images'));
app.use("/user/blogs/uploads/images", express.static('uploads/images'));
app.use("/updateblog/uploads/images", express.static('uploads/images'));

const authRoute = require('./routes/auth')
app.use(authRoute);

const blogRoute = require('./routes/blog')
app.use(blogRoute);

const followRoute = require('./routes/follow');
const FollowRoute = require('./routes/follow');
app.use(followRoute)

server.listen(5000, () => {
    console.log("server running on port");
})