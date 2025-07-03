const express = require("express");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { validateSignupData } = require("../utils/validation")
const User = require('../models/users');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  console.log(req.body)
  try {
    validateSignupData(req);
    const { firstName, lastName, emailID, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash)
    const user = new User({
      firstName,
      lastName,
      emailID,
      password: passwordHash,
    })
    await user.save();
    res.send("user added succesfully");
  } catch (err) {
    return res.json({ error: err.message })
    console.log("error saving data: " + err.message)
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validator.isEmail(req.body?.emailID);
    const { emailID, password } = req.body;
    const user = await User.findOne({ emailID: emailID });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token);
      return res.status(200).json({ message: "Login Successful" })
    }
    else {
      throw new Error("Invalid Credentials");
    }
  }
  catch (err) {
    return res.status(400).json({ error: err.message });
  };
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "User Logged Out Successfully" });

})

module.exports = authRouter;
