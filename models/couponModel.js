const mongoose = require('mongoose');
 const CouponSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true, "coupon name required"],
        unique:[true, "coupon name must be unique"],
      
    },
    expire:{
        type:Date,
        required:[true, " coupon expiry time required"]

    },
    discount:{
        type:Number,
        required:[true, "coupon discount required"],
        min:[0, "coupon discount must be positive"],
        max:[100, "coupon discount must be less than or equal to 100"]
    }




 },{timestamps:true})

 module.exports = mongoose.model('Coupon', CouponSchema);
   