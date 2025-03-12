const express = require("express");
const app = express();

require("dotenv").config();
const cors = require("cors");
const compression = require('compression')


// const dotenv = require("dotenv");
const morgan = require("morgan");

const cookieParser = require("cookie-parser");
const databaseConction = require("./config/DBconction");
const ApiError = require("./utils/apiError");
const globalError = require("./middleWare/errorMiddleWare");
// Routes
const categoryRoute = require("./routes/categoryRoute");
const cartRoute = require("./routes/cartRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const orderRoute = require("./routes/orderRoute");
const reviewRoute = require("./routes/reviewRoute");
const wishlistRoute = require("./routes/wishlistRoute");

// enable other domains to access our server
app.use(cors())
app.options('*',cors())
// compress all responses
app.use(compression())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode:${process.env.NODE_ENV}`);
}

// databaseConction
databaseConction();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/carts", cartRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/wishlist", wishlistRoute);

//Error handling  Middleware
app.all("*", (req, res, next) => {
  next(new ApiError(`cant find this route ${req.originalUrl}`, 400));
});

app.use(globalError);

//start server

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Backend server is running on port:${PORT}`.green.inverse);
});

// Event =>listen => callback(err) => outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors ${err.name} ||  ${err.massage}`);
  server.close(() => {
    process.exit(1);
  });
});
