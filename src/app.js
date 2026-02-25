const express = require("express");
const cookieParser = require("cookie-parser")

/**
 * Importing routes
 */
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")

const app = express();


app.use(express.json())
app.use(cookieParser())


/**
 * Routes used in the app
 */
app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)




module.exports = app