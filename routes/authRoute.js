const router = require("express").Router();
const { signupValidator,loginValidator  } = require("../utils/validators/authValidator");

const { signup ,login,forgotPassword} = require("../services/authServices");

router.route("/signup")
.post(signupValidator, signup);
router.route("/login")
.post(loginValidator, login);
router.route("/forgotpassword").post(forgotPassword)

module.exports = router;
