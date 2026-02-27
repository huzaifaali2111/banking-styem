const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);
        req.user = user;
        return next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
}

async function systemUserMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("+systemUser");
        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access"
            })
        }
        req.user = user
        return next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
}

module.exports = {
    authMiddleware,
    systemUserMiddleware
}