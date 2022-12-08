//Models ------------------------------------
const Cart = require("../models/cart");
const Product = require("../models/product");
//Models ------------------------------------

//Service Helper------------------------------
const store = require("../../utils/store");
//Service Helper------------------------------

exports.addCart = async (req, res, next) => {
  try {
    const user = req.user._id;
    const items = req.body.products;

    const products = store.caculateItemsSalesTax(items);

    const cart = new Cart({
      user,
      products,
    });

    const cartDoc = await cart.save();

    decreaseQuantity(products);

    res.status(200).json({
      success: true,
      cartId: cartDoc.id,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.updateCartbyId = async (req, res, next) => {
  try {
    const product = req.body.product;
    const query = { _id: req.params.cartId };

    await Cart.updateOne(query, { $push: { products: product } }).exec();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.deleteCartbyId = async (req, res, next) => {
  try {
    await Cart.deleteOne({ _id: req.params.cartId });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const product = { product: req.params.productId };
    const query = { _id: req.params.cartId };

    await Cart.updateOne(query, { $pull: { products: product } }).exec();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

const decreaseQuantity = (products) => {
  let bulkOptions = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity } },
      },
    };
  });

  Product.bulkWrite(bulkOptions);
};
