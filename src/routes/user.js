const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/users');

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender"]

const userRouter = express.Router();

// get all pending requests for logged In user 

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserID: loggedInUser._id,
      status: "interested"
    }).populate("fromUserID", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => row.fromUserID);
    return res.status(200).json({ message: "Success", data: data });

  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserID: loggedInUser._id, status: "accepted" },
        { fromUserID: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserID", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserID._id.toString() === loggedInUser._id.toString()) {
        return row.toUserID;
      }
      return row.fromUserID;
    });
    return res.status(200).json({ message: "Success", data: data });

  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // exclude people from connections , rejected ,self 
    const loggedInUser = req.user;

    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // find all connection requests( sent or received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserID: loggedInUser._id },
        { toUserID: loggedInUser._id },
      ]
    }).select("fromUserID toUserID");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserID.toString());
      hideUserFromFeed.add(req.toUserID.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } }
      ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    return res.status(200).json({ message: "Success", data: users });

  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: err.message })
  }
});

module.exports = userRouter;
