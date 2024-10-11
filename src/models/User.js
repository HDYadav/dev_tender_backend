
const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true, 
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);


const User = mongoose.model("User", UserSchema);

module.exports = User;