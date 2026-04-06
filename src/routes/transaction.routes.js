const { Router } = require('express')
const transactionController = require("../controllers/transaction.controller")
const Middleware = require("../middleware/auth.middleware")


const transactionRoutes = Router()


// proceed transaction
transactionRoutes.post("/transaction", Middleware.authMiddleware, transactionController.createTransaction)

// transaction history
transactionRoutes.get("/transaction-history", Middleware.authMiddleware, transactionController.transactionHistory )

// system user deposit the fund
transactionRoutes.post("/initial-fund", Middleware.systemUserMiddleware,  transactionController.createIntialFundTransaction ) 


module.exports = transactionRoutes