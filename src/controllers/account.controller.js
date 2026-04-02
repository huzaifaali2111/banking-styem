const accountModel = require("../models/account.model")

async function createAccountController(req, res) {
    const user = req.user;
    const { name, cnic, fatherName, birthdate, address, phoneNumber } = req.body
    let newcn = cnic.split()
    const accountNumber = "SIB" + user._id.toString().padStart(10, "0");
    const isAccountExist = await accountModel.findOne({
        user: user._id
    })
    if (isAccountExist) {
        return res.status(409).json({
            message: "user Already have an Account"
        })
    }
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
}
module.exports = {
    createAccountController
}