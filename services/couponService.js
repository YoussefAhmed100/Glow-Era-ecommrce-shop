const CouponModel = require("../models/couponModel");
const factory = require("./handlerFactory");

//@desc get list of Coupons
//@route GET /api/Coupons
//access Private {admin - manager}
exports.getAllCoupons=factory.getAll(CouponModel)

//@desc get spesific Coupon :id
//@route GET /api/Coupons/:id
//access Private {admin - manager}
exports.getSpesificCoupon =factory.getOne(CouponModel)


// @desc create Coupon
// @route POST /api/Coupons
//access Private {admin - manager}
exports.createCoupon=factory.createOne(CouponModel)


//@desc Ubdate spesific Coupon
//@route PUT /api/Coupons/:id
//access Private {admin - manager}
exports.updateCoupon=factory.updateOne(CouponModel)

//@desc delete spesific Coupon
//@route DELETE /api/Coupons/:id
//access Private {admin - manager}

exports.deleteCoupon = factory.deleteOne(CouponModel);


