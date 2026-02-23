const userModel = require("../models/user.model")

/**
 * - user register Controller 
 * - POST /api/auth/Register 
 */

function userRegisterController(req, res) {
    const { email, paswword, name } = req.body

}

module.exports = {
    userRegisterController
}