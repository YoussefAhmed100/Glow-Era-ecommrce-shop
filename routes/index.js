const categoryRoute = require("./categoryRoute");
const cartRoute = require("./cartRoute");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const orderRoute = require("./orderRoute");
const reviewRoute = require("./reviewRoute");
const wishlistRoute = require("./wishlistRoute");
const addressRoute = require("./addressRoute");
const couponRoute = require("./couponRoute");


const mountRoutes = (app) => {
  // 
  app.get("/",(req,res)=>{
    res.send("Glow-Era server is running");
  })
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/carts", cartRoute);
  app.use("/api/v1/orders", orderRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/coupons", couponRoute);
};
module.exports = mountRoutes;
