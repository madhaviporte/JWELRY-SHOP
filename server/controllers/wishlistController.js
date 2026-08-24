const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products",
      "name slug images price discountPrice averageRating numReviews stock isActive"
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const validProducts = wishlist.products.filter((p) => p && p.isActive);
    if (validProducts.length !== wishlist.products.length) {
      wishlist.products = validProducts.map((p) => p._id);
      await wishlist.save();
    }

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch wishlist" });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.indexOf(productId);
    let action;

    if (index > -1) {
      wishlist.products.splice(index, 1);
      action = "removed";
    } else {
      wishlist.products.push(productId);
      action = "added";
    }

    await wishlist.save();

    await wishlist.populate(
      "products",
      "name slug images price discountPrice averageRating numReviews stock isActive"
    );

    res.status(200).json({ success: true, action, wishlist });
  } catch (error) {
    console.error("Toggle wishlist error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update wishlist" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== req.params.productId
    );
    await wishlist.save();

    await wishlist.populate(
      "products",
      "name slug images price discountPrice averageRating numReviews stock isActive"
    );

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error("Remove from wishlist error:", error.message);
    res.status(500).json({ success: false, message: "Failed to remove from wishlist" });
  }
};

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
