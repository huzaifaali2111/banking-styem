const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required while creating a user"],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/, "Please Enter a valid email address"],
        unique: [true, "Email Already Exists"]
    },
    name: {
        type: String,
        required: [true, "Name is Required"],
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minlength: [6, "Password Should contain more the 6 character"],
        select: false
    }
}, {
    timestamps: true
})

userSchema.pre("save", async (next) => {
    if (!this.isModified("password")) {
        next()
    }
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

userSchema.methods.comparePassword = async (password) => {
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema)
module.exports = userModel 