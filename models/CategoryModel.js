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
  { timestamps: true }
);
// module.exports = mongoose.model(" CategoryModel ", CategorySchema);
const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;
