const express = require("express");
const  middlewares  = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")
const dataValidator = require("../validators/account.validator");


const router = express.Router();


// creating new account

router.post('/new-account', middlewares.authMiddleware, dataValidator.createAccountValidator, accountController.createAccountController)





module.exports = router