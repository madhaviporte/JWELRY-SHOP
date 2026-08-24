const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getAllProductsAdmin,
} = require("../controllers/adminController");
const { createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

router.use(protect, adminOnly);

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.get("/products", getAllProductsAdmin);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;
