const Category = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort("sortOrder");
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Get categories error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("Get category error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch category" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image, sortOrder } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }
    const category = await Category.create({ name, description, image, sortOrder });
    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error("Create category error:", error.message);
    res.status(500).json({ success: false, message: "Failed to create category" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, image, sortOrder, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (isActive !== undefined) category.isActive = isActive;
    await category.save();
    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("Update category error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete category" });
  }
};

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
