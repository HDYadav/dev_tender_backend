
const adminAuth = (req, res, next) => {
  console.log("admin checked");
  const token = "Xyz11";
  if (token === "Xyz") {
    next();
  } else {
   
      res.status(401).send("Unauthorized");
  }
};


const UserAuth = (req, res, next) => {
  console.log("user checked");
  const token = "123";
  if (token === "123") {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};




module.exports = {
  adminAuth,
  UserAuth,
};