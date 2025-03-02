const slugify = require("slugify");
const { check } = require("express-validator");

const validationMiddleware = require("../../middleWare/validatorMiddleware");
const userModel = require("../../models/userModel");

exports.signupValidator = [
  // ruls
  check("fristName")
    .notEmpty()
    .withMessage(" firs name is required")
    .withMessage("first name must be between 3 and 50 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("lastName")
    .notEmpty()
    .withMessage(" last name is required")
    .withMessage("last name must be between 3 and 50 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already exists");
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      // password confirmation
      if (password !== req.body.confirmPassword) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required"),

  validationMiddleware,
];

exports.loginValidator = [
  // ruls

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),

  validationMiddleware,
];
