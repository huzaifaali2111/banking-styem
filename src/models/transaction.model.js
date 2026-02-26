const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transcation will proceed from an account"],
        index: true,
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transcation will proceed towards an account"],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status can be either Pending, Completed, Failed or Reversed",
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, "Amount is Required to Proceed the Transaction"],
        min: [0, "Transaction amount cannot be negative"]
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency Key is Required to Proceed the Transcation"],
        index: true,
        unique: true,
    },

}, {
    timestamps: true
}) 