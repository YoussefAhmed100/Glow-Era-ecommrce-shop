const jwt = require("jsonwebtoken");

const generateTokens = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });



  return token ;
};

module.exports = generateTokens;
