const express = require("express");
const bcrypt = require('bcrypt');
const authRouter = require("./auth");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData, validateUpdatePassword } = require("../utils/validation");
const User = require("../models/users");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user)
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }

});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    };
    const user = req.user;
    Object.keys(req.body).forEach((field) => (user[field] = req.body[field]));

    await user.save();

    console.log(user);
    res.status(200).json({ message: "User Profile Updated Successfully", user: user });
  } catch (err) {

    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    if (!validateUpdatePassword) throw new Error("Invalid Request For Updating Password");
    const user = req.user

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    const isOldPasswordValid = await user.comparePassword(oldPassword);

    if (isOldPasswordValid) {
      user.password = newPasswordHash;;
      user.save();
      return res.status(200).json({ message: "Paassword Updated Successfully" });
    }
    else {
      throw new Error("Invalid Password");
    }
  }
  catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

module.exports = profileRouter;
