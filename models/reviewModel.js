const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],

      min: [1, "rating minimum is 1"],
      max: [5, "rating maximum is 5"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product is required"],
    },
  },
  { timestamps: true }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "fristName lastName " });
  next();
});
module.exports = mongoose.model("Review", reviewSchema);
