const router = require("express").Router();

const AuthService = require("../services/authServices");

const {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderService");

router.use(AuthService.protect);

router.get(
  "/checkout-session/:cartId",
  AuthService.allowedTo("user", "admin"),
  checkoutSession
);
router.route("/:cartId").post(AuthService.allowedTo("user"), createCashOrder);
router.get(
  "/",
  AuthService.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  getAllOrders
);
router.get("/:id", filterOrderForLoggedUser, getSpecificOrder);

router.put(
  "/:id/pay",
  AuthService.allowedTo("admin", "manager"),
  updateOrderToPaid
);

router.put(
  "/:id/deliver",
  AuthService.allowedTo("admin", "manager"),
  updateOrderToDelivered
);

module.exports = router;
