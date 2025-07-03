const jwt = require("jsonwebtoken");
const User = require("../models/users");
const userAuth = async (req, res, next) => {
  //read the token from req.cookies
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");

    }
    const decodedObj = await jwt.verify(token, "$up$uckers");

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not Found");
    }
    req.user = user;

    next();
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
};


module.exports = { userAuth };
