//Models ------------------------------------
const Brand = require("../models/brand");
const Product = require("../models/product");
//Models ------------------------------------

//Service Helper------------------------------
const store = require("../../utils/store");
//Service Helper------------------------------

//Access Public
//Get Brand by id choice
exports.getBrandWithId = async (req, res, next) => {
  try {
    const brandId = req.params.id;
    const brandDoc = await Brand.findOne({ _id: brandId });
    if (!brandDoc) {
      res.status(404).json({
        message: `Cannot find brand with the id: ${brandId}.`,
      });
    }

    res.status(200).json({
      brand: brandDoc,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

//Get list all Brand Actived
exports.getActivedBrand = async (req, res, next) => {
  try {
    const brands = await Brand.find({
      isActive: true,
    }).populate("merchant", "name");

    res.status(200).json({
      brands,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

//@Access Private
//@Dashboard

//Get all Brand if !merchant else only get brand(merchant)
exports.getBrand = async (req, res, next) => {
  try {
    let brands = null;
    const { merchant } = req.user.merchant;

    if (merchant) {
      brands = await Brand.find({
        merchant: merchant,
      }).populate("merchant", "name");
    } else {
      brands = await Brand.find({}).populate("merchant", "name");
    }

    res.status(200).json({
      brands,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
//Get with Marchant
exports.getBrandWithMarchant = async (req, res, next) => {
  try {
    let brands = null;
    let merchant = req.user.merchant;
    if (merchant) {
      brands = await Brand.find(
        {
          merchant: merchant,
        },
        "name"
      );
    } else {
      brands = await Brand.find({}, "name");
    }

    res.status(200).json({
      brands,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
// Add Brand
exports.addBrand = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;
    const brand = new Brand({
      name,
      description,
      isActive,
    });

    const brandDoc = await brand.save();

    res.status(200).json({
      success: true,
      message: `Brand has been added successfully!`,
      brand: brandDoc,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
//updateBrand not Actived
exports.updateBrand = async (req, res, next) => {
  try {
    const { update, slug } = req.body.brand;
    const brandId = req.params.id;
    const query = { _id: brandId };
    const foundBrand = await Brand.findOne({
      $or: [{ slug }],
    });

    if (foundBrand && foundBrand._id != brandId) {
      return res.status(400).json({ error: "Slug is already in use." });
    }

    await Brand.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Brand has been updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
//updateBrand not Actived
exports.updateBrandActive = async (req, res, next) => {
  try {
    const brandId = req.params.id;
    const update = req.body.brand;
    const query = { _id: brandId };

    // disable brand(brandId) products
    if (!update.isActive) {
      const products = await Product.find({ brand: brandId });
      store.disableProducts(products);
    }

    await Brand.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Brand has been updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
  //Delete Brand
  exports.deleteBrand = async (req, res, next) => {
    try {
      let brandId = req.params.id;
      const brand = await Brand.deleteOne({ _id: brandId });
      res.status(200).json({
        success: true,
        message: `Brand has been deleted successfully!`,
        brand,
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  };
};

exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: `Brand has been deleted successfully!`,
      brand,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
