const express = require("express");
const router = express.Router();

//Routers--------------------------------
const {
  addCart,
  updateCartbyId,
  deleteCartbyId,
} = require("../controller/cart");
//Routers--------------------------------

//Validation---------------------------------------
const role = require("../validation/checkRole");
const { validate } = require("../validation/auth");
//Validation---------------------------------------

//Routers----------------------------------
router.post("/add", validate.auth(), addCart);

router.post("/add/:cartId", validate.auth(), updateCartbyId);

router.delete("/delete/:cardId", validate.auth(), deleteCartbyId);

router.delete("/delete/:cartId/:productId", validate.auth(), updateCartbyId);

//Routers----------------------------------

module.exports = router;
