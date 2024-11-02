

const express = require('express');
const authRoute = express.Router();
const bcrypt = require("bcrypt");
const { ValidateSignupData } = require("../utils/Validation");
const User = require("../models/User");  

authRoute.post("/signup", async (req, res) => {
  try {
    ValidateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassowrd = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassowrd,
    });

    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.status(400).send("Signup Error: " + error.message);
  }
});

authRoute.post("/login", async (req, res) => {
  try { 
     
    const { emailId, password } = req.body;  

    const user = await User.findOne({ emailId: emailId });  

    if (!user) {
      throw new Error("Username or password mismatch");
    }

    const response = await user.ValidatePassword(password);  

    if (response) {
      const token = await user.getJWT();

      res.cookie("token", token);
      res.send("User successfully logged in");
    } else {
      res.status(400).send("Username or password mismatch");
    }
  } catch (error) {
    res.status(400).send("Login Error: " + error.message);
  }
});




authRoute.post("/logout", async (req, res) => {

    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .send("logout");
    
})


module.exports = authRoute;