const express = require("express");
const cookieParser = require("cookie-parser")



const app = express();


app.use(express.json())
app.use(cookieParser())



/**
 * Importing routes
 */
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")
const balanceRouter = require("./routes/balance.routes")




/**
 * Routes used in the app
 */
app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)
app.use("/api/check",balanceRouter)





module.exports = app