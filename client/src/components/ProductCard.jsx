import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiZap } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import api from "../services/api";
import "./ProductCard.css";

export default function ProductCard({ product, onWishlistChange }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    try {
      const res = await api.post("/wishlist/toggle", { productId: product._id });
      if (res.data.action === "added") {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
      if (onWishlistChange) onWishlistChange();
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to add to cart");
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to buy now");
      return;
    }
    try {
      await addToCart(product._id, 1);
      navigate("/checkout");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const effectivePrice = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.slug}`} className="product-card card">
      <div className="product-card__image-wrap">
        <img
          src={product.images?.[0]?.url || "/placeholder.jpg"}
          alt={product.images?.[0]?.alt || product.name}
          className="product-card__image"
          loading="lazy"
        />
        {hasDiscount && <span className="product-card__discount-badge">-{discountPercent}%</span>}
        {product.newArrival && <span className="product-card__new-badge">New</span>}
        <div className="product-card__actions">
          <button onClick={handleAddToWishlist} className="product-card__action-btn" aria-label="Add to wishlist">
            <FiHeart size={18} />
          </button>
          <button onClick={handleAddToCart} className="product-card__action-btn product-card__action-btn--primary" aria-label="Add to cart">
            <FiShoppingBag size={18} />
          </button>
        </div>
      </div>
      <div className="product-card__info">
        <p className="product-card__category">{product.category?.name || ""}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__price-row">
          <span className="product-card__price">₹{effectivePrice.toLocaleString("en-IN")}</span>
          {hasDiscount && (
            <span className="product-card__original-price">₹{product.price.toLocaleString("en-IN")}</span>
          )}
        </div>
        {product.averageRating > 0 && (
          <div className="product-card__rating">
            <span className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(product.averageRating) ? "star-filled" : "star-empty"}>★</span>
              ))}
            </span>
            <span className="product-card__review-count">({product.numReviews})</span>
          </div>
        )}
        <div className="product-card__buy-row">
          <button onClick={handleBuyNow} className="btn btn-accent btn-sm product-card__buy-btn">
            <FiZap size={14} /> Buy Now
          </button>
        </div>
      </div>
    </Link>
  );
}
