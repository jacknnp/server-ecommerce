const express = require("express");
const router = express.Router();
//Controller------------------------
const {
  getActivedBrand,
  getBrandWithId,
  getBrand,
  getBrandWithMarchant,
  addBrand,
  updateBrand,
  updateBrandActive,
  deleteBrand,
} = require("../controller/brand");

const role = require("../validation/checkRole");
const { validate } = require("../validation/auth");

//@Access public
router.get("/list", getActivedBrand);
router.get("/:id", getBrandWithId);
//@Access private

//@Dashboard
router.get("/", validate.auth(), role.checkRole(role.ROLES.Admin), getBrand);
router.get(
  "/list/select",
  validate.auth(),
  role.checkRole(role.ROLES.Admin),
  getBrandWithMarchant
);
router.post(
  "/add",
  validate.auth(),
  role.checkRole(role.ROLES.Admin),
  addBrand
);
router.put(
  "/:id",
  validate.auth(),
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  updateBrand
);
router.put(
  "/:id/active",
  validate.auth(),
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  updateBrandActive
);
router.delete(
  "/delete/:id",
  validate.auth(),
  role.checkRole(role.ROLES.Admin),
  deleteBrand
);

module.exports = router;
