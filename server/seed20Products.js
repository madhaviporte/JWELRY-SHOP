require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Category = require("./models/Category");

// 20 verified working unique Unsplash image URLs
const IMAGES = [
  "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600",
  "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600",
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600",
  "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",
  "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
  "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600",
  "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600",
  "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600",
  "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600",
  "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=600",
  "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600",
  "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600",
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600",
];

const products = [
  {
    name: "Amethyst Drop Earrings",
    description: "Elegant amethyst gemstone drop earrings set in 18K gold. A stunning pop of purple for any occasion.",
    price: 13999,
    discountPrice: 11999,
    categorySlug: "earrings",
    material: "gold",
    purity: "18K",
    weight: "4.5g",
    stock: 18,
    SKU: "N20-001",
    tags: ["amethyst", "drop", "gemstone"],
  },
  {
    name: "Gold Rope Chain Necklace",
    description: "A classic rope chain necklace in solid 22K gold. Timeless design with a luxurious twisted pattern.",
    price: 24999,
    categorySlug: "necklaces",
    material: "gold",
    purity: "22K",
    weight: "16.0g",
    stock: 15,
    SKU: "N20-002",
    bestseller: true,
    tags: ["gold", "rope", "chain"],
  },
  {
    name: "Cubic Zirconia Tennis Bracelet",
    description: "A sparkling CZ tennis bracelet in rhodium-plated silver. Affordable luxury with brilliant shine.",
    price: 3999,
    discountPrice: 2999,
    categorySlug: "bracelets",
    material: "silver",
    purity: "925 Sterling",
    weight: "8.0g",
    stock: 30,
    SKU: "N20-003",
    tags: ["cz", "tennis", "silver"],
  },
  {
    name: "Peacock Motif Jhumka Earrings",
    description: "Traditional peacock motif jhumkas in antique gold finish. Perfect for festivals and cultural events.",
    price: 9999,
    categorySlug: "earrings",
    material: "gold",
    purity: "22K",
    weight: "10.0g",
    stock: 22,
    SKU: "N20-004",
    bestseller: true,
    tags: ["peacock", "jhumka", "traditional"],
  },
  {
    name: "White Sapphire Pendant",
    description: "A brilliant white sapphire solitaire pendant on a delicate gold chain. Elegant everyday luxury.",
    price: 11999,
    discountPrice: 9999,
    categorySlug: "pendants",
    material: "gold",
    purity: "18K",
    weight: "3.0g",
    stock: 20,
    SKU: "N20-005",
    tags: ["sapphire", "pendant", "solitaire"],
  },
  {
    name: "Men's Silver Cuff Bracelet",
    description: "A bold sterling silver cuff bracelet with brushed finish. Modern masculine style.",
    price: 5999,
    categorySlug: "bracelets",
    material: "silver",
    purity: "925 Sterling",
    weight: "22.0g",
    stock: 18,
    SKU: "N20-006",
    tags: ["silver", "cuff", "mens"],
  },
  {
    name: "Polki Choker Necklace",
    description: "A regal polki choker necklace with uncut diamonds and gold accents. Bridal elegance redefined.",
    price: 35000,
    discountPrice: 31000,
    categorySlug: "necklaces",
    material: "diamond",
    purity: "22K Gold",
    weight: "38.0g",
    stock: 6,
    SKU: "N20-007",
    featured: true,
    tags: ["polki", "choker", "bridal"],
  },
  {
    name: "Ruby Stud Earrings",
    description: "Deep red ruby stud earrings in 18K gold settings. A bold statement of colour and luxury.",
    price: 18999,
    categorySlug: "earrings",
    material: "gold",
    purity: "18K",
    weight: "3.2g",
    stock: 12,
    SKU: "N20-008",
    tags: ["ruby", "studs", "gemstone"],
  },
  {
    name: "Oxidised Silver Jhumka",
    description: "Dark oxidised silver jhumkas with coin detailing. Boho ethnic charm for fusion outfits.",
    price: 3499,
    discountPrice: 2799,
    categorySlug: "earrings",
    material: "silver",
    purity: "925 Sterling",
    weight: "12.0g",
    stock: 25,
    SKU: "N20-009",
    tags: ["oxidised", "jhumka", "boho"],
  },
  {
    name: "Gold Mangalsutra Pendant",
    description: "A traditional mangalsutra pendant in 22K gold with black beads. Sacred symbolism meets fine design.",
    price: 8999,
    categorySlug: "pendants",
    material: "gold",
    purity: "22K",
    weight: "6.0g",
    stock: 30,
    SKU: "N20-010",
    bestseller: true,
    tags: ["mangalsutra", "traditional", "gold"],
  },
  {
    name: "Diamond Bangle Pair",
    description: "A pair of diamond-studded gold bangles with alternating stone patterns. Breathtaking sparkle.",
    price: 48000,
    discountPrice: 42000,
    categorySlug: "bangles",
    material: "diamond",
    purity: "18K",
    weight: "20.0g",
    stock: 8,
    SKU: "N20-011",
    featured: true,
    tags: ["diamond", "bangle", "pair"],
  },
  {
    name: "Rose Gold Anklet",
    description: "A delicate rose gold chain anklet with tiny heart charms. Feminine grace for every step.",
    price: 6499,
    categorySlug: "bracelets",
    material: "rose-gold",
    purity: "18K",
    weight: "4.0g",
    stock: 28,
    SKU: "N20-012",
    tags: ["rose-gold", "anklet", "heart"],
  },
  {
    name: "Temple Gold earrings",
    description: "Ornate temple-style gold earrings with Goddess Lakshmi motif. Heritage craftsmanship in every detail.",
    price: 16999,
    categorySlug: "earrings",
    material: "gold",
    purity: "22K",
    weight: "14.0g",
    stock: 10,
    SKU: "N20-013",
    tags: ["temple", "gold", "heritage"],
  },
  {
    name: "Diamond Infinity Ring",
    description: "An infinity-shaped diamond ring in white gold. A symbol of eternal love and commitment.",
    price: 27999,
    discountPrice: 24999,
    categorySlug: "rings",
    material: "diamond",
    purity: "18K White Gold",
    weight: "4.0g",
    stock: 14,
    SKU: "N20-014",
    tags: ["diamond", "infinity", "love"],
  },
  {
    name: "SilverToe Ring Set",
    description: "A set of 4 adjustable sterling silver toe rings with floral and geometric patterns.",
    price: 1999,
    categorySlug: "silver-jewellery",
    material: "silver",
    purity: "925 Sterling",
    weight: "6.0g",
    stock: 40,
    SKU: "N20-015",
    tags: ["silver", "toe-ring", "set"],
  },
  {
    name: "Gold Coin 5 Gram",
    description: "A 24K pure gold coin weighing 5 grams with embossed Ganesha design. Ideal for gifting.",
    price: 32500,
    categorySlug: "gold-jewellery",
    material: "gold",
    purity: "24K",
    weight: "5.0g",
    stock: 50,
    SKU: "N20-016",
    tags: ["gold", "coin", "investment"],
  },
  {
    name: "Emerald Cocktail Ring",
    description: "A statement emerald cocktail ring surrounded by diamond accents in yellow gold. Show-stopping glamour.",
    price: 55000,
    discountPrice: 49000,
    categorySlug: "rings",
    material: "gold",
    purity: "18K",
    weight: "8.0g",
    stock: 5,
    SKU: "N20-017",
    featured: true,
    tags: ["emerald", "cocktail", "statement"],
  },
  {
    name: "Titanium Wedding Band",
    description: "A modern titanium wedding band with brushed and polished dual finish. Built to last a lifetime.",
    price: 7999,
    categorySlug: "men-s-jewellery",
    material: "platinum",
    purity: "Titanium",
    weight: "6.0g",
    stock: 20,
    SKU: "N20-018",
    tags: ["titanium", "wedding", "mens"],
  },
  {
    name: "Kundan Bridal Set",
    description: "A complete kundan bridal jewellery set with necklace, earrings, and maang tikka. Royal wedding elegance.",
    price: 28000,
    discountPrice: 24500,
    categorySlug: "bridal-jewellery",
    material: "imitation",
    weight: "120.0g",
    stock: 6,
    SKU: "N20-019",
    featured: true,
    tags: ["kundan", "bridal", "set"],
  },
  {
    name: "Pearl Choker Set",
    description: "A freshwater pearl choker set with matching drop earrings. Timeless sophistication for formal events.",
    price: 14999,
    discountPrice: 12999,
    categorySlug: "necklaces",
    material: "gold",
    purity: "18K",
    weight: "28.0g",
    stock: 12,
    SKU: "N20-020",
    newArrival: true,
    tags: ["pearl", "choker", "set"],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const beforeCount = await Product.countDocuments();
    console.log("Products before:", beforeCount);

    // Fetch categories to map slugs to ObjectIds
    const categories = await Category.find();
    const catMap = {};
    categories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    // Check for existing product names AND SKUs to avoid duplicates
    const existingNames = await Product.find().distinct("name");
    const existingSKUs = await Product.find({ SKU: { $ne: null } }).distinct("SKU");
    const existingSet = new Set(existingNames);
    const existingSKUSet = new Set(existingSKUs);

    let inserted = 0;
    let skipped = 0;

    for (let i = 0; i < products.length; i++) {
      const p = products[i];

      if (existingSet.has(p.name) || existingSKUSet.has(p.SKU)) {
        console.log("SKIP (duplicate):", p.name);
        skipped++;
        continue;
      }

      const catId = catMap[p.categorySlug];
      if (!catId) {
        console.error("SKIP (no category):", p.name, "->", p.categorySlug);
        skipped++;
        continue;
      }

      const slug = p.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const doc = {
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice || 0,
        category: catId,
        images: [{ url: IMAGES[i], alt: p.name }],
        material: p.material,
        purity: p.purity || "",
        weight: p.weight || "",
        size: [],
        stock: p.stock,
        SKU: p.SKU,
        brand: "",
        tags: p.tags || [],
        featured: p.featured || false,
        bestseller: p.bestseller || false,
        newArrival: p.newArrival || false,
        averageRating: 0,
        numReviews: 0,
        isActive: true,
        soldCount: 0,
      };

      try {
        await Product.create(doc);
        inserted++;
        console.log("INSERTED:", p.name, "| img:", IMAGES[i].substring(IMAGES[i].lastIndexOf("/") + 1, IMAGES[i].lastIndexOf("/")) );
      } catch (err) {
        console.error("FAILED:", p.name, "->", err.message);
        skipped++;
      }
    }

    const afterCount = await Product.countDocuments();
    console.log("\n=== SUMMARY ===");
    console.log("Before:", beforeCount);
    console.log("Inserted:", inserted);
    console.log("Skipped:", skipped);
    console.log("After:", afterCount);
    console.log("Expected:", beforeCount + 20);
    console.log("Match:", afterCount === beforeCount + 20 ? "YES" : "NO — INVESTIGATE");

    // Verify all 20 images are unique
    const allImgs = products.map((_, i) => IMAGES[i]);
    const uniqueImgs = new Set(allImgs);
    console.log("\nImage uniqueness:", uniqueImgs.size === 20 ? "ALL 20 UNIQUE" : "ERROR — duplicates found");

    process.exit(0);
  } catch (err) {
    console.error("Fatal:", err.message);
    process.exit(1);
  }
}

seed();
