const slugify = require("slugify");
const { check, body } = require("express-validator");
const validationMiddleware = require("../../middleWare/validatorMiddleware");

exports.getCategoryValidator = [
  // ruls
  check("id").isMongoId().withMessage("invlid category id format"),
  //@ desc middleware for validation
  validationMiddleware,
];

exports.createCategoryValidator = [
  // ruls
  check("name")
    .notEmpty()
    .withMessage(" category name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("category name must be between 3 and 50 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validationMiddleware,
];
exports.updateCategoryValidator = [
  // ruls
  check("id").isMongoId().withMessage("invlid category id format"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  //@ desc middleware for validation
  validationMiddleware,
];
exports.deleteCategoryValidator = [
  // ruls
  check("id").isMongoId().withMessage("invlid category id format"),
  //@ desc middleware for validation
  validationMiddleware,
];
