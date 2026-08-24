const Product = require("../models/Product");
const Category = require("../models/Category");

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = "-createdAt",
      search,
      category,
      material,
      minPrice,
      maxPrice,
      minRating,
      featured,
      bestseller,
      newArrival,
      size,
    } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }

    if (material) filter.material = material;
    if (featured === "true") filter.featured = true;
    if (bestseller === "true") filter.bestseller = true;
    if (newArrival === "true") filter.newArrival = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.averageRating = { $gte: Number(minRating) };
    if (size) filter.size = { $in: size.split(",") };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate("category", "name slug")
      .populate("reviews.user", "name avatar");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(8)
      .lean();

    res.status(200).json({ success: true, product, related });
  } catch (error) {
    console.error("Get product error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("reviews.user", "name avatar");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get product error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, discountPrice, category, subcategory,
      material, purity, weight, size, stock, SKU, brand, tags,
      featured, bestseller, newArrival, images,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
      });
    }

    const existingSku = SKU ? await Product.findOne({ SKU }) : null;
    if (existingSku) {
      return res.status(409).json({ success: false, message: "SKU already exists" });
    }

    const product = await Product.create({
      name, description, price, discountPrice, category, subcategory,
      material, purity, weight, size, stock, SKU, brand, tags,
      featured, bestseller, newArrival, images,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({ success: false, message: "Failed to create product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const allowedFields = [
      "name", "description", "price", "discountPrice", "category", "subcategory",
      "material", "purity", "weight", "size", "stock", "SKU", "brand", "tags",
      "featured", "bestseller", "newArrival", "isActive", "images",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Update product error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(409).json({ success: false, message: "You already reviewed this product" });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment || "",
    });

    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

    await product.save();
    res.status(201).json({ success: true, message: "Review added" });
  } catch (error) {
    console.error("Add review error:", error.message);
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
};
