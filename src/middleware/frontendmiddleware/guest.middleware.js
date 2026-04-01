const userModel = require("../../models/user.model")
const accountModel = require("../../models/account.model")
const jwt = require("jsonwebtoken")

async function guest(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.redirect("/auth");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);
    req.user = user;
    const isAccount = await accountModel.findById(decoded.userId)
    if (!isAccount) {
        return res.redirect("/guest");
    }
    return res.redirect("/profile");
}

module.exports = {
    guest
}