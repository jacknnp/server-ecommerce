const express = require("express");
const {
  getAddressAll,
  addAddress,
  findAddress,
  updateAddress,
  deleteADddress,
} = require("../controller/address");
const { validate } = require("../validation/auth");

const router = express.Router();

router.get("/", validate.auth(), getAddressAll);
router.post("/add", validate.auth(), addAddress);
router.get("/:id", findAddress);
router.put("/:id", updateAddress);
router.delete("/delelet/:id", deleteADddress);

module.exports = router;
