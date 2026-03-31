const express = require("express");
const cookieParser = require("cookie-parser")
const path = require('path');
const expressLayout = require('express-ejs-layouts');

// Improting routes
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")
const balanceRouter = require("./routes/balance.routes")
const webRouter = require("./routes/web.routes")




const app = express();

// public folder
app.use(express.static('public'));


// View Engine
app.use(expressLayout);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())






// using routes
app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)
app.use("/api/check", balanceRouter)
app.use("", webRouter)





module.exports = app