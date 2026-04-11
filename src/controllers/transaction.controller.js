const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")
const accountModel = require("../models/account.model")
const mongoose = require("mongoose")






async function createTransaction(req, res) {

    // validate Request 
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
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
    if (!fromUserAccount || !toUserAccount) {
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
    const senderBalance = await fromUserAccount.getBalance()
    if (senderBalance < amount) {
        return res.status(400).json({
            message: `insufficient balance ${balance} while you are requesting ${amount}`
        })
    }

    // Create Transaction 
    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })




    // Account Balance update 
    const newSenderBalance = senderBalance - amount;
    await updateBalance(fromAccount, newSenderBalance)

    const receiverBalance = await toUserAccount.getBalance();


    await updateBalance(toAccount, receiverBalance)


    await session.commitTransaction()
    session.endSession()


    // send Successful transaction email 
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)
    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction
    })

}

async function createIntialFundTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Account amount and idempotencykey is required"
        })
    }
    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })
    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid Accounts"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        // systemUser: true,
        user: req.user._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })
    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })


    //user balance updation
    const receiverBalance = await toUserAccount.getBalance();
    const newReceiverBalance = receiverBalance + amount
    await updateBalance(toAccount, newReceiverBalance)

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Fund Deposit successfull",
        transaction: transaction
    })


}


async function transactionHistory(req, res) {
    const userAccount = await accountModel.findOne({
        user: req.user._id
    })
    const userTransactions = await transactionModel.find({
        $or: [
            { fromAccount: userAccount._id },
            { toAccount: userAccount._id }
        ]
    })

    if (userTransactions.length <= 0) {
        return res.status(200).json({
          message: "No transaction yet click to proceed"
        })
    }
    console.log(userAccount._id)
    userTransactions.forEach(element=>{
        if(userAccount._id == element.fromAccount){
            element.type = 'Debit';
        }
        else{
            element.type = 'Credit';
        }
    })

    return res.status(200).json(userTransactions);
    

}


async function updateBalance(accountNumber, amount) {
    const newBalance = await accountModel.findOneAndUpdate({ _id: accountNumber }, { balance: amount })
}

module.exports = {
    createTransaction,
    createIntialFundTransaction,
    transactionHistory
}