const express = require('express');

const connectDB = require("./config/Database");  
const cookieParser = require('cookie-parser');  
var jwt = require("jsonwebtoken");

const authRoute = require('./routes/authRoute');
const profileRoute = require("./routes/profileRoute");
const userRoute = require("./routes/userRoute");
const requestRoute = require('./routes/requestRoute');


const app = express();


app.use(express.json()); // this code covert all request in javascript format

app.use(cookieParser());

app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", userRoute); 
app.use("/", requestRoute); 




connectDB()
  .then(() => {
      console.log("Database connected");
      app.listen(3000, () => {
        console.log("Server is running on port 3000");
      });
  })
  .catch((err) => {
    console.log("Database can't not be connected");
  });


