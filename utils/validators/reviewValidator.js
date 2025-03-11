const slugify = require("slugify");
const { check, body } = require("express-validator");
const validationMiddleware = require("../../middleWare/validatorMiddleware");
const ReviewModel = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  check("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid product ID format")
    .custom(async (val, { req }) => {
      const review = await ReviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        throw new Error("User already reviewed this product");
      }
      return true; 
    }),

  check("user").isMongoId().withMessage("Invalid user ID format"),

  validationMiddleware,
];
exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review ID format")
    .custom(async (id, { req }) => {
      const review = await ReviewModel.findById(id);
      if (!review) {
        throw new Error("Review not found");
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("You can only update your own review");
      }
      return true;
    }),

  body("title")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),


  validationMiddleware,
];

exports.getReviewValidator = [
  // ruls
  check("id").isMongoId().withMessage("invlid review   id format"),
  //@ desc middleware for validation
  validationMiddleware,
];

exports.deleteReviewValidator = [
  // ruls
  check("id")
    .isMongoId()
    .withMessage("Invalid review ID format")
    .custom(async (id, { req }) => {
      if (req.user.role === "user") {
        const review = await ReviewModel.findById(id);
        if (!review) {
          throw new Error("Review not found");
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error("You can only delete your own review");
        }
        return true;
      }
    }),
  //@ desc middleware for validation
  validationMiddleware,
];
