const ProductModel = require("../models/productModel");
const factory = require("./handlerFactory");


// apply nested routes to get allproducts 
//@route GET /api/v1/categores/:categoryId/products
const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };//ا
  }
  req.filterObj = filterObject;
  next();
};

//@desc get list of Products
//@route GET /api/products
//access public
const getAllProducts = factory.getAll(ProductModel)

//@desc get spesific Product :id
//@route GET /api/products /:id
//access public
const getSpesificProduct = factory.getOne(ProductModel,"reviews");


// @desc create Product
// @route POST /api/products
// @access Private


 const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, quantity ,size} = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product images are required" });
    }

    const imageUrls = req.files.map((file) => file.path); //get image urls from req.files

    const newProduct = new ProductModel({
      title,
      description,
      price,
      category,
      quantity,
      size,
      images: imageUrls, 
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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
  createFilterObject
};
