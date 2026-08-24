require("dotenv").config();

const mongoose = require("mongoose");
const Category = require("./models/Category");

const categories = [
  { name: "Rings", description: "Elegant rings for every occasion", sortOrder: 1 },
  { name: "Necklaces", description: "Beautiful necklaces and chains", sortOrder: 2 },
  { name: "Earrings", description: "Stunning earrings collection", sortOrder: 3 },
  { name: "Bracelets", description: "Stylish bracelets and cuffs", sortOrder: 4 },
  { name: "Bangles", description: "Traditional and modern bangles", sortOrder: 5 },
  { name: "Pendants", description: "Exquisite pendant designs", sortOrder: 6 },
  { name: "Bridal Jewellery", description: "Premium bridal collection", sortOrder: 7 },
  { name: "Men's Jewellery", description: "Jewellery designed for men", sortOrder: 8 },
  { name: "Gold Jewellery", description: "Pure gold jewellery collection", sortOrder: 9 },
  { name: "Silver Jewellery", description: "Sterling silver collection", sortOrder: 10 },
  { name: "Diamond Jewellery", description: "Sparkling diamond collection", sortOrder: 11 },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await Category.deleteMany({});
    console.log("Cleared existing categories");

    const created = await Category.insertMany(
      categories.map((c) => ({
        ...c,
        slug: c.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }))
    );
    console.log(`Seeded ${created.length} categories`);

    await mongoose.disconnect();
    console.log("Seeding complete");
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedCategories();
