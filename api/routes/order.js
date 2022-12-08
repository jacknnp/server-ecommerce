const express = require("express");
const {
  addOrder,
  getOrderBySearch,
  getOrder,
  getMyOrder,
  getOrderById,
  deleteOrder,
  updateOrder,
} = require("../controller/order");
const router = express.Router();

const { validate } = require("../validation/auth");

router.post("/add", validate.auth(), addOrder);

router.get("/search", validate.auth(), getOrderBySearch);

router.get("/", validate.auth(), getOrder);

router.get("/me", validate.auth(), getMyOrder);

router.get("/:orderId", validate.auth(), getOrderById);

router.delete("/cancel/:orderId", validate.auth(), deleteOrder);

router.put("/status/item/:itemId", validate.auth(), updateOrder);

module.exports = router;
