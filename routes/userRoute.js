const router = require("express").Router();
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator
} = require("../utils/validators/userValidator");

const {
     createUser,
     getAllUser,
     getSpesificUser ,
     updateUser,
     deleteUser,
     changeUserPassword
} = require("../services/userService");
const AuthService=require("../services/authServices")

router.use(AuthService.protect,AuthService.allowedTo("admin"))

router 
  .route("/")
  .get(getAllUser)
  .post(createUserValidator ,createUser);

router
  .route("/:id")
  .get(getUserValidator,getSpesificUser) //getSpesificCategory
  .put( updateUserValidator,updateUser)
  .delete(deleteUserValidator,deleteUser);
// @desc route for change user password 
  router.put("/changePassword/:id",changePasswordValidator,changeUserPassword)

module.exports = router;
