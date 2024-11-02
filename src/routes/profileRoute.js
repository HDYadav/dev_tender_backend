
const express = require("express");

const profileRoute = express.Router();
const { UserAuth } = require("../middlewares/auth");
const { ValidateEditProfileData } = require("../utils/Validation");
const bcrypt = require("bcrypt");
const User = require("../models/User");  

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


profileRoute.post("/update_password", UserAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body; // Get passwords from the request body
    const loggedInuser = req.user; // Get logged in user from auth middleware

    // Check if the old password is valid
    const isValidPassword = await loggedInuser.PasswordExists(oldPassword);

    if (!isValidPassword) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // Hash the new password and update it
    const hashedNewPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds
    loggedInuser.password = hashedNewPassword;

    // Save the updated user with the new password
    await loggedInuser.save();

    res.json({ message: "Password has been successfully updated!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating password: " + error.message });
  }
});



module.exports = profileRoute;