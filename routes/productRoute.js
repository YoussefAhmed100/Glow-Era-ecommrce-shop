const router = require("express").Router();
const upload = require("../middleWare/upload");
const {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  getProductValidator,
} = require("../utils/validators/productValidator");

const {
  getAllProducts,
  getSpesificProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../services/productService");
const AuthService = require("../services/authServices");

router
  .route("/")
  .get(getAllProducts)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    upload.array("images", 5),
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getSpesificProduct) //getSpesificCategory
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    updateProductValidator,
    updateProduct
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
