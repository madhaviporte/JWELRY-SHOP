import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiChevronDown } from "react-icons/fi";
import api from "../services/api";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!user) return;
    const fetchWishlistCount = async () => {
      try {
        const wishRes = await api.get("/wishlist");
        setWishlistCount(wishRes.data.wishlist?.products?.length || 0);
      } catch {
        // silent
      }
    };
    fetchWishlistCount();
    const interval = setInterval(fetchWishlistCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${mobileOpen ? "navbar--menu-open" : ""}`}>
        <div className="navbar__container">
          <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon">✦</span>
            <span className="navbar__logo-text">Elora</span>
          </Link>

          {/* Desktop links */}
          <div className="navbar__links navbar__links--desktop">
            <Link to="/" className={`navbar__link ${location.pathname === "/" ? "active" : ""}`}>Home</Link>
            <Link to="/shop" className={`navbar__link ${location.pathname.startsWith("/shop") && !location.search.includes("featured=true") ? "active" : ""}`}>Shop</Link>
            <Link to="/shop?featured=true" className={`navbar__link ${location.pathname === "/shop" && location.search.includes("featured=true") ? "active" : ""}`}>Collections</Link>
            {user?.role === "admin" && (
              <Link to="/admin" className={`navbar__link ${location.pathname.startsWith("/admin") ? "active" : ""}`}>Admin</Link>
            )}
          </div>

          <div className="navbar__actions">
            <button className="navbar__icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
              <FiSearch size={20} />
            </button>

            {user ? (
              <>
                <Link to="/wishlist" className="navbar__icon-btn navbar__icon-btn--mobile-hide">
                  <FiHeart size={20} />
                  {wishlistCount > 0 && <span className="navbar__badge">{wishlistCount}</span>}
                </Link>

                <Link to="/cart" className="navbar__icon-btn">
                  <FiShoppingBag size={20} />
                  {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
                </Link>

                <div className="navbar__user-menu">
                  <button className="navbar__icon-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                    <FiUser size={20} />
                    <FiChevronDown size={12} />
                  </button>
                  {userMenuOpen && (
                    <div className="navbar__dropdown">
                      <div className="navbar__dropdown-header">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                      <Link to="/profile" className="navbar__dropdown-item">My Profile</Link>
                      <Link to="/orders" className="navbar__dropdown-item">My Orders</Link>
                      <Link to="/wishlist" className="navbar__dropdown-item">Wishlist</Link>
                      <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--danger">
                        <FiLogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn-sm btn-outline-accent">Sign In</Link>
            )}
          </div>
        </div>

        {searchOpen && (
          <div className="navbar__search-bar">
            <form onSubmit={handleSearch} className="navbar__search-form">
              <FiSearch size={18} />
              <input
                type="text"
                placeholder="Search for jewellery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit">Search</button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile drawer — outside <nav> for proper z-index stacking */}
      <div className={`navbar__drawer ${mobileOpen ? "navbar__drawer--open" : ""}`}>
        <Link to="/" className={`navbar__link ${location.pathname === "/" ? "active" : ""}`}>Home</Link>
        <Link to="/shop" className={`navbar__link ${location.pathname.startsWith("/shop") && !location.search.includes("featured=true") ? "active" : ""}`}>Shop</Link>
        <Link to="/shop?featured=true" className={`navbar__link ${location.pathname === "/shop" && location.search.includes("featured=true") ? "active" : ""}`}>Collections</Link>
        {user?.role === "admin" && (
          <Link to="/admin" className={`navbar__link ${location.pathname.startsWith("/admin") ? "active" : ""}`}>Admin</Link>
        )}
      </div>

      {/* Mobile Overlay — outside <nav> for proper z-index stacking */}
      {mobileOpen && <div className="navbar__overlay" onClick={() => setMobileOpen(false)} />}
      {userMenuOpen && <div className="navbar__overlay" onClick={() => setUserMenuOpen(false)} />}
    </>
  );
}
