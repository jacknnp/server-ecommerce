const express = require("express");

//Controller---------------------------
const {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductByNameSearch,
  getProductByFilter,
  getProductByBrand,
  getProductBySelect,
  addProduct,
  updateProduct,
  updateProductActived,
} = require("../controller/product");
//Controller---------------------------
const router = express.Router();

//Validation--------------------------
const { validate } = require("../validation/auth");
const role = require("../validation/checkRole");
//Validation---------------------------

//Upload file supporter------------
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
//Upload file supporter--------------

//Dashboard--------------------------------------
router.get(
  "/",
  validate.auth(),
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  getProducts
);

router.get(
  "/:id",
  validate.auth(),
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  getProductById
);

//Store -------------------------------------------
router.get("/item/:slug", getProductBySlug);
router.get("/list/search/:name", getProductByNameSearch);
router.get("/list", getProductByFilter);
router.get("/list/brand/:slug", getProductByBrand);
router.get("/list/select", getProductBySelect);

//Write---------------------------------------------
router.post(
  "/add",
  validate.auth(),
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  upload.single("image"),
  addProduct
);

router.put(
  "/:id",
  validate.auth(),
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  updateProduct
);

router.put(
  "/:id/active",
  validate.auth(),
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  updateProductActived
);

router.delete(
  "/delete/:id",
  validate.auth(),
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  updateProduct
);

//Write---------------------------------------------

module.exports = router;
