//mergeParams:allow us to access the params object directly
// ex: we need to access category id from category routers
const router = require("express").Router({ mergeParams: true });
const upload = require("../middleWare/upload");
const reviewRoute = require("./reviewRoute");
const {
  // createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  getProductValidator,
} = require("../utils/validators/productValidator");
// nested route
// Post  /products/qwrrfvkv,cc/review

router.use("/:productId/reviews", reviewRoute);

const {
  getAllProducts,
  getSpesificProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createFilterObject,
} = require("../services/productService");
const AuthService = require("../services/authServices");

router.route("/").get(createFilterObject, getAllProducts).post(
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
