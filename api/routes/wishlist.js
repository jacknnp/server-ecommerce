const express = require("express");
const router = express.Router();

//Validation---------------------------------------
const role = require("../validation/checkRole");
const { validate } = require("../validation/auth");
const { getWishlist, addWishlist } = require("../controller/wishlist");
//Validation---------------------------------------

router.get("/", validate.auth(), getWishlist);

router.post("/", validate.auth(), addWishlist);

module.exports = router;
