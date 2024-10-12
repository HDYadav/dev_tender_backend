const express = require('express');

const User = require("../models/User");  
const userRoute = express.Router();


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




module.exports = userRoute;