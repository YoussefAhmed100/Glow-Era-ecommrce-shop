const asynchandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");

// @desc add product to wishlist
// @route POST /api/wishlist
// @access Protected/User
exports.addProductToWishlist = asynchandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        wishlist: req.body.productId,
      },
    },
    { new: true }
  );
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Product added to wishlist",
    data: user.wishlist,
  });
});
// @desc remove product from wishlist
// @route DELETE /api/wishlist
// @access Protected/User
exports.removeProductFromWishlist = asynchandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        wishlist: req.params.productId,
      },
    },
    { new: true }
  );
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Product removed from wishlist",
    data: user.wishlist,
  });
});

// @desc remove product from wishlist
// @route DELETE /api/wishlist
// @access Protected/User
exports.getLoggedUserWishlist = asynchandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "success",
    result: user.wishlist.length,
    data: user.wishlist,
  });
});
