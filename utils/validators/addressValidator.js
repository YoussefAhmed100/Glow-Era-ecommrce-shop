const slugify = require("slugify");
const { check } = require("express-validator");

const validationMiddleware = require("../../middleWare/validatorMiddleware");
const userModel = require("../../models/userModel");

exports.createAddressValidator = [
  // ruls
  check("alise")
    .notEmpty()
    .withMessage(" Alise name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Alise must be between 3 and 50 characters")
    .custom(async(value, { req }) => {
      const user = await userModel.findById(req.user.id);
    
      const addressExists = user.addresses.some(addr => addr.alise === value);
      if (addressExists) {
        throw new Error("Alise name already exists in addresses");
      }
      req.body.slug = slugify(value);
      return true;
    }),
  check("details")
    .notEmpty()
    .withMessage("Details are required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Details must be between 3 and 100 characters")

    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("city").notEmpty().withMessage("city name is required"),

  check("phone")
    .notEmpty()
    .withMessage(" phone number is required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("enter the valid phone number")
    .matches(/^\d+$/).withMessage("Phone number must contain only digits")
    ,

  check("postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .matches(/^\d{4,10}$/)
    .withMessage("Postal code must be between 4 and 10 digits"),
  validationMiddleware,
];
exports.deleteAddressValidator = [
    // ruls
    check("addressId").isMongoId().withMessage("invlid address id format"),
    //@ desc middleware for validation
    validationMiddleware,
  ];
