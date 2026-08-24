const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentId, razorpayOrderId } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    // Get cart and validate
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Validate stock and recalculate prices from DB
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name}" is no longer available`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}"`,
        });
      }

      const effectivePrice =
        product.discountPrice && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images.length > 0 ? product.images[0].url : "",
        price: effectivePrice,
        quantity: item.quantity,
        size: item.size || "",
      });

      subtotal += effectivePrice * item.quantity;

      // Reduce stock
      product.stock -= item.quantity;
      product.soldCount += item.quantity;
      await product.save();
    }

    // Calculate totals (backend authoritative)
    const discount = cart.totalDiscount || 0;
    const shipping = subtotal >= 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.03 * 100) / 100; // 3% GST
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal: Math.round(subtotal * 100) / 100,
      discount,
      shipping,
      tax,
      total,
      paymentStatus: paymentId ? "paid" : "pending",
      paymentId: paymentId || "",
      razorpayOrderId: razorpayOrderId || "",
      orderStatus: paymentId ? "confirmed" : "pending",
      statusHistory: [
        {
          status: paymentId ? "confirmed" : "pending",
          date: new Date(),
          note: paymentId ? "Payment received" : "Order placed",
        },
      ],
    });

    // Clear cart
    cart.items = [];
    cart.calculateTotals();
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Create order error:", error.message);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort("-createdAt")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Order.countDocuments({ user: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get my orders error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only allow user to view their own orders (or admin)
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get order error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldCount: -item.quantity },
      });
    }

    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    order.statusHistory.push({
      status: "cancelled",
      date: new Date(),
      note: req.body.reason || "Cancelled by customer",
    });

    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Cancel order error:", error.message);
    res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder };
