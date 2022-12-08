const express = require("express");
const {
  getUserbySearch,
  getUser,
  updateUser,
  getUserById,
} = require("../controller/user");
const router = express.Router();

//Valition------------------------
const { validate } = require("../validation/auth");
const role = require("../validation/checkRole");
//Valition------------------------

router.get(
  "/search",
  validate.auth(),
  role.checkRole(role.ROLES.Admin),
  getUserbySearch
);

router.get("/", validate.auth(), getUser);

router.get("/me", validate.auth(), getUserById);

router.put("/", validate.auth(), updateUser);

module.exports = router;
