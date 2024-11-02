const express = require('express');

const User = require("../models/User");  
const { UserAuth } = require('../middlewares/auth');

const ConnectionRequest = require("../models/connectionRequestSchema");
const authRoute = require('./authRoute');
const { set } = require('mongoose');


const userRoute = express.Router();



const USER_SAVED_DATA = ['firstName','lastName'];


userRoute.get("/user", async (req, res) => {
  const user = await User.findOne({ emailId: "hari@gmail.com" });
  res.send(user);
});

userRoute.get("/users", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

userRoute.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted sucessfully");
  } catch {
    res.send("there are error to delete");
  }
});

userRoute.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User updated sucessfully");
  } catch {
    res.send("there are error to updated");
  }
});



userRoute.get("/user/request/", UserAuth, async (req, res) => {
  
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserID: loggedInUser._id,
      status: "accepted",
    }).populate("fromUserID", ["firstName", "lastName"]);

    return res.json({
      message: "user connection request list",
      connectionRequest,
    });
    
  } catch (error) {
    res.status(400).send( 
      "Error :" + error.message
    )
  }
  
})

userRoute.get("/feed", UserAuth, async (req, res) => {

  const loggedInUser = req.user; 

  const page = parseInt(req.query.page) || 1; 
  let limit = parseInt(req.query.limit) || 10;

  limit = limit > 50 ? 50 : limit;
  

  const skip = (page - 1) * limit;




  // const connectionRequest = await ConnectionRequest.find({
  //   $or: [{ fromUserID: loggedInUser._id }, { toUserID: loggedInUser._id }],
  // })
  //   .select("fromUserID toUserID")
  //   .populate("fromUserID", "firstName")
  //   .populate("toUserID", "firstName");

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserID: loggedInUser._id }, { toUserID: loggedInUser._id }],
    }).select("fromUserID toUserID");

    // Initialize hideUserFromFeed set
    const hideUserFromFeed = new Set();

    // Populate hideUserFromFeed with IDs from connection requests
    connectionRequest.forEach((element) => {
      hideUserFromFeed.add(element.fromUserID.toString());
      hideUserFromFeed.add(element.toUserID.toString());
    });
  
  console.log(hideUserFromFeed);

    // Find users excluding those in hideUserFromFeed and the logged-in user
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAVED_DATA)
      .skip(skip).limit(limit);

   return res.json({
     message: "User feed data",
     users, 
   });

});



 

module.exports = userRoute;