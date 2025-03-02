const router = require("express").Router();
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const AuthService=require("../services/authServices")

const {
  getAllCategories,
  getSpesificCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

router
  .route("/")
  .get(getAllCategories)
  .post(AuthService.protect,AuthService.allowedTo("admin","manager"),createCategoryValidator, createCategory);

router
  .route("/:id")
  .get(getCategoryValidator, getSpesificCategory) //getSpesificCategory
  .put(AuthService.protect,AuthService.allowedTo("admin","manager"),updateCategoryValidator, updateCategory)
  .delete(AuthService.protect,AuthService.allowedTo("admin","manager"),deleteCategoryValidator, deleteCategory);

module.exports = router;
