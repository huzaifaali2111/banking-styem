const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

/**
 * - user register Controller 
 * - POST /api/auth/Register 
 */
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


}


/**
 *  - user login controller
 *  - POST /api/auth/login
 */
async function userLoginController(req, res) {
    const { email, password } = req.body
    const isEmailExists = userModel.findOne({email})
    if(!isEmailExists){
        return res.status(201).json({
            message : "Email or Password is Invalid"
        })
    }

}
module.exports = {
    userRegisterController,
    userLoginController
}