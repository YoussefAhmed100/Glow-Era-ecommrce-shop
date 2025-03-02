const crypto = require("crypto");
const asynchandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

//helper function to generate jwt token
const genrateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
// @desc sinup
// @route POST /api/v1/auth/signup
// @access public
exports.signup = asynchandler(async (req, res, next) => {
  //1- create user
  const newUser = await UserModel.create({
    fristName: req.body.fristName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  });
  //2- genrate token
  const token = genrateToken(newUser._id);
  res.status(201).json({ data: newUser, token });
});
// @desc login
// @route POST /api/v1/auth/login
// @access public
exports.login = asynchandler(async (req, res, next) => {
  //1- find user
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }
  //2- genrate token
  const token = genrateToken(user._id);
  res.status(200).json({ data: user, token });
});
// @desc make sure user is logged in
exports.protect = asynchandler(async (req, res, next) => {
  //1) get token from header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // check if token is valid
  if (!token) {
    return next(new ApiError("Not authorized, please login", 401));
  }
  //2) verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //3) check if user still exists
  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("User no longer exists", 401));
  }
  //4) check if user changed password after the token was created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTime = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // password changed after token was created (Error)
    if (passwordChangedTime > decoded.iat) {
      return next(
        new ApiError("User recently changed password, please login again", 401)
      );
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asynchandler(async (req, res, next) => {
    // check if user has required roles

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          "You are does not have permission to access this route",
          403
        )
      );
    }
    next();
  });

exports.forgotPassword = asynchandler(async (req, res, next) => {
  // 1-find user based on email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`No user found with this email ${req.body.email}`, 404)
    );
  }
  //2 )if user exists, generate hash reset random 6 digits and save it in database
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // save hashed password reset code  in to database
  user.passwordResetCode = hashedResetCode;

  // add expiration time to password reset code
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
  user.passwordResetVerfid = false;
  // save changes
  await user.save();
  //3) send email with password reset code to user email
  await sendEmail({
    to: user.email,
    subject: "Reset Password",
    message: `Hi ${user.fristName},\n Your password reset code on your Glow Era account is:\n ${resetCode}\n Please use it within 10 minutes to reset your password.`,
  });
  res
    .status(200)
    .json({status:"Success", message: `Password reset code sent to ${user.email}` });
});
