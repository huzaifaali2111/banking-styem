const accountModel = require("../models/account.model")

async function createAccountController(req, res) {
    const user = req.user;
    const isAccountExist = await accountModel.findOne({
        user: user._id
    })
    if(isAccountExist){
        return res.status(409).json({
            message: "user Already have an Account"
        })
    }
    const account = await accountModel.create({
        user: user._id
    })
    res.status(201).json({
        account 
    })
}
module.exports = {
    createAccountController
}