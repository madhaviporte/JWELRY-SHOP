require("dotenv").config();

const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for product seeding");

    const categories = await Category.find();
    const catMap = {};
    categories.forEach((c) => { catMap[c.name] = c._id; });

    await Product.deleteMany({});
    console.log("Cleared existing products");

    const products = [
      {
        name: "Eternal Rose Gold Ring",
        description: "A stunning rose gold ring with a minimalist design, perfect for everyday elegance. Crafted with precision and love.",
        price: 12999,
        discountPrice: 9999,
        category: catMap["Rings"],
        material: "rose-gold",
        purity: "18K",
        weight: "3.2g",
        stock: 25,
        SKU: "RGR-001",
        tags: ["ring", "rose-gold", "everyday", "minimal"],
        featured: true,
        bestseller: true,
        averageRating: 4.8,
        numReviews: 42,
        images: [{ url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600", alt: "Rose Gold Ring" }],
      },
      {
        name: "Diamond Solitaire Necklace",
        description: "An exquisite diamond solitaire pendant on a delicate gold chain. The epitome of timeless beauty and sophistication.",
        price: 45999,
        discountPrice: 38999,
        category: catMap["Necklaces"],
        material: "diamond",
        purity: "VS1 clarity",
        weight: "2.8g",
        stock: 15,
        SKU: "DSN-001",
        tags: ["necklace", "diamond", "solitaire", "luxury"],
        featured: true,
        newArrival: true,
        averageRating: 4.9,
        numReviews: 28,
        images: [{ url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600", alt: "Diamond Necklace" }],
      },
      {
        name: "Traditional Gold Jhumka Earrings",
        description: "Beautiful gold jhumka earrings inspired by traditional Indian jewellery. Perfect for festivals and special occasions.",
        price: 18500,
        category: catMap["Earrings"],
        material: "gold",
        purity: "22K",
        weight: "8.5g",
        stock: 30,
        SKU: "TGJ-001",
        tags: ["earrings", "gold", "jhumka", "traditional", "festive"],
        bestseller: true,
        averageRating: 4.7,
        numReviews: 65,
        images: [{ url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600", alt: "Gold Jhumka Earrings" }],
      },
      {
        name: "Sterling Silver Charm Bracelet",
        description: "A delicate sterling silver bracelet adorned with charming motifs. Lightweight and comfortable for daily wear.",
        price: 4999,
        discountPrice: 3499,
        category: catMap["Bracelets"],
        material: "silver",
        purity: "925 Sterling",
        weight: "12g",
        stock: 40,
        SKU: "SSC-001",
        tags: ["bracelet", "silver", "charm", "everyday"],
        featured: true,
        averageRating: 4.5,
        numReviews: 33,
        images: [{ url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600", alt: "Silver Charm Bracelet" }],
      },
      {
        name: "Bridal Gold Bangle Set",
        description: "A magnificent set of 4 gold bangles designed for the modern bride. Intricate patterns meet contemporary elegance.",
        price: 78000,
        category: catMap["Bridal Jewellery"],
        material: "gold",
        purity: "22K",
        weight: "48g",
        stock: 8,
        SKU: "BGB-001",
        tags: ["bangles", "gold", "bridal", "wedding", "set"],
        featured: true,
        averageRating: 4.9,
        numReviews: 12,
        images: [{ url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600", alt: "Bridal Gold Bangles" }],
      },
      {
        name: "Pearl Drop Pendant",
        description: "An elegant pearl drop pendant on a rose gold chain. Understated luxury for the modern woman.",
        price: 8999,
        discountPrice: 6999,
        category: catMap["Pendants"],
        material: "rose-gold",
        purity: "18K",
        weight: "2.1g",
        stock: 35,
        SKU: "PDP-001",
        tags: ["pendant", "pearl", "rose-gold", "elegant"],
        newArrival: true,
        averageRating: 4.6,
        numReviews: 20,
        images: [{ url: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600", alt: "Pearl Drop Pendant" }],
      },
      {
        name: "Men's Platinum Band",
        description: "A sleek platinum band for the modern man. Comfortable fit with a brushed matte finish.",
        price: 32000,
        category: catMap["Men's Jewellery"],
        material: "platinum",
        purity: "950 Platinum",
        weight: "8g",
        stock: 20,
        SKU: "MPB-001",
        tags: ["ring", "platinum", "men", "band", "modern"],
        bestseller: true,
        averageRating: 4.8,
        numReviews: 38,
        images: [{ url: "https://images.unsplash.com/photo-1515562141589-67f0d569b14c?w=600", alt: "Platinum Band" }],
      },
      {
        name: "Diamond Stud Earrings",
        description: "Classic diamond stud earrings in white gold. Timeless design that never goes out of style.",
        price: 24999,
        discountPrice: 19999,
        category: catMap["Diamond Jewellery"],
        material: "diamond",
        purity: "VVS1 clarity",
        weight: "2.4g",
        stock: 18,
        SKU: "DSE-001",
        tags: ["earrings", "diamond", "studs", "classic", "white-gold"],
        featured: true,
        bestseller: true,
        averageRating: 4.9,
        numReviews: 55,
        images: [{ url: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600", alt: "Diamond Stud Earrings" }],
      },
      {
        name: "Gold Temple Necklace",
        description: "Traditional South Indian temple necklace in pure gold. A masterpiece of heritage craftsmanship.",
        price: 125000,
        category: catMap["Gold Jewellery"],
        material: "gold",
        purity: "22K",
        weight: "62g",
        stock: 5,
        SKU: "GTN-001",
        tags: ["necklace", "gold", "temple", "south-indian", "heritage"],
        newArrival: true,
        averageRating: 5.0,
        numReviews: 8,
        images: [{ url: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600", alt: "Gold Temple Necklace" }],
      },
      {
        name: "Silver Oxidised Bangles Set",
        description: "A set of 6 oxidised silver bangles with intricate tribal patterns. Perfect for ethnic and fusion outfits.",
        price: 3999,
        category: catMap["Silver Jewellery"],
        material: "silver",
        purity: "925 Sterling",
        weight: "36g",
        stock: 50,
        SKU: "SOB-001",
        tags: ["bangles", "silver", "oxidised", "tribal", "ethnic"],
        averageRating: 4.4,
        numReviews: 47,
        images: [{ url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600", alt: "Silver Bangles" }],
      },
      {
        name: "Rose Gold Heart Pendant",
        description: "A delicate heart-shaped pendant in rose gold, adorned with tiny diamonds. A symbol of love.",
        price: 15999,
        discountPrice: 12999,
        category: catMap["Pendants"],
        material: "rose-gold",
        purity: "18K",
        weight: "2.5g",
        stock: 28,
        SKU: "RGP-001",
        tags: ["pendant", "rose-gold", "heart", "love", "diamond"],
        bestseller: true,
        averageRating: 4.7,
        numReviews: 31,
        images: [{ url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600", alt: "Rose Gold Heart Pendant" }],
      },
      {
        name: "Gold Chain for Men",
        description: "A classic gold chain designed for men. Sturdy yet elegant with a polished finish.",
        price: 22000,
        category: catMap["Men's Jewellery"],
        material: "gold",
        purity: "22K",
        weight: "18g",
        stock: 22,
        SKU: "MGC-001",
        tags: ["chain", "gold", "men", "classic"],
        averageRating: 4.6,
        numReviews: 24,
        images: [{ url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600", alt: "Gold Chain" }],
      },
    ];

    const productsWithSlugs = products.map((p) => ({
      ...p,
      slug: p.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));

    const created = await Product.insertMany(productsWithSlugs);
    console.log(`Seeded ${created.length} products`);

    await mongoose.disconnect();
    console.log("Product seeding complete");
  } catch (error) {
    console.error("Product seeding error:", error.message);
    process.exit(1);
  }
};

seedProducts();
