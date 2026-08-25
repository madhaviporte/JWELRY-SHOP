import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import "./Home.css";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, bestRes, newRes, catRes] = await Promise.all([
          api.get("/products?featured=true&limit=8"),
          api.get("/products?bestseller=true&limit=8"),
          api.get("/products?newArrival=true&limit=8"),
          api.get("/categories"),
        ]);
        setFeatured(featRes.data.products);
        setBestsellers(bestRes.data.products);
        setNewArrivals(newRes.data.products);
        setCategories(catRes.data.categories);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__content container">
          <div className="hero__text">
            <p className="hero__subtitle">✦ Exquisite Craftsmanship</p>
            <h1 className="hero__title">
              Timeless Elegance,<br />Crafted for You
            </h1>
            <p className="hero__desc">
              Discover our curated collection of fine jewellery. Each piece tells a story of artistry, precision, and timeless beauty.
            </p>
            <div className="hero__buttons">
              <Link to="/shop" className="btn btn-primary btn-lg">
                Shop Collection <FiArrowRight />
              </Link>
              <Link to="/shop?featured=true" className="btn btn-outline btn-lg">
                Explore Designs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-bar__grid">
            <div className="trust-bar__item">
              <FiTruck size={24} />
              <div>
                <strong>Free Shipping</strong>
                <span>On orders above ₹999</span>
              </div>
            </div>
            <div className="trust-bar__item">
              <FiShield size={24} />
              <div>
                <strong>Secure Payment</strong>
                <span>100% secure checkout</span>
              </div>
            </div>
            <div className="trust-bar__item">
              <FiRefreshCw size={24} />
              <div>
                <strong>Easy Returns</strong>
                <span>30-day return policy</span>
              </div>
            </div>
            <div className="trust-bar__item">
              <FiHeadphones size={24} />
              <div>
                <strong>24/7 Support</strong>
                <span>Dedicated assistance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      {!loading && categories.length > 0 && (
        <section className="section categories-section">
          <div className="container">
            <div className="section-title">
              <h2>Shop by Category</h2>
              <p>Find the perfect piece for every occasion</p>
              <div className="accent-line" />
            </div>
            <div className="categories-grid">
              {categories.map((cat) => (
                <Link key={cat._id} to={`/shop/${cat.slug}`} className="category-card">
                  <div className="category-card__icon">
                    {getCategoryIcon(cat.name)}
                  </div>
                  <h3>{cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Collection */}
      {!loading && featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Featured Collection</h2>
              <p>Our handpicked selection of extraordinary pieces</p>
              <div className="accent-line" />
            </div>
            <div className="products-grid">
              {featured.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="section-cta">
              <Link to="/shop?featured=true" className="btn btn-outline">
                View All Featured <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-banner__content">
            <p className="promo-banner__subtitle">Limited Time Offer</p>
            <h2>Up to 30% Off on Bridal Collection</h2>
            <p>Make your special day even more memorable with our exquisite bridal jewellery</p>
            <Link to="/shop" className="btn btn-accent btn-lg">Shop Bridal</Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {!loading && bestsellers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Best Sellers</h2>
              <p>Our most loved and trusted designs</p>
              <div className="accent-line" />
            </div>
            <div className="products-grid">
              {bestsellers.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="section-cta">
              <Link to="/shop?bestseller=true" className="btn btn-outline">
                View All Best Sellers <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {!loading && newArrivals.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>New Arrivals</h2>
              <p>Fresh designs just added to our collection</p>
              <div className="accent-line" />
            </div>
            <div className="products-grid">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="section-cta">
              <Link to="/shop?newArrival=true" className="btn btn-outline">
                View All New Arrivals <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="section why-section">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Elora</h2>
            <div className="accent-line" />
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-card__number">01</div>
              <h3>Certified Quality</h3>
              <p>Every piece is BIS hallmarked and comes with a certificate of authenticity.</p>
            </div>
            <div className="why-card">
              <div className="why-card__number">02</div>
              <h3>Artisan Crafted</h3>
              <p>Handcrafted by master artisans with decades of experience in jewellery making.</p>
            </div>
            <div className="why-card">
              <div className="why-card__number">03</div>
              <h3>Premium Materials</h3>
              <p>We use only the finest gold, silver, diamonds, and gemstones in our creations.</p>
            </div>
            <div className="why-card">
              <div className="why-card__number">04</div>
              <h3>Trust & Transparency</h3>
              <p>Fair pricing, detailed product information, and hassle-free returns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay in the Loop</h2>
            <p>Subscribe for exclusive offers, new arrivals, and jewellery styling tips.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="newsletter-input" />
              <button type="submit" className="btn btn-accent">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function getCategoryIcon(name) {
  const icons = {
    "Rings": "💍",
    "Necklaces": "📿",
    "Earrings": "✨",
    "Bracelets": "⭕",
    "Bangles": "🔮",
    "Pendants": "💎",
    "Bridal Jewellery": "👑",
    "Men's Jewellery": "⚡",
    "Gold Jewellery": "🥇",
    "Silver Jewellery": "🥈",
    "Diamond Jewellery": "💎",
  };
  return icons[name] || "✦";
}
