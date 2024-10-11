const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

// Method to generate JWT
UserSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "Hari@123", { expiresIn: "1d" });
  return token;
};

// Method to validate password
UserSchema.methods.ValidatePassword = async function (UserInputPassword) {
  const user = this;
  // Added 'await' since bcrypt.compare is asynchronous
  const isPasswordValid = await bcrypt.compare(
    UserInputPassword,
    user.password
  );
  return isPasswordValid;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
