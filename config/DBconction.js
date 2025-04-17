const mongoose = require("mongoose");
require('colors');

const databaseConction = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("✅ MongoDB connection successful".green.inverse);
    })
    .catch((err) => {
      console.error(`❌ Database connection error: ${err.message}`.red.bold);
      process.exit(1);
    });
}; 

module.exports = databaseConction;
