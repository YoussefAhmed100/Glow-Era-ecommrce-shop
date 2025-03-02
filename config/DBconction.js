const mongoose = require("mongoose");
require('colors');

const databaseConction =(req ,res )=>{
    
mongoose
.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then((res) => {
  console.log("mongodb connection successfully".red.inverse);
})
// .catch((err) => {
//   console.log(`Database error${err}`);
//   process.exit(1);
// });
}
module.exports = databaseConction; 