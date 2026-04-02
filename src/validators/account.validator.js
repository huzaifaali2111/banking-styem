const { body } = require("express-validator");

const createAccountValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required"),

    body("fatherName")
        .trim()
        .notEmpty().withMessage("Father name is required"),

    body("cnic")
        .notEmpty()
        .withMessage("CNIC must be provided"),

    body("phoneNumber")
        .matches(/^03\d{9}$/)
        .withMessage("Phone number must be valid Pakistani format"),

    body("birthdate")
        .isDate()
        .withMessage("Invalid date"),

    body("address")
        .notEmpty().withMessage("Address is required")
]


module.exports = {
    createAccountValidator
}
