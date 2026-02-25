const express = require("express");
const  middlewares  = require("../middleware/auth.middleware")


const router = express.Router();


/**
 * - POST /api/accounts
 * - Create a new account 
 * - Protected route, requires authentication
 */
router.post('/', middlewares.authMiddleware)




module.exports = router