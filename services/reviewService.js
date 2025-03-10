const ReviewModel = require("../models/reviewModel");
const factory = require("./handlerFactory");

// apply nested routes
//@route GET /api/v1/products/:productId/reviews
const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };//ا
  }
  req.filterObj = filterObject;
  next();
};
// @desc create category
// @route POST /api/categories
// @access Private
const createReviews = factory.createOne(ReviewModel);
//@desc get list of Reviews
//@route GET /api/reviews
//access protected
const getAllReviews = factory.getAll(ReviewModel);

//@desc get spesific categories :id
//@route GET /api/category/:id
//access protected
const getSpesificReviews = factory.getOne(ReviewModel);

//@desc Ubdate spesific ctegory
//@route PUT /api/category/:id
//access protected
const updateReviews = factory.updateOne(ReviewModel);

// //@desc delete spesific ctegory
//@route DELETE /api/category/:id
//access protected

const deleteReviews = factory.deleteOne(ReviewModel);

module.exports = {
  createReviews,
  getAllReviews,
  getSpesificReviews,
  updateReviews,
  deleteReviews,
  createFilterObject,
};
