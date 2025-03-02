const router = require("express").Router();

const AuthService = require("../services/authServices");

const {
  addProductToCart,
  getLogeedUserCart,
  removeProductFromCart,
  removeCart,
  updateCartItemQuantity
} = require("../services/cartService");

router.use(AuthService.protect, AuthService.allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLogeedUserCart)
  .delete(removeCart);

router.route("/:itemId").delete(removeProductFromCart).put(updateCartItemQuantity);

module.exports = router;
