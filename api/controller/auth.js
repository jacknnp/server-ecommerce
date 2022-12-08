//const { Register } = require("../service/auth");
//@ router Post api/auth/register
//@desc Register user
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const mailgun = require("../service/mailgun.js");
const User = require("../models/user");
const crypto = require("crypto");
const keys = require("../../config/keys.js");
const { secret, tokenLife } = keys.jwt;

exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "This account is not register" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Password Incorrect" });
    }
    const payload = {
      id: user.id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });
    if (!token) {
      throw new Error();
    }
    return res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      message: "Loggin success !",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
//@access Public
exports.Signup = async (req, res, next) => {
  const { email, firstName, lastName, password } = req.body;
  const emailR = await User.findOne({ email });

  if (emailR) {
    return res.status(400).json({ error: "This email is already use !" });
  }
  try {
    console.log(req.body);
    const us = new User({ email, firstName, lastName, password });
    await us.save();
    res.status(200).json({ success: true, message: "success" });
  } catch (errors) {
    res.status(400).json({ error: "Error!! Please try again ! " });
  }
};
//@Forgot Password
exports.Forgot = async (req, res, next) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res
      .status(400)
      .send({ error: "No user found for this email address." });
  }
  try {
    const buffer = crypto.randomBytes(48);
    const resetToken = buffer.toString("hex");
    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordExpires = Date.now() + 360000;
    existingUser.save();
    console.log(existingUser);
    await mailgun.sendEmail(
      existingUser.email,
      "reset",
      req.headers.host,
      resetToken
    );
    res.status(200).json({
      success: true,
      message: `Sent your request success ! Please Check your email ${req.body.email}`,
    });
  } catch (errors) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
//@Create New Password with token
exports.resetWithToken = async (req, res, next) => {
  const { password } = req.body;

  const resetUser = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!resetUser) {
    res.status(400).json({
      success: false,
      message:
        "Your token has expired. Please attempt to reset your password again.",
    });
  }
  try {
    resetUser.password = password;
    resetUser.resetPasswordExpires = undefined;
    resetUser.resetPasswordToken = undefined;
    await resetUser.save();
    await mailgun.sendEmail(resetUser.email, "reset-confirmation");
    res.status(200).json({
      success: true,
      message:
        "Your password changed successfully . Please login with your new password",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
//@Change Password
exports.changePassword = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const checkEmail = await User.findOne({ email });

    if (!checkEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Unauthenticated" });
    }
    const isMatch = await bcrypt.compare(password, checkEmail.password);
    checkEmail.password = confirmPassword;
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Please enter  your correct old password ",
      });
    }

    await checkEmail.save();
    res
      .status(200)
      .json({ success: true, message: "Change Password Success ! " });
  } catch (error) {
    res.status(400).json({ error: "Please try again !" });
  }
};
//@Login with google
exports.googleCallback = (req, res, next) => {
  const payload = {
    id: req.user.id,
  };

  jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
    const jwt = `Bearer ${token}`;
    // TODO duplicate variable name. variable name conflict with module instance

    const htmlWithEmbeddedJWT = `
  <html>
    <script>
      // Save JWT to localStorage
      window.localStorage.setItem('token', '${jwt}');
      // Redirect browser to root of application
      window.location.href = '/auth/success';
    </script>
  </html>       
  `;

    res.send(htmlWithEmbeddedJWT);
  });
};
exports.facebookCallback = (req, res, next) => {
  const payload = {
    id: req.user.id,
  };

  jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
    const jwt = `Bearer ${token}`;

    const htmlWithEmbeddedJWT = `
  <html>
    <script>
      // Save JWT to localStorage
      window.localStorage.setItem('token', '${jwt}');
      // Redirect browser to root of application
      window.location.href = '/auth/success';
    </script>
  </html>       
  `;

    res.send(htmlWithEmbeddedJWT);
  });
};
