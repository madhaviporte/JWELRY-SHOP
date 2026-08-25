import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

import api from "../services/api";

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlistIds } = useWishlist();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setAllProducts(res.data.wishlist?.products || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchWishlist();
  }, [user]);

  const products = useMemo(
    () => allProducts.filter((p) => wishlistIds.has(p._id)),
    [allProducts, wishlistIds]
  );

  if (!user) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state">
          <FiHeart size={64} />
          <h3>Please sign in to view your wishlist</h3>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div></div>
    );
  }

  if (loading) {
    return <div className="loading-page"><div className="spinner" /></div>;
  }

  if (products.length === 0) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state">
          <FiHeart size={64} />
          <h3>Your wishlist is empty</h3>
          <p>Save your favourite pieces for later</p>
          <Link to="/shop" className="btn btn-primary">Explore Collection</Link>
        </div>
      </div></div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>My Wishlist</h1>
          <p>{products.length} {products.length === 1 ? "item" : "items"}</p>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onWishlistChange={fetchWishlist} />
          ))}
        </div>
      </div>
    </div>
  );
}
