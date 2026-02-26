const express = require("express");
const  middlewares  = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")


const router = express.Router();


/**
 * - POST /api/accounts
 * - Create a new account 
 * - Protected route, requires authentication
 */

router.post('/', middlewares.authMiddleware, accountController.createAccountController)




module.exports = router