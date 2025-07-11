const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  toUserID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  status: {
    type: String,
    required: true,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrect status type`,
    }
  },
},
  { timestamps: true, }
);

connectionRequestSchema.pre("save", function(next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserID.equals(connectionRequest.toUserID)) {
    throw new Error("can't send request to yourself");
  }
  next();
})

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest", connectionRequestSchema
);

module.exports = ConnectionRequest;
