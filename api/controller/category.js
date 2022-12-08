//Models ------------------------------------
const Category = require("../models/category");
//Models ------------------------------------

//Service Helper------------------------------
const store = require("../../utils/store");

//Service Helper------------------------------

exports.addCategory = (req, res, next) => {
  try {
    const { name, description, products, isActive } = req.body;
    if (!description || !name) {
      return res
        .status(400)
        .json({ error: "You must enter description & name." });
    }

    const category = new Category({
      name,
      description,
      products,
      isActive,
    });

    category.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
      }

      res.status(200).json({
        success: true,
        message: `Category has been added successfully!`,
        category: data,
      });
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.getCategoryList = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({
      categories,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      categories,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const categoryDoc = await Category.findOne({ _id: categoryId }).populate({
      path: "products",
      select: "name",
    });

    if (!categoryDoc) {
      return res.status(404).json({
        message: "No Category found.",
      });
    }

    res.status(200).json({
      category: categoryDoc,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.updateCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const update = req.body.category;
    const query = { _id: categoryId };
    const { slug } = req.body.category;

    const foundCategory = await Category.findOne({
      $or: [{ slug }],
    });

    if (foundCategory && foundCategory._id != categoryId) {
      return res.status(400).json({ error: "Slug is already in use." });
    }

    await Category.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Category has been updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.updateCategoryByIdActive = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const update = req.body.category;
    const query = { _id: categoryId };

    // disable category(categoryId) products
    if (!update.isActive) {
      const categoryDoc = await Category.findOne(
        { _id: categoryId, isActive: true },
        "products -_id"
      ).populate("products");

      store.disableProducts(categoryDoc.products);
    }

    await Category.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Category has been updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const product = await Category.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: `Category has been deleted successfully!`,
      product,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
