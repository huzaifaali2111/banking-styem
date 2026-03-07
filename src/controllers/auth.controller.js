const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailservice = require("../services/email.service")
const crypto = require("crypto");

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

// user password forget request
async function userPasswordForget(req, res) {
    const userEmail = req.body.email
    if (!userEmail) {
        return res.status(400).json({
            message: "Kindly provide Your Email to Reset password"
        })
    }
    const isUserExist = await userModel.findOne({
        email: userEmail
    })
    if (!isUserExist) {
        return res.status(550).json({
            message: "Record not found"
        })
    }
    const userName = isUserExist.name
    const reqToken = crypto.randomUUID();
    const expiry = new Date(Date.now() + 30 * 60 * 1000);
    await userModel.findOneAndUpdate({ email: userEmail }, { reset_token: reqToken, reset_token_expiry: expiry })
    await emailservice.forgetPasswordEmail(userEmail, userName, reqToken)

    res.status(202).json({
        message: "You Request for password reset has been accepted check your email folder for the Rest link"
    })


}

// user password reset request 
async function userPasswordReset(req, res) {
    const reset_Token = req.query.token
    const newPassword = req.body.password
    if(!newPassword){
        return res.status(400).json({
            message: "kindly Provide the Password"
        })
    }
    if (!reset_Token) {
        return res.status(400).json({
            message: "You Link should Contain a token for Password reset"
        })
    }
    const user = await userModel.findOne({
        reset_token: reset_Token,
        reset_token_expiry: { $gt: new Date() }
    }).select("+password")
    if (!user) {
        return res.status(400).json({
            message: "Rest Link is Expired or Invalid"
        })
    }
        user.password = newPassword,
        user.reset_token = null,
        user.reset_token_expiry = null

    await user.save();

    res.status(200).json({
        message: "Password Updated Successfully",
        status: "Updated"
    })

}
module.exports = {
    userRegisterController,
    userLoginController,
    userLogout,
    userPasswordForget,
    userPasswordReset
}