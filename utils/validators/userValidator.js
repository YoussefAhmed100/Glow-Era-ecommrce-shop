const slugify = require("slugify");
const { check, body } = require("express-validator");
const bcrypt = require("bcrypt");

const validationMiddleware = require("../../middleWare/validatorMiddleware");
const userModel = require("../../models/userModel");

exports.createUserValidator = [
  // ruls
  check("firstName")
    .notEmpty()
    .withMessage(" first name is required")
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("enter the valid phone number"),
  check("role").optional(),
  validationMiddleware,
];
exports.getUserValidator = [
  // ruls
  check("id").isMongoId().withMessage("invlid category id format"),
  //@ desc middleware for validation
  validationMiddleware,
];
exports.updateUserValidator = [
  // ruls
  check("id").isMongoId().withMessage("invlid user id format"),
  body("firstName").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  body("LastName").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already exists");
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("enter the valid phone number"),
  check("role").optional(),
  //@ desc middleware for validation
  validationMiddleware,
];
exports.deleteUserValidator = [
  // ruls
  check("id").isMongoId().withMessage("invlid user id format"),
  //@ desc middleware for validation
  validationMiddleware,
];
exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("invlid user id format"),
  body("currentPassword").notEmpty().withMessage("current password required"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required"), // check if the current password is correct

  body("password")
    .notEmpty()
    .withMessage("new password is required")
    .custom(async (value, { req }) => {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error(`there is no user for this id :${req.params.id}`);
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password ");
      }
      if (value !== req.body.confirmPassword) {
        throw new Error("password and confirm password must be the same");
      }
      return true;
    }),

  validationMiddleware,
];
