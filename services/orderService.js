const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asynchandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const orderModel = require("../models/orderModel");
const CartModel = require("../models/cartModel");
const ProductModel = require("../models/productModel");
const factory = require("./handlerFactory");

// @desc create cash order
// @route POST /api/v1/orders/cartId
// @access Private/User
exports.createCashOrder = asynchandler(async (req, res, next) => {
  // app setings => admin
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) get cart depend on cartId
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("No cart found", 404));
  }

  // 2)get order price depend on cart price
  const cartPrice = cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) create new order with defult pyment methode cash
  const newOrder = await orderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    taxPrice,
    shippingPrice,
    totalOrderPrice,
  });
  // 4) after create order decrement product quantity ,increment product sold depend on quantity
  if (newOrder) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOption, {});
    //5) clear cart after order created
    await CartModel.findByIdAndDelete(req.params.cartId);
  }
  // 6) return order
  res.status(201).json({ status: "success", data: newOrder });
});
// helper function to filtration user type
exports.filterOrderForLoggedUser = asynchandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
// @desc get all orders
// @route GET /api/v1/orders
// @access Private/Admin
exports.getAllOrders = factory.getAll(orderModel);

// @desc get specific order
// @route GET /api/v1/orders
// @access Private/User
exports.getSpecificOrder = factory.getOne(orderModel);

// @desc update order status to paid
// @route PUT /api/v1/orders/:id/pay
// @access Private/admin - manager
exports.updateOrderToPaid = asynchandler(async (req, res, next) => {
  //1) get order by id
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`No order found for this id: ${req.params.id}`, 404)
    );
  }
  //2) update order status
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();
  res.status(200).json({ status: "success", data: order });
});

// @desc update order status to delivered
// @route PUT /api/v1/orders/:id/delivered
// @access Private/admin - manager
exports.updateOrderToDelivered = asynchandler(async (req, res, next) => {
  //1) get order by id
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`No order found for this id: ${req.params.id}`, 404)
    );
  }
  //2) update order status
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json({ status: "success", data: order });
});

// @desc get checkout stripe and send it as a response
// @route   GET /api/v1/orders/checkout-session/:cartId
// @access Proteect/User
// exports.checkoutSession = asynchandler(async (req, res, next) => {
//   // app setings => admin
//   const taxPrice = 0;
//   const shippingPrice = 0;
//   // 1) get cart depend on cartId
//   const cart = await CartModel.findById(req.params.cartId);
//   if (!cart) {
//     return next(new ApiError("No cart found", 404));
//   }

//   // 2)get total order price depend on cart price
//   const cartPrice = cart.totalPrice;
//   const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

//   // 3) create checkout session
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         name: req.user.fristName,
//         amount: totalOrderPrice * 100, // cents 0.10
//         currency: "usd",
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `${req.protocol}://${req.get("host")}/orders`,
//     cancel_url: `${req.protocol}://${req.get("host")}/cart`,
//     customer_email: req.user.email,
//     client_reference_id: req.params.cartId,
//     metadata: req.body.shippingAddress,
//   });

//   // 4) return checkout session to response
//   res.status(200).json({ status: "success", data: session });
// });
exports.checkoutSession = asynchandler(async (req, res, next) => {
  // App settings (Admin)
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart by cartId
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("No cart found", 404));
  }

  // 2) Calculate total order price
  const cartPrice = cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create checkout session
  const name = req.user.fristName
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name:`Order for ${name} `,
          },
          unit_amount: totalOrderPrice * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: String(req.params.cartId), 
    metadata: req.body.shippingAddress || {}, 
  });

  // 4) Return checkout session in response
  res.status(200).json({ status: "success", data: session });
});
