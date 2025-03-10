const CategoryModel = require("../models/CategoryModel");
const factory = require("./handlerFactory");

//@desc get list of category
//@route GET /api/categorys
//access public
const getAllCategories=factory.getAll(CategoryModel)

//@desc get spesific categories :id
//@route GET /api/category/:id
//access public
const getSpesificCategory =factory.getOne(CategoryModel)


// @desc create category
// @route POST /api/categories
// @access Private
const createCategory=factory.createOne(CategoryModel)


//@desc Ubdate spesific ctegory
//@route PUT /api/category/:id
//access private
const updateCategory =factory.updateOne(CategoryModel)

// //@desc delete spesific ctegory
//@route DELETE /api/category/:id
//access private

const deleteCategory = factory.deleteOne(CategoryModel);

module.exports = {
  createCategory,
  updateCategory,
  getAllCategories,
  getSpesificCategory,
  deleteCategory,
};
