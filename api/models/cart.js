const { Schema, model } = require("mongoose");

// Cart Item Schema
const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: Number,
  purchasePrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  priceWithTax: {
    type: Number,
    default: 0,
  },
  totalTax: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Not processed",
    enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"],
  },
});

module.exports = model("CartItem", CartItemSchema);

// Cart Schema
const CartSchema = new Schema({
  products: [CartItemSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Cart", CartSchema);
