const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")
const accountModel = require("../models/account.model")





async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body
    if (!fromAccount || toAccount || amount || idempotencyKey) {
        return res.status(400).json({
            message: "fromAccount, toAccount, amount, idempotencyKey is required"
        })
    }

}





module.exports = {
    createTransaction
}