const bcrypt = require("bcryptjs");
const crypto = require("crypto");

//Models ------------------------------------
const Merchant = require("../models/merchant");
const User = require("../models/user");
const Brand = require("../models/brand");
//Models ------------------------------------

//Service Helper------------------------------
const mailgun = require("../service/mailgun");
//Service Helper------------------------------

exports.getMerchantBySearch = async (req, res, next) => {
  try {
    const { search } = req.query;

    const regex = new RegExp(search, "i");

    const merchants = await Merchant.find({
      $or: [
        { phoneNumber: { $regex: regex } },
        { email: { $regex: regex } },
        { name: { $regex: regex } },
        { brand: { $regex: regex } },
        { status: { $regex: regex } },
      ],
    });

    res.status(200).json({
      merchants,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.getMerchant = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const merchants = await Merchant.find()
      .sort("-created")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Merchant.countDocuments();

    res.status(200).json({
      merchants,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.addMerchant = async (req, res, next) => {
  try {
    const { name, business, phoneNumber, email, brand } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ error: "You must enter your name and email." });
    }

    if (!business) {
      return res
        .status(400)
        .json({ error: "You must enter a business description." });
    }

    if (!phoneNumber || !email) {
      return res
        .status(400)
        .json({ error: "You must enter a phone number and an email address." });
    }

    const existingMerchant = await Merchant.findOne({ email });

    if (existingMerchant) {
      return res
        .status(400)
        .json({ error: "That email address is already in use." });
    }

    const merchant = new Merchant({
      name,
      email,
      business,
      phoneNumber,
      brand,
    });
    const merchantDoc = await merchant.save();

    await mailgun.sendEmail(email, "merchant-application");

    res.status(200).json({
      success: true,
      message: `We received your request! we will reach you on your phone number ${phoneNumber}!`,
      merchant: merchantDoc,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.addMerchantWithToken = async (req, res, next) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: "You must enter an email address." });
    }

    if (!firstName || !lastName) {
      return res.status(400).json({ error: "You must enter your full name." });
    }

    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    const userDoc = await User.findOne({
      email,
      resetPasswordToken: req.params.token,
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const query = { _id: userDoc._id };
    const update = {
      email,
      firstName,
      lastName,
      password: hash,
      resetPasswordToken: undefined,
    };

    await User.findOneAndUpdate(query, update, {
      new: true,
    });

    const merchantDoc = await Merchant.findOne({
      email,
    });

    await createMerchantBrand(merchantDoc);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.updateMerchantActived = async (req, res, next) => {
  try {
    const merchantId = req.params.id;
    const update = req.body.merchant;
    const query = { _id: merchantId };

    await Merchant.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.updateMerchantApprove = async (req, res, next) => {
  try {
    const merchantId = req.params.id;
    const query = { _id: merchantId };
    const update = {
      status: "Approved",
      isActive: true,
    };

    const merchantDoc = await Merchant.findOneAndUpdate(query, update, {
      new: true,
    });

    await createMerchantUser(
      merchantDoc.email,
      merchantDoc.name,
      merchantId,
      req.headers.host
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.updateMerchantReject = async (req, res, next) => {
  try {
    const merchantId = req.params.id;

    const query = { _id: merchantId };
    const update = {
      status: "Rejected",
    };

    await Merchant.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.deleteMerchant = async (req, res, next) => {
  try {
    const merchant = await Merchant.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: `Merchant has been deleted successfully!`,
      merchant,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

const createMerchantBrand = async ({ _id, brand, business }) => {
  const newBrand = new Brand({
    name: brand,
    description: business,
    merchant: _id,
    isActive: false,
  });

  return await newBrand.save();
};
const createMerchantUser = async (email, name, merchant, host) => {
  const firstName = name;
  const lastName = "";

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const query = { _id: existingUser._id };
    const update = {
      merchant,
      role: role.ROLES.Merchant,
    };

    const merchantDoc = await Merchant.findOne({
      email,
    });

    await createMerchantBrand(merchantDoc);

    await mailgun.sendEmail(email, "merchant-welcome", null, name);

    return await User.findOneAndUpdate(query, update, {
      new: true,
    });
  } else {
    const buffer = await crypto.randomBytes(48);
    const resetToken = buffer.toString("hex");
    const resetPasswordToken = resetToken;

    const user = new User({
      email,
      firstName,
      lastName,
      resetPasswordToken,
      merchant,
      role: role.ROLES.Merchant,
    });

    await mailgun.sendEmail(email, "merchant-signup", host, {
      resetToken,
      email,
    });

    return await user.save();
  }
};
