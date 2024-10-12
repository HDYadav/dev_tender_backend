
const express = require("express");

const profileRoute = express.Router();
const { UserAuth } = require("../middlewares/auth");
const { ValidateEditProfileData } = require("../utils/Validation");



profileRoute.get("/profile", UserAuth, async (req, res) => {
  try {
    const user = req.user; // get from auth
    res.send(user);
  } catch (error) {
    return res.status(400).send("Invalid token: " + error.message); // Handle invalid token
  }
});

profileRoute.post("/profile_edit", UserAuth, async (req, res) => {
  
  try {
    if (!ValidateEditProfileData(req)) {
      throw new Error("invalid edit data");
    }
    const loggedInuser = req.user; 

    Object.keys(req.body).forEach((key) => loggedInuser[key] = req.body[key]);
    
    await loggedInuser.save();

    res.json({message:`${loggedInuser.firstName} your profile has been updated!`,data:loggedInuser});

  } catch (error) {
    return res.status(400).send("Invalid token: " + error.message); // Handle invalid token
  }
  
})



module.exports = profileRoute;