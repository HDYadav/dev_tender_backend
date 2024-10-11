const Validator = require("validator");

const ValidateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!Validator.isEmail(emailId)) {
    throw new Error("Invalid Email");
  } else if (!Validator.isStrongPassword(password)) {
    throw new Error("Password should be strong");
  }
};

module.exports = {
  ValidateSignupData,
};
