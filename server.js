const express = require("express");
const app = express();

require("dotenv").config();
const cors = require("cors");
const compression = require("compression");

// const dotenv = require("dotenv");
const morgan = require("morgan");

const cookieParser = require("cookie-parser");
const databaseConction = require("./config/DBconction");
const ApiError = require("./utils/apiError");
const globalError = require("./middleWare/errorMiddleWare");
// Routes
const mountRoutes = require("./routes");
// enable other domains to access our server
app.use(cors());
app.options("*", cors());
// compress all responses
app.use(compression());

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
mountRoutes(app);

//Error handling  Middleware
app.all("*", (req, res, next) => {
  next(new ApiError(`cant find this route ${req.originalUrl}`, 400));
});

app.use(globalError);

//start server


const PORT = process.env.PORT || 8000;
const server = app.listen(PORT,'0.0.0.0', () => {
  console.log(`Backend server is running on http://localhost:${PORT}`.green.inverse);
});

// Event =>listen => callback(err) => outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors ${err.name} ||  ${err.massage}`);
  server.close(() => {
    process.exit(1);
  });
});
