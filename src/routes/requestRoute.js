const express = require("express");

const requestRoute = express.Router();
const { UserAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestSchema");
const User = require("../models/User");  



requestRoute.post("/request/send/:status/:toUserId", UserAuth, async  (req, res) => { 
    try {
      const fromUserID = req.user._id;
      const toUserID = req.params.toUserId;
      const status = req.params.status;
        
        const AllowedStatus = ["interested", "ignore"];

        if (!AllowedStatus.includes(status)) {
            return res.status(400).json({ message: "invalid status code :" + status });
        }
        
       const toUser = await User.findById(toUserID);

       if (!toUser) {
         return res
           .status(400)
           .json({
             message: "No user found with the given ID in our database.",
           });
       }

        const checkExisting = await ConnectionRequest.findOne({

            $or :[
                { fromUserID, toUserID },
                {fromUserID:toUserID,toUserID:fromUserID}
            ]
            
        });

        if (checkExisting) {
            return res
              .status(400)
              .json({ message: "already request send :" });
        }

      const connectionRequest = new ConnectionRequest({
        fromUserID,
        toUserID,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    } 
});


 requestRoute.post(
   "/request/review/:status/:requestId",
   UserAuth,
   async (req, res) => {
     const loginUser = req.user;
     const { status, requestId } = req.params;

     const AllowedStatus = ["accepted", "rejected"];
     if (!AllowedStatus.includes(status)) {
       return res
         .status(400)
         .json({ message: "Invalid status code: " + status });
     }

     // Use findOne to fetch the document with multiple fields
     const connectionRequestResponse = await ConnectionRequest.findOne({
       _id: requestId,
       toUserID: loginUser._id,
       status: "interested",
     });

     if (!connectionRequestResponse) {
       return res.status(400).json({ message: "User Id Not Found" });
     }

     // Update the status and save the document
     connectionRequestResponse.status = status;
     const data = await connectionRequestResponse.save();

     return res.json({
       message: "Connection Request " + status,
       data,
     });
   }
 );



module.exports = requestRoute;


