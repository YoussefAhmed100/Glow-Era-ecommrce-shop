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
// const getSpesificCategory = asynchandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await CategoryModel.findById(id);
//   if (!category) {
//     return next(new ApiError(`No category for this ${id}`, 404));
//   }
//   res.status(200).json({ data: category });
// });

// @desc create category
// @route POST /api/categories
// @access Private
const createCategory=factory.createOne(CategoryModel)
// const createCategory = asynchandler(async (req, res) => {
//   const category = await CategoryModel.create(req.body);
//   res.status(201).json({ dada: category });
// });

//@desc Ubdate spesific ctegory
//@route PUT /api/category/:id
//access private
const updateCategory =factory.updateOne(CategoryModel)
// const updateCategory = asynchandler(async (req, res, next) => {
//   const category = await CategoryModel.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true }
//   );
//   if (!category) {
//     return next(new ApiError(`No category for this ${req.params.id}`, 404));
//   }
//   res.status(200).json({ data: category });
// });
// //@desc delete spesific ctegory
//@route DELETE /api/category/:id
//access private

const deleteCategory = factory.deleteOne(CategoryModel);
// const deleteCategory = asynchandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await CategoryModel.findByIdAndDelete(id);

//   if (!category) { return next(new ApiError(`No category for this ${id}`, 404));
//   }
//   res.status(200).json({ message: "category deleted successfully " });
// });
module.exports = {
  createCategory,
  updateCategory,
  getAllCategories,
  getSpesificCategory,
  deleteCategory,
};
