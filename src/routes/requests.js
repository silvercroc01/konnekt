const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");

const requestsRouter = express.Router();

requestsRouter.post("/request/send/:status/:toUserID", userAuth, async (req, res) => {
  try {
    const fromUserID = req.user._id;
    const toUserID = req.params.toUserID;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid Status Type: " + status });
    }
    const toUser = await User.findById(toUserID);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserID, toUserID },
        { fromUserID: toUserID, toUserID: fromUserID },
      ]
    });
    if (existingConnectionRequest) {
      return res.status(400).json({ message: " Connection Request Already Present" });

    }

    const connectionRequest = new ConnectionRequest({
      fromUserID,
      toUserID,
      status,
    });

    const data = await connectionRequest.save();
    return res.status(200).json({ message: "Connection Request Sent", data: data });
  }
  catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
});

requestsRouter.post("/request/review/:status/:requestID", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestID } = req.params;
    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status Not Allowed" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestID,
      toUserID: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection Request Not Found" });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    return res.status(200).json({ message: "Connection Request " + status, data: data });

  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
})

module.exports = requestsRouter;

