const userModel = require("../../models/user.model")
const accountModel = require("../../models/account.model")
const jwt = require("jsonwebtoken")

async function isloggedIn(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return next();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);
        if (user) {
            return res.redirect("/profile");
        }
        return next();

    } catch (error) {
        next();
    }
}

async function requireAuth(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.redirect("/auth");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);
        req.user = user
        return next();

    } catch (e) {
        return res.redirect("/auth");
    }
}

async function hasAccount(req, res, next) {
    try {
        const userId = req.user._id;
        const account = await accountModel.userHasAccount(userId);
        if (!account) {
            return res.redirect("/open-account");
        }
        return next();

    } catch (e) {
        res.send("User have invalid token")
    }

}

async function hasNoAccount(req, res, next) {
    try {
        const userId = req.user._id;
        const account = await accountModel.userHasAccount(userId);
        if (account) {
            return res.redirect("/profile");
        }
        return next();

    } catch (e) {
        res.send("User have invalid token")
    }

}



module.exports = {
    isloggedIn,
    requireAuth,
    hasAccount,
    hasNoAccount
}