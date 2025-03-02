const ProductModel = require("../models/productModel");
const factory = require("./handlerFactory");

//@desc get list of Products
//@route GET /api/products
//access public
const getAllProducts = factory.getAll(ProductModel)
// const getAllProducts = asynchandler(async (req, res) => {
//   const countDecuoments = await ProductModel.countDocuments();
//   // Build query
//   const apiFeatures = new ApiFueatures(ProductModel.find(), req.query)
//     .paginate(countDecuoments)
//     .filter()
//     .limitFields()
//     .sort()
//     .search();

//   // Execute query
//   const { mongooseQuery, paginateResult } = apiFeatures;
//   const products = await mongooseQuery;
//   res
//     .status(200)
//     .json({ results: products.length, paginateResult, data: products });
// });
//@desc get spesific Product :id
//@route GET /api/products /:id
//access public
const getSpesificProduct = factory.getOne(ProductModel);


// @desc create Product
// @route POST /api/products
// @access Private
const createProduct = factory.createOne(ProductModel);

//@desc Ubdate spesific Product
//@route PUT /api/Product/:id
//access private
const updateProduct = factory.updateOne(ProductModel);

//@desc delete spesific Product
//@route DELETE /api/products/:id
//access private

const deleteProduct = factory.deleteOne(ProductModel);

module.exports = {
  getAllProducts,
  getSpesificProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
