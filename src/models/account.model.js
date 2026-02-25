const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account Must be asscociated with a user"]
    },
    status: {
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status can be either Active frozen or closed"
        }
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "PKR"
    }

}, {
    timestamps: true
})