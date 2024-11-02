
const mongoose = require('mongoose');


const connectionRequestSchemna = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      require: true,
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE}  is incorrect status`,
      },
      require: true,
    },
  },
  {
    timestamps: true
  }
);

connectionRequestSchemna.index({ fromUserID: 1, toUserID :1});

connectionRequestSchemna.pre('save', function (){
  const connectionRequest = this;
  // check if fromUserId same as toUserId
  
  if (connectionRequest.fromUserID.equals(connectionRequest.toUserID)) {
    throw new Error("You can't send request to yourself");
  }
 // next();
})

const ConnectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchemna
);

module.exports = ConnectionRequestModel;