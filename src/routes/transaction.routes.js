const { Router } = require('express')
const transactionController = require("../controllers/transaction.controller")
const Middleware = require("../middleware/auth.middleware")

const transactionRoutes = Router()


/** 
 * - POST /api/transactions/transaction 
 * - Create a new transaction
 * */
transactionRoutes.post("/transaction", Middleware.authMiddleware, transactionController.createTransaction)

/** 
 * - POST /api/transaction/initial-fund
 * */
transactionRoutes.post("/initial-fund", Middleware.systemUserMiddleware,  transactionController.createIntialFundTransaction ) 


module.exports = transactionRoutes