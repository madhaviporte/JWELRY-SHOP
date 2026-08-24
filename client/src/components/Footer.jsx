import { Link } from "react-router-dom";
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                <span className="footer__logo-icon">✦</span>
                <span className="footer__logo-text">Lumière</span>
              </Link>
              <p className="footer__tagline">
                Exquisite jewellery crafted with passion. Timeless elegance for every occasion.
              </p>
              <div className="footer__socials">
                <a href="#" aria-label="Instagram"><FiInstagram size={18} /></a>
                <a href="#" aria-label="Facebook"><FiFacebook size={18} /></a>
                <a href="#" aria-label="Twitter"><FiTwitter size={18} /></a>
              </div>
            </div>

            <div className="footer__col">
              <h4>Shop</h4>
              <Link to="/shop">All Jewellery</Link>
              <Link to="/shop?material=gold">Gold Jewellery</Link>
              <Link to="/shop?material=diamond">Diamond Jewellery</Link>
              <Link to="/shop?material=silver">Silver Jewellery</Link>
              <Link to="/shop?bestseller=true">Best Sellers</Link>
              <Link to="/shop?newArrival=true">New Arrivals</Link>
            </div>

            <div className="footer__col">
              <h4>Categories</h4>
              <Link to="/shop/rings">Rings</Link>
              <Link to="/shop/necklaces">Necklaces</Link>
              <Link to="/shop/earrings">Earrings</Link>
              <Link to="/shop/bracelets">Bracelets</Link>
              <Link to="/shop/bangles">Bangles</Link>
              <Link to="/shop/pendants">Pendants</Link>
            </div>

            <div className="footer__col">
              <h4>Help</h4>
              <Link to="/profile">My Account</Link>
              <Link to="/orders">Track Orders</Link>
              <Link to="/cart">Shopping Cart</Link>
              <Link to="/wishlist">Wishlist</Link>
            </div>

            <div className="footer__col">
              <h4>Contact</h4>
              <div className="footer__contact-item">
                <FiMapPin size={14} />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="footer__contact-item">
                <FiPhone size={14} />
                <span>+91 98765 43210</span>
              </div>
              <div className="footer__contact-item">
                <FiMail size={14} />
                <span>hello@lumiere.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-content">
            <p>© {new Date().getFullYear()} Lumière Jewellery. All rights reserved.</p>
            <div className="footer__bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Shipping Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
