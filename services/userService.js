const asynchandler = require("express-async-handler");
const bcrypt = require("bcrypt");


const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");
const factory = require("./handlerFactory");


// @desc create user
// @route POST /api/users
// @access Private
exports.createUser = factory.createOne(UserModel);
//@desc get list of user
//@route GET /api/users
//access Private
exports.getAllUser = factory.getAll(UserModel);

//@desc get spesific users:id
//@route GET /api/users /:id
//access Private
exports.getSpesificUser = factory.getOne(UserModel);

//@desc Ubdate spesific users
//@route PUT /api/users/:id
//access Private
exports.updateUser = asynchandler(async (req, res, next) => {
  const document= await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      fristName: req.body.fristName,
      lastName: req.body.lastName,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document for this id:${req.params.id}`, 404));
  }
  res.status(200).json({ data:document });
});

exports.changeUserPassword = asynchandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password , 12),
      passwordChangedAt:Date.now()
   
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document for this id:${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

//@desc delete spesific users
//@route DELETE /api/users/:id
//access private

exports.deleteUser = factory.deleteOne(UserModel);


