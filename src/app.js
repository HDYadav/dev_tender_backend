const express = require('express');
const { adminAuth, UserAuth } = require("./middlewares/auth");
const connectDB = require("./config/Database"); 
const User = require("./models/User"); 
const { ValidateSignupData } = require("../src/utils/Validation");

const cookieParser = require('cookie-parser');

const bcrypt = require('bcrypt');

var jwt = require("jsonwebtoken");

const app = express();


app.use(express.json()); // this code covert all request in javascript format

app.use(cookieParser());
 


app.get("/user", async (req, res) => {
  
  const user = await User.findOne({ emailId :"hari@gmail.com"});
  res.send(user);
})

app.get("/users", async (req, res) => {  
  const users = await User.find({});
  res.send(users);
});

app.delete("/delete", async (req, res) => {
  
  const userId = req.body.userId;  
  try {
    
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted sucessfully");
  } catch {
    res.send("there are error to delete");
  }
  
});


app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id:userId }, data);
    res.send("User updated sucessfully");
  } catch {
    res.send("there are error to updated");
  }
});




app.post("/signup", async (req, res) => {

  try {

    ValidateSignupData(req); 
    const {firstName,lastName,emailId, password } = req.body; 
    const hashPassowrd = await bcrypt.hash(password, 10);
 

    const user = new User({ firstName, lastName, emailId, password:hashPassowrd });


    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.status(400).send("Signup Error: " + error.message);
  }
});

app.post("/login",  async (req, res) => {
  try {
    const { emailId, password } = req.body; // Fixed typo from passsword to password

    const user = await User.findOne({ emailId: emailId }); // Added await



    if (!user) {
      throw new Error("Username or password mismatch");
    }

    const response = await user.ValidatePassword(password);; // Added await and fixed typo

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

app.get("/profile", UserAuth, async (req, res) => {
 

  try { 

    const user = req.user;  // get from auth 
    res.send(user);

  } catch (error) {
    return res.status(400).send("Invalid token: " + error.message); // Handle invalid token
  }
});


connectDB()
  .then(() => {
      console.log("Database connected");
      app.listen(3000, () => {
        console.log("Server is running");
      });
  })
  .catch((err) => {
    console.log("Database can't not be connected");
  });


