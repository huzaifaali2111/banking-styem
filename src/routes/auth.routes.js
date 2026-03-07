const express = require("express");
const authController = require("../controllers/auth.controller")
const middlewares = require("../middleware/auth.middleware")

const router = express.Router();

//  POST /api/auth/register 
router.post("/register", authController.userRegisterController)


// POST /api/auth/login 
router.post("/login", authController.userLoginController)

// POST /api/auth/logout 
router.post('/logout', middlewares.authMiddleware, authController.userLogout)


// password forget
router.post('/forget-password', authController.userPasswordForget)

// password reset
router.post('/reset-password', authController.userPasswordReset)



module.exports = router
