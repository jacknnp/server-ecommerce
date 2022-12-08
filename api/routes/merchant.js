const express = require("express");
const router = express.Router();

//Validation---------------------------------------
const role = require("../validation/checkRole");
const { validate } = require("../validation/auth");

//Validation---------------------------------------

//Controller---------------------------------------
const {
  addMerchant,
  getMerchant,
  getMerchantBySearch,
  addMerchantWithToken,
  updateMerchantActived,
  updateMerchantReject,
  deleteMerchant,
  updateMerchantApprove,
} = require("../controller/merchant");
//Controller---------------------------------------

router.get("/", validate.auth(), role.checkRole(role.ROLES.Admin), getMerchant);
router.get(
  "/search",
  validate.auth(),
  role.checkRole(role.ROLES.Admin),
  getMerchantBySearch
);

router.post("/add", addMerchant);
router.post("/signup/:token", addMerchantWithToken);

router.put("/:id/active", validate.auth(), updateMerchantActived);
router.put("/approve/:id", validate.auth(), updateMerchantApprove);
router.put("/reject/:id", validate.auth(), updateMerchantReject);
router.delete(
  "/delete/:id",
  validate.auth(),
  role.checkRole(role.ROLES.Admin),
  deleteMerchant
);

module.exports = router;
