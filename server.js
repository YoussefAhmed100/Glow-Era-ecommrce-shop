const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

const databaseConction = require("./config/DBconction");
const ApiError = require("./utils/apiError");
const globalError = require("./middleWare/errorMiddleWare");

// enable other domains to access our server
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: false,
  })
);

// app.options("*", cors());

// compress all responses
app.use(compression());
// Routes
const mountRoutes = require("./routes");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
} else if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// databaseConction
databaseConction();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// Mount Routes
mountRoutes(app);

//Error handling  Middleware
app.all("*", (req, res, next) => {
  next(new ApiError(`cant find this route ${req.originalUrl}`, 400));
});

app.use(globalError);

//start server

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Backend server is running on http://localhost:${PORT}`.green.inverse
  );
});

// Event =>listen => callback(err) => outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors ${err.name} ||  ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
