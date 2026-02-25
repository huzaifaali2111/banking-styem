const express = require("express");
const  authMiddleware  = require("../middleware/auth.middleware")


const router = express.Router();


/**
 * - POST /api/accounts
 * - Create a new account 
 * - Protected route, requires authentication
 */



module.exports = router