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


const ValidateEditProfileData = (req) => {
  
  const allowedFields = ["firstName", "lastName", "skills"];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );

  return isEditAllowed;
}

module.exports = {
  ValidateSignupData,
  ValidateEditProfileData,
};
