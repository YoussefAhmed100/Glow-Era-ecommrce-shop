const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "category required"],

      minlingth: [3, "Too short category name"],
      maxlingth: [32, "Too long category name"],
    },
    slug: {
      type: String,

      lowercase: true,
    },
    description: {
      type: String,
      required: [true, " product description required"],
      minlength: [10, "Too short description"],
      maxlength: [500, "Too long description"],
    },

    price: {
      type: Number,
      required: [true, "  product price is required"],
      min: 1,
      max: [100000000, "Too long price "],
    },
    priceAfterDiscount: {
      type: Number,
      min: 1,
      max: [100000000, "Too long price after discount "],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    size: {
      type: [String],
    },

    images: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong category "],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be between 1.0 and 5.0"],
      max: [5, "Rating must be between 1.0 and 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // enable virtuals population
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// mongoose query middleware
// get all reviews for this product
ProductSchema.virtual("reviews", {//populate from perent to child 
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name-_id",
  });
  next();
});

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;
