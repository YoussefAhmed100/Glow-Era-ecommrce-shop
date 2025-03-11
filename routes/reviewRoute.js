const router = require("express").Router({ mergeParams: true });

const AuthService = require("../services/authServices");
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");
const {
  createReviews,
  getAllReviews,
  getSpesificReviews,
  updateReviews,
  deleteReviews,
  createFilterObject,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");

router.route("/").get(createFilterObject, getAllReviews).post(
  AuthService.protect,
  AuthService.allowedTo("user"),
  setProductIdAndUserIdToBody,
  createReviewValidator,

  createReviews
);

router
  .route("/:id")
  .get(getReviewValidator, getSpesificReviews)
  .put(
    AuthService.protect,
    AuthService.allowedTo("user"),
    updateReviewValidator,
    updateReviews
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReviews
  );

module.exports = router;
