const ReviewModel = require("../models/reviewModel");
const factory = require("./handlerFactory");

// apply nested routes to get all reviews 
//@route GET /api/v1/products/:productId/reviews
const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };//ا
  }
  req.filterObj = filterObject;
  next();
};

// apply nested routes to create review 
//@route POST /api/v1/products/:productId/reviews
const setProductIdAndUserIdToBody=(req,res,next)=>{
  if(!req.body.product) req.body.product=req.params.productId;
  if(!req.body.user) req.body.user=req.user.id;
  next();
}
// @desc create reviews
// @route POST /api/reviews
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
  setProductIdAndUserIdToBody
};
