const express = require("express");
const router = express.Router();

//Routers--------------------------------------
const auth = require("./auth");
const address = require("./address");
const brand = require("./brand");
const order = require("./order");
const user = require("./user");
const product = require("./product");
const cart = require("./cart");
const merchant = require("./merchant");
const contact = require("./contact");
const category = require("./category");
const review = require("./review");
const wishlist = require("./wishlist");
const newsletter = require("./newsletter");
//Routers--------------------------------------

//Routes----------------------
router.use("/auth", auth);
router.use("/address", address);
router.use("/brand", brand);
router.use("/order", order);
router.use("/user", user);
router.use("/product", product);
router.use("/contact", contact);
router.use("/newsletter", newsletter);
router.use("/category", category);
router.use("/cart", cart);
router.use("/merchant", merchant);
router.use("/wishlist", wishlist);
router.use("/review", review);
//Routes----------------------

module.exports = router;
