const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name slug images price discountPrice stock isActive"
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out products that no longer exist or are inactive
    const validItems = cart.items.filter((item) => item.product && item.product.isActive);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      cart.calculateTotals();
      await cart.save();
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch cart" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size = "" } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({ success: false, message: "Cannot add more than available stock" });
      }
      cart.items[existingItemIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images.length > 0 ? product.images[0].url : "",
        price: product.price,
        discountPrice: product.discountPrice || 0,
        quantity,
        size,
        stock: product.stock,
      });
    }

    cart.calculateTotals();
    await cart.save();

    await cart.populate("items.product", "name slug images price discountPrice stock isActive");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ success: false, message: "Failed to add to cart" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    // Re-check stock
    const product = await Product.findById(item.product);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    item.quantity = quantity;
    cart.calculateTotals();
    await cart.save();

    await cart.populate("items.product", "name slug images price discountPrice stock isActive");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Update cart error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update cart" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    cart.calculateTotals();
    await cart.save();

    await cart.populate("items.product", "name slug images price discountPrice stock isActive");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Remove from cart error:", error.message);
    res.status(500).json({ success: false, message: "Failed to remove from cart" });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = [];
    cart.calculateTotals();
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Clear cart error:", error.message);
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
