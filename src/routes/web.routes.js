const express = require("express");
const router = express.Router();
const middleware = require("../middleware/frontendmiddleware/validation.middleware")

router.get("/auth", middleware.isloggedIn, (req, res) => {
    res.render("auth");
})

router.get("/profile", middleware.requireAuth, middleware.hasAccount, (req, res) => {
    const user = req.cookies.token
    res.render("profile", { user });
})

router.get("/open-account", middleware.requireAuth, middleware.hasNoAccount, (req, res) => {
    res.render("open-account");
})

module.exports = router