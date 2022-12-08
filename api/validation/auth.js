const { session } = require("passport");
const passport = require("passport");
const { check } = require("express-validator");
//@ Validate Input from client for auth

let validateRegisterUser = () => {
  return [
    check("lastName", "lastName does not Empty").not().isEmpty(),
    check("lastName", "lastName must be Alphanumeric").isAlphanumeric(),
    check("firstName", "firstName does not Empty").not().isEmpty(),
    check("firstName", "firstName must be Alphanumeric").isAlphanumeric(),
    check("email", "Invalid does not Empty").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "password more than 6 degits").isLength({ min: 6 }),
  ];
};

let validateResetToken = () => {
  return [
    check("password", "password more than 6 degits").isLength({ min: 6 }),
  ];
};

let validateForgot = () => {
  return [
    check("email", "Invalid does not Empty").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
  ];
};

let validateLogin = () => {
  return [
    check("email", "Invalid does not Empty").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "password more than 6 degits").isLength({ min: 6 }),
  ];
};

let validateResetPassword = () => {
  return [
    check("email", "Invalid email").isEmail(),
    check("email", "Invalid does not Empty").not().isEmpty(),
    check("password", "password more than 6 degits").isLength({ min: 6 }),
  ];
};

let validateGoogleCallback = () => {
  return passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  });
};

let validateGoogle = () => {
  return passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    accessType: "offline",
    approvalPrompt: "force",
  });
};

let validateFacebook = () => {
  return passport.authenticate("facebook", {
    session: false,
    scope: ["public_profile", "email"],
  });
};

let validateFacebookCallback = () => {
  return passport.authenticate("facebook", {
    failureRedirect: "/",
    session: false,
  });
};

let auth = () => {
  return passport.authenticate("jwt", { session: false });
};

let validate = {
  validateRegisterUser: validateRegisterUser,
  validateLogin: validateLogin,
  validateForgot: validateForgot,
  validateResetToken: validateResetToken,
  validateResetPassword: validateResetPassword,
  validateGoogle: validateGoogle,
  validateGoogleCallback: validateGoogleCallback,
  validateFacebook: validateFacebook,
  validateFacebookCallback: validateFacebookCallback,
  auth: auth,
};

module.exports = { validate };
