const mongoose = require("mongoose");
const productModel = require("./productModel");

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
reviewSchema.statics.calculateAvgRatingAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // statge 1: find the total number of reviews in specified product
    { $match: { product: productId } },
    // stage 2: calculate the average rating and total Reviews of the product 
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingAvarage: result[0].avgRating,
      ratingsQuantity: result[0].totalReviews,
    });
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingAvarage: 0,
      ratingsQuantity: 0,
    });
  }
};
// whin create or update a review, update the product rating and quantity
reviewSchema.post("save", async function () {
  await this.constructor.calculateAvgRatingAndQuantity(this.product);
});
// whin delete a review, update the product rating and quantity
reviewSchema.post("remove", async function () {
  await this.constructor.calculateAvgRatingAndQuantity(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
