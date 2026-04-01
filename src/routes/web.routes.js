const express = require("express");
const router = express.Router();
const middleware = require("../middleware/frontendmiddleware/guest.middleware")

router.get("/auth",  middleware.guest, (req, res) => {
    res.render("auth");
})

router.get("/profile", (req, res) => {
    const user = req.cookies.token
    res.render("profile", {user});
})

router.get("/guest", (req, res)=>{
    res.render("guest");
})

module.exports = router