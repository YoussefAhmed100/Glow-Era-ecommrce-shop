const router = require("express").Router();

const {
    addProductToWishlist ,
    removeProductFromWishlist,
    getLoggedUserWishlist
} = require("../services/wishlistService");
const AuthService=require("../services/authServices")

router.use(AuthService.protect,AuthService.allowedTo("user"))
router.post("/", addProductToWishlist);

router.get("/", getLoggedUserWishlist);
router.delete("/:productId", removeProductFromWishlist);


module.exports = router;
