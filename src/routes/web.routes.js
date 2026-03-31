const express = require("express");
const router = express.Router();
const middleware = require("../middleware/frontendmiddleware/guest.middleware")


router.get("/auth", (req, res) => {
    res.render("auth");
})

router.get("/profile", (req, res) => {
    const user = req.cookies.token
    res.render("profile", {user});
})

module.exports = router