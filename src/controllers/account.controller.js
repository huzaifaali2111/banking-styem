const accountModel = require("../models/account.model")
const { validationResult } = require("express-validator");


async function createAccountController(req, res) {
    try {
        // error handling
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json(errors);
        }

        // proceeding with user data
        const user = req.user;
        const { name, cnic, fatherName, birthdate, address, phoneNumber } = req.body

        let userCnic = cnic.toString().split("").slice(8, 13);
        const accountNumber = "SIB" + userCnic.join("").padStart(10, "0");

        const isAccountExist = await accountModel.findOne({
            user: user._id
        })
        if (isAccountExist) {
            return res.status(409).json({
                message: "user Already have an Account"
            })
        }

        // creating account
        const account = await accountModel.create({
            user: user._id,
            name: name,
            cnic: cnic,
            fatherName: fatherName,
            birthdate: birthdate,
            address: address,
            phoneNumber: phoneNumber,
            accountNumber: accountNumber
        })
        res.status(201).json({
            message: "Account successfully created",
            account: account
        })
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong, try again" });
    }
}

async function getAccountInfo(req, res) {
    const userId = req.user._id
    const userInfo = await accountModel.findOne({
        user: userId
    })
    req.account = userInfo;
    return res.status(200).json({
        userInfo
    })

}
module.exports = {
    createAccountController,   
    getAccountInfo
}