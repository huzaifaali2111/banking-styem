const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailservice = require("../services/email.service")

// user registration controller
async function userRegisterController(req, res) {
    const { email, password, name } = req.body

    const isExists = await userModel.findOne({
        email: email
    })

    if (isExists) {
        return res.status(422).json({
            message: "User Already Exists with this email",
            status: "Failed"
        })
    }

    const user = await userModel.create({
        email, password, name
    })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie("token", token)

    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

    await emailservice.sendRegistrationEmail(user.email, user.name);


}

// user login controller
async function userLoginController(req, res) {
    const { email, password } = req.body
    const user = await userModel.findOne({ email }).select("+password")
    if (!user) {
        return res.status(401).json({
            message: "Email or Password is Invalid"
        })
    }
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or Password is Invalid"
        })
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie("token", token)

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })


}

// user logout controller 
async function userLogout(req, res) {
    console.log(req.cookies.token)
    res.clearCookie('token')
    res.status(202).json({
        message: "Successfully logout of Account"
    })

}

// user password rest
async function userPasswordReset(req, res) {
    const userEmail = req.body.email
    if (!userEmail) {
        res.status(400).json({
            message: "Kindly provide Your Email to Reset password"
        })
    }
    const isUserExist = await userModel.findOne({
        email: userEmail
    })
    console.log(isUserExist)
    if (!isUserExist) {
        res.status(550).json({
            message: "Record not found"
        })
    }

}
module.exports = {
    userRegisterController,
    userLoginController,
    userLogout,
    userPasswordReset
}