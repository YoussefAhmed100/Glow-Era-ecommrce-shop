const asynchandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const cartModel = require("../models/cartModel");

const productModel = require("../models/productModel");
const couponModel = require("../models/couponModel");

// helper functions for calculat total price
const calculateTotalCartPrice = (cart) => {
  let totalCartPrice = 0;
  cart.cartItems.forEach((everyProduct) => {
    totalCartPrice += everyProduct.price * everyProduct.quantity;
  });
  //   update cart
  cart.totalPrice = totalCartPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalCartPrice;
};

// @desc Create new cart
// @route POST /api/v1/carts
// @access Private/User
exports.addProductToCart = asynchandler(async (req, res, next) => {
  const { productId, size, quantity } = req.body;
  // 2) check if product exists
  const product = await productModel.findById(productId);
  // 1) get cart for logged user
  let cart = await cartModel.findOne({ user: req.user.id });
  if (!cart) {
    cart = await cartModel.create({
      user: req.user.id,

      cartItems: [{ product: productId, size, price: product.price, quantity }],
    });
  } else {
    // 3) check if product already exists in cart update quantity
    const poductAlreadyExists = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );
    if (poductAlreadyExists > -1) {
      const cartItem = cart.cartItems[poductAlreadyExists];
      cartItem.quantity += quantity || 1;
      cart.cartItems[poductAlreadyExists] = cartItem;
    } else {
      // 4) if product does not exist in cart , push product to cartItems array
      cart.cartItems.push({ product: productId, size, price: product.price });
    }
  }
  calculateTotalCartPrice(cart);

  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfItems: cart.cartItems.length,
    message: "Product added to cart successfully",
    data: cart,
  });
});

// @desc Get cart by user
// @route GET /api/v1/carts
// @access Private/User
exports.getLogeedUserCart = asynchandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`No cart found for this user ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    numberOfItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc Remove product from cart
// @route   DELETE /api/v1/carts/:itemId
// @access Private/User

exports.removeProductFromCart = asynchandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        cartItems: { _id: req.params.itemId },
      },
    },
    { new: true }
  );

  if (!cart) {
    return next(
      new ApiError(`No cart found for this user ${req.user._id}`, 404)
    );
  }

  calculateTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfItems: cart.cartItems.length,
    data: cart,
  });
});
// @desc Remove  cart
// @route   DELETE /api/v1/carts/:itemId
// @access Private/User
exports.removeCart = asynchandler(async (req, res) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(200).json({
    status: "success",
    message: "cart deleted successfully",
  });
});

// @desc Update quantity of product in cart
// @route   PUT /api/v1/carts/:itemId
// @access Private/User

exports.updateCartItemQuantity = asynchandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`No cart found for this user ${req.user._id}`, 404)
    );
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    // update quantity
    cart.cartItems[itemIndex].quantity = quantity;
  } else {
    return next(
      new ApiError(`No item found with id ${req.params.itemId}`, 404)
    );
  }

  calculateTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc apply coupon
// @route   PUT /api/v1/carts/applayCoupon
// @access Private/User

exports.applyCoupon = asynchandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.body.couponName,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Coupon not found or expired", 404));
  }
  const cart = await cartModel.findOne({ user: req.user._id });
  const totalCartPrice = cart.totalPrice;
  const totalPriceAfterDiscount = (
    totalCartPrice -
    (totalCartPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfItems: cart.cartItems.length,
    data: cart,
  });
});
