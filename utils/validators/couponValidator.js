const slugify = require("slugify");
const { check, body } = require("express-validator");
const validationMiddleware = require("../../middleWare/validatorMiddleware");
const validatorMiddleware = require("../../middleWare/validatorMiddleware");

const validateCouponId = check("couponId")
  .isMongoId()
  .withMessage("Invalid coupon ID format");

exports.getCouponValidator = [validateCouponId,validatorMiddleware];
exports.deleteCouponValidator = [validateCouponId,validatorMiddleware];

exports.createCouponValidator = [
  // ruls
  check("name")
    .notEmpty()
    .withMessage(" Coupon name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Coupon name must be between 3 and 50 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("expire")
    .notEmpty()
    .withMessage("Coupon expiration date is required")
    .isISO8601()
    .withMessage("Invalid date format, use YYYY-MM-DD")
    .isAfter(new Date().toISOString())
    .withMessage("Expiration date must be in the future"),
  check("discount")
    .notEmpty()
    .withMessage("Coupon discount is required")
    .isFloat({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),

  validationMiddleware,
];

exports.updateCouponValidator = [
  validateCouponId,

  body("name")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Coupon name must be between 3 and 50 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  body("expire")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format, use YYYY-MM-DD")
    .isAfter(new Date().toISOString())
    .withMessage("Expiration date must be in the future"),

  body("discount")
    .optional()
    .isFloat({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),

  validationMiddleware,
];

