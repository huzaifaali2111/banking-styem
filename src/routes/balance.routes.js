const express = require("express");
const Middleware = require("../middleware/auth.middleware");
const accountModel = require("../models/account.model");

const balanceRouter = express.Router();

balanceRouter.get("/balance", Middleware.authMiddleware, async (req, res) => {
    const accountBalance = await accountModel.findOne({
        user: req.user._id
    })
    
    res.status(200).json({
        userBalance: accountBalance.balance
    })
})

module.exports = balanceRouter