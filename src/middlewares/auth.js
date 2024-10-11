
const jwt = require('jsonwebtoken');
const User =  require('../models/User')


const adminAuth = (req, res, next) => {
  console.log("admin checked");
  const token = "Xyz11";
  if (token === "Xyz") {
    next();
  } else {
   
      res.status(401).send("Unauthorized");
  }
};


const UserAuth = async (req, res, next) => { 
  
 try {
    const { token } = req.cookies;
  if (!token) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  const decoded = await jwt.verify(token, "Hari@123");

  const { _id } = decoded;
  const users = await User.findById({ _id });

  if (!users) {
    throw new Error("User Does not Exists");
   }
   
   req.user = users; // attached the user and get it in app

    next();
 } catch (error) {
   res.status("").send("Login Error: " + error.message);
  }

  
};




module.exports = {
  adminAuth,
  UserAuth,
};