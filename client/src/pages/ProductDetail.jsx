import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiMinus, FiPlus, FiTruck, FiRefreshCw, FiShield, FiZap } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import api from "../services/api";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [activeTab, setActiveTab] = useState("description");
  const liked = product ? isWishlisted(product._id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data.product);
        setRelated(res.data.related || []);
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) { toast.error("Please sign in"); return; }
    try {
      await addToCart(product._id, quantity, selectedSize);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!user) { toast.error("Please sign in"); return; }
    try {
      await addToCart(product._id, quantity, selectedSize);
      navigate("/checkout");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) { toast.error("Please sign in"); return; }
    try {
      const res = await toggleWishlist(product._id);
      toast.success(res.action === "added" ? "Added to wishlist" : "Removed from wishlist");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in"); return; }
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      toast.success("Review submitted");
      const res = await api.get(`/products/${slug}`);
      setProduct(res.data.product);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading) {
    return <div className="loading-page"><div className="spinner" /><p>Loading product...</p></div>;
  }

  if (!product) {
    return <div className="empty-state"><h3>Product not found</h3><Link to="/shop" className="btn btn-outline">Back to Shop</Link></div>;
  }

  const effectivePrice = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
        </div>

        <div className="product-detail">
          {/* Images */}
          <div className="product-detail__gallery">
            <div className="product-detail__main-image">
              <img
                src={product.images?.[selectedImage]?.url || "/placeholder.jpg"}
                alt={product.name}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="product-detail__thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`product-detail__thumb ${i === selectedImage ? "active" : ""}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img.url} alt={img.alt || product.name} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <p className="product-detail__category">{product.category?.name}</p>
            <h1 className="product-detail__name">{product.name}</h1>

            <div className="product-detail__rating">
              <span className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(product.averageRating) ? "star-filled" : "star-empty"}>★</span>
                ))}
              </span>
              <span>{product.averageRating?.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>

            <div className="product-detail__price">
              <span className="product-detail__current-price">₹{effectivePrice.toLocaleString("en-IN")}</span>
              {hasDiscount && (
                <>
                  <span className="product-detail__original-price">₹{product.price.toLocaleString("en-IN")}</span>
                  <span className="product-detail__discount">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="product-detail__meta">
              {product.material && <div><strong>Material:</strong> <span>{product.material.replace("-", " ")}</span></div>}
              {product.purity && <div><strong>Purity:</strong> <span>{product.purity}</span></div>}
              {product.weight && <div><strong>Weight:</strong> <span>{product.weight}</span></div>}
              {product.SKU && <div><strong>SKU:</strong> <span>{product.SKU}</span></div>}
            </div>

            {product.size?.length > 0 && (
              <div className="product-detail__sizes">
                <h4>Size</h4>
                <div className="product-detail__size-options">
                  {product.size.map((s) => (
                    <button
                      key={s}
                      className={`product-detail__size-btn ${selectedSize === s ? "active" : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-detail__stock">
              {product.stock > 0 ? (
                <span className="badge badge-success">In Stock ({product.stock} available)</span>
              ) : (
                <span className="badge badge-error">Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <>
                <div className="product-detail__quantity">
                  <h4>Quantity</h4>
                  <div className="product-detail__qty-control">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                      <FiMinus size={16} />
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>
                      <FiPlus size={16} />
                    </button>
                  </div>
                </div>

                <div className="product-detail__actions">
                  <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{ flex: 1 }}>
                    <FiShoppingBag /> Add to Cart
                  </button>
                  <button className="btn btn-accent btn-lg product-detail__buy-now" onClick={handleBuyNow} style={{ flex: 1 }}>
                    <FiZap /> Buy Now
                  </button>
                  <button className="btn btn-outline-accent btn-lg" onClick={handleAddToWishlist}>
                    <FiHeart size={20} fill={liked ? "currentColor" : "none"} color={liked ? "var(--color-accent, #e74c7a)" : undefined} />
                  </button>
                </div>
              </>
            )}

            <div className="product-detail__benefits">
              <div><FiTruck size={16} /> Free shipping on orders above ₹999</div>
              <div><FiRefreshCw size={16} /> 30-day easy returns</div>
              <div><FiShield size={16} /> Authenticity guaranteed</div>
            </div>

            {/* Tabs */}
            <div className="product-detail__tabs">
              <div className="product-detail__tab-nav">
                <button className={activeTab === "description" ? "active" : ""} onClick={() => setActiveTab("description")}>Description</button>
                <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
                  Reviews ({product.numReviews})
                </button>
              </div>

              {activeTab === "description" && (
                <div className="product-detail__tab-content">
                  <p>{product.description || "No description available."}</p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="product-detail__tab-content">
                  {product.reviews?.length > 0 ? (
                    <div className="product-detail__reviews">
                      {product.reviews.map((review, i) => (
                        <div key={i} className="review-card">
                          <div className="review-card__header">
                            <strong>{review.name}</strong>
                            <span className="stars">
                              {[...Array(5)].map((_, j) => (
                                <span key={j} className={j < review.rating ? "star-filled" : "star-empty"}>★</span>
                              ))}
                            </span>
                          </div>
                          <p>{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No reviews yet. Be the first to review!</p>
                  )}

                  {user && (
                    <form onSubmit={handleSubmitReview} className="review-form">
                      <h4>Write a Review</h4>
                      <div className="review-form__rating">
                        <label>Rating:</label>
                        <div className="stars" style={{ cursor: "pointer" }}>
                          {[1, 2, 3, 4, 5].map((r) => (
                            <span
                              key={r}
                              className={r <= reviewForm.rating ? "star-filled" : "star-empty"}
                              onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                              style={{ fontSize: "1.5rem" }}
                            >★</span>
                          ))}
                        </div>
                      </div>
                      <textarea
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="form-input"
                        rows={4}
                      />
                      <button type="submit" className="btn btn-primary btn-sm">Submit Review</button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="product-detail__related">
            <div className="section-title">
              <h2>You May Also Like</h2>
              <div className="accent-line" />
            </div>
            <div className="products-grid">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
