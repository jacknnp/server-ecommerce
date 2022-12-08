const express = require("express");
const {
  Signup,
  Forgot,
  resetWithToken,
  changePassword,
  googleCallback,
  facebookCallback,
  Login,
} = require("../controller/auth");
const { validate } = require("../validation/auth");
const { resultValidity } = require("../validation/result");
const router = express.Router();

/*  Auth page. */
router.post("/login", validate.validateLogin(), resultValidity, Login);
router.post(
  "/register",
  validate.validateRegisterUser(),
  resultValidity,
  Signup
);
router.post("/forgot", validate.validateForgot(), resultValidity, Forgot);
router.post("/reset/:token", validate.validateResetToken(), resetWithToken);
router.post(
  "/reset",
  validate.validateResetPassword(),
  resultValidity,
  changePassword
);
router.get("/google", validate.validateGoogle(), resultValidity);
router.get(
  "/google/callback",
  validate.validateGoogleCallback(),
  resultValidity,
  googleCallback
);
router.get("/facebook", validate.validateFacebook(), resultValidity);
router.get(
  "/facebook/callback",
  validate.validateFacebookCallback(),
  facebookCallback
);

module.exports = router;
