const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    size: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    itemCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.methods.calculateTotals = function () {
  let totalPrice = 0;
  let totalDiscount = 0;
  let itemCount = 0;

  this.items.forEach((item) => {
    totalPrice += item.price * item.quantity;
    if (item.discountPrice && item.discountPrice < item.price) {
      totalDiscount += (item.price - item.discountPrice) * item.quantity;
      totalPrice -= (item.price - item.discountPrice) * item.quantity;
    }
    itemCount += item.quantity;
  });

  this.totalPrice = Math.round(totalPrice * 100) / 100;
  this.totalDiscount = Math.round(totalDiscount * 100) / 100;
  this.itemCount = itemCount;
};

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
