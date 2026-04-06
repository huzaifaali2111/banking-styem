const { Router } = require('express')
const transactionController = require("../controllers/transaction.controller")
const Middleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")

const transactionRoutes = Router()


// proceed transaction
transactionRoutes.post("/transaction", Middleware.authMiddleware,accountController.getAccountInfo, transactionController.createTransaction)

// transaction history
transactionRoutes.get("/transaction-history", Middleware.authMiddleware, accountController.getAccountInfo )

// system user deposit the fund
transactionRoutes.post("/initial-fund", Middleware.systemUserMiddleware,  transactionController.createIntialFundTransaction ) 


module.exports = transactionRoutes