const {Route} = require('express')
const transactionController = require("../controllers/transaction.controller")
const Middleware = require("../middleware/auth.middleware")

const transactionRoutes = Router()


/** 
 * - POST /api/transaction 
 * - Create a new transaction
 * */
transactionRouter.post("/", Middleware.authMiddleware, transactionController.createTransaction)



module.exports = transactionRoutes