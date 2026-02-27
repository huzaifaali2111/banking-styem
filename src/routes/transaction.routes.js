const { Router } = require('express')
const transactionController = require("../controllers/transaction.controller")
const Middleware = require("../middleware/auth.middleware")

const transactionRoutes = Router()


/** 
 * - POST /api/transaction 
 * - Create a new transaction
 * */
transactionRoutes.post("/", Middleware.authMiddleware, transactionController.createTransaction)

/** 
 * - POST /api/transaction/fund 
 * */
transactionRoutes.post("/fund", Middleware.systemUserMiddleware,  transactionController.createIntialFundTransaction ) 


module.exports = transactionRoutes