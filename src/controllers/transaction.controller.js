const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")
const accountModel = require("../models/account.model")
const mongoose = require("mongoose")





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

    // validate idempotency key 
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })
    if (isTransactionAlreadyExists) {

        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already completed",
                transaction: isTransactionAlreadyExists
            })
        }

        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is pending",
            })
        }

        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction is failed",
            })
        }

        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was Reverserd Retry !",
            })
        }
    }

    // Check Account status 
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both Account Must be Active to proceed with the transaction"
        })
    }


    // Derive Sender Balance from ledger
    const balance = await fromUserAccount.getBalance()
    if (balance < amount) {
        return res.status(400).json({
            message: `insufficient balance ${balance} while you are requesting ${amount}`
        })
    }

    // Create Transaction 
    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    }, { session })

    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }, { session })

    const creditLedgerEntry = await ledgerModel.create({
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }, { session })

    transaction.status = "COMPLETED"
}





module.exports = {
    createTransaction
}