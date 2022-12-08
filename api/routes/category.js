const express = require("express");
const router = express.Router();

//Validation---------------------------------------
const role = require("../validation/checkRole");
const { validate } = require("../validation/auth");
//Validation---------------------------------------

//Controllers-------------------------------------
const {
  getCategory,
  getCategoryList,
  getCategoryById,
  addCategory,
  updateCategoryById,
  updateCategoryByIdActive,
  deleteCategory,
} = require("../controller/category");
//Controllers-------------------------------------

//Store----------------------------------------------
router.get("/", getCategory);
router.get("/list", getCategoryList);
router.get("/:id", getCategoryById);
//Store----------------------------------------------

router.post(
  "/add",
  validate.auth(),
  role.checkRole(role.ROLES.Admin),
  addCategory
);
router.put(
  "/:id",
  validate.auth(),
  role.checkRole(role.ROLES.Admin),
  updateCategoryById
);

router.put(
  "/:id/active",
  validate.auth(),
  role.checkRole(role.ROLES.Admin),
  updateCategoryByIdActive
);

router.delete(
  "/delete/:id",
  validate.auth(),
  role.checkRole(role.ROLES.Admin),
  deleteCategory
);

module.exports = router;
