const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "order must be belongs to user"],
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number },
        size: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalOrderPrice: { type: Number },
    shippingAddress: {
      details: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    paymentMethodeType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    // cancelledReason: { type: String },
  },
  { timestamps: true }
);
// applay populate function
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstName lastName email",
  }).populate({
    path: "cartItems.product",
    select: "title  size images",
  });
  next();
});
module.exports = mongoose.model("Orders", orderSchema);
