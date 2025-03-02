const ApiError = require("../utils/apiError");

const sendErrorFordevelopmentMode = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorForProductionMode = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

  const handleJwtInvalidSignature=() =>new ApiError("Invalid token please login again", 401);
  const handleJwtExpired=() =>new ApiError("Your token has expired please login again", 401);

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  if (process.env.NODE_ENV === "development") {
    sendErrorFordevelopmentMode(err, res);
  } else {
    if (err.name === "JsonWebTokenError")err= handleJwtInvalidSignature() ;
    if (err.name === "TokenExpiredError")err= handleJwtExpired() ;
   
    sendErrorForProductionMode(err, res);
  }
};

module.exports = errorHandler;
