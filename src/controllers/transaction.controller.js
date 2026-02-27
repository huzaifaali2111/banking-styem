const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")
const accountModel = require("../models/account.model")





async function createTransaction(req, res) {

    // validate Request 
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body
    if (!fromAccount || toAccount || amount || idempotencyKey) {
        return res.status(400).json({
            message: "fromAccount, toAccount, amount, idempotencyKey is required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    })
    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })
    if (!fromUserAccount || toUserAccount) {
        return res.status(400).json({
            message: "Invalid Accounts"
        })
    }

    // 


}





module.exports = {
    createTransaction
}