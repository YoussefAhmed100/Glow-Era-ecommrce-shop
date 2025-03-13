const asynchandler = require("express-async-handler");

const UserModel = require("../models/userModel");

// @desc add adresses to user addresses list
// @route POST /api/adresses
// @access Protected/User
exports.addAddress = asynchandler(async (req, res, next) => {
    // $addToSet => add adress object to user addresses list array 
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        addresses: req.body,
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "address added successfully",
    data: user.addresses,
  });
});
// @desc remove address form user addresses list
// @route DELETE /api/addresses/:addressId
// @access Protected/User
exports.removeAddress = asynchandler(async (req, res, next) => {
    // $poll=> remove adress object from user addresses list array
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        addresses: {_id:req.params.addressId},
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Adress removed successfully",
    data: user.addresses,
  });
});

// @desc GET user addresses list
// @route GET /api/address
// @access Protected/User
exports.getLoggedUseraddress = asynchandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    data: user.addresses,
  });
});
