const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category required"],
      unique: [true, "category name must be unique"],
      minlingth: [3, "Too short category name"],
      maxlingth: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
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
// get all products for this Category
CategorySchema.virtual("products", {
  //populate from perent to child
  ref: "Products",
  foreignField: "category",
  localField: "_id",
});
const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;
