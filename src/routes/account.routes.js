const express = require("express");
const  middlewares  = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")
const dataValidator = require("../validators/account.validator");


const router = express.Router();


// creating new account

router.post('/new-account', middlewares.authMiddleware, dataValidator.createAccountValidator, accountController.createAccountController)


// check user account info
router.get ("/account-info", middlewares.authMiddleware, accountController.getAccountInfo)





module.exports = router