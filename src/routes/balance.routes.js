const express = require("express");
const Middleware = require("../middleware/auth.middleware");
const accountModel = require("../models/account.model");

const balanceRouter = express.Router();

balanceRouter.get("/balance", Middleware.authMiddleware, async (req, res) => {
    const accountInfo = await accountModel.findOne({
        user: req.user._id
    })
     
    if(req.user.systemUser == true){
      return res.status(403).json({
        message: "unauthorized for this work"
      })
    }
    res.status(200).json({
        userBalance: accountInfo.balance
    })
})

module.exports = balanceRouter