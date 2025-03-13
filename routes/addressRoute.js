const router = require("express").Router();

const {
    addAddress ,
    getLoggedUseraddress,
    removeAddress
  
} = require("../services/addressService");
const {
    createAddressValidator,
    deleteAddressValidator 
  } = require("../utils/validators/addressValidator");
const AuthService=require("../services/authServices")

router.use(AuthService.protect,AuthService.allowedTo("user"))
router.post("/",createAddressValidator, addAddress);

router.get("/", getLoggedUseraddress);
router.delete("/:addressId",deleteAddressValidator, removeAddress);


module.exports = router;
