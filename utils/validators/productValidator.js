const slugify = require("slugify");
const { check ,body} = require("express-validator");
const validationMiddleware = require("../../middleWare/validatorMiddleware");
const categoryModel = require("../../models/CategoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ minLength: 3 })
    .withMessage("Product title must be at least 3 characters").custom((value ,{req})=>{
      req.body.slug = slugify(value);
      return true;
  }),

  check("description")
    .notEmpty()
    .withMessage("Product description is required"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Price after discount must be lower than price");
      }
      return true;
    }),
  check("size").isArray().withMessage("Product size must be an array"),
  check("size.*")
    .isIn(["S", "M", "L", "XL"])
    .withMessage("Product size must be S, M, L or XL"),
  check("images")
    .isArray()
    .withMessage("Product images must be an array")
    .optional(),
  check("rating")
    .isNumeric()
    .withMessage("Product rating must be a number ")
    .optional()
    .isLength({ min: 1.0, max: 5.0 })
    .withMessage("Product rating must be between 1.0 and 5.0 "),
  check(" reviews")
    .isArray()
    .withMessage("Product reviews must be an array ")
    .optional(),
  // separation of concerns
  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("invalid category id format")
    .custom((categoryId) => 
      categoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id :${categoryId}`)
          );
        }
      })
    ),
  
     
  //@ desc middleware for validation
  validationMiddleware,
];
exports.updateProductValidator = [
  // ruls
  check("id").isMongoId().withMessage("invlid product id format"),
     body("title").optional().custom((value ,{req})=>{
          req.body.slug = slugify(value);
          return true;
      }),
  //@ desc middleware for validation
  validationMiddleware,
];

exports.getProductValidator = [
  // ruls
  check("id").isMongoId().withMessage("invlid product  id format"),
  //@ desc middleware for validation
  validationMiddleware,
];

exports.deleteProductValidator = [
  // ruls
  check("id").isMongoId().withMessage("invlid product id format"),
  //@ desc middleware for validation
  validationMiddleware,
];
