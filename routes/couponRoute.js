const router = require("express").Router();
const {
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
  getCouponValidator,
} = require("../utils/validators/couponValidator");
const AuthService = require("../services/authServices");

const {
  getAllCoupons,
  getSpesificCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");
router.use(AuthService.protect, AuthService.allowedTo("admin", "manager"));

router.route("/").get(getAllCoupons).post(createCouponValidator, createCoupon);

router
  .route("/:id")
  .get(getCouponValidator, getSpesificCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator , deleteCoupon);

module.exports = router;
