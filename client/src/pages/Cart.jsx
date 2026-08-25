
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import "./Cart.css";

export default function Cart() {
  const { user } = useAuth();
  const { cart, loading, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state">
          <FiShoppingBag size={64} />
          <h3>Please sign in to view your cart</h3>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div></div>
    );
  }

  if (loading) {
    return <div className="loading-page"><div className="spinner" /></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state">
          <FiShoppingBag size={64} />
          <h3>Your cart is empty</h3>
          <p>Discover our exquisite collection</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div></div>
    );
  }

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success("Removed from cart");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleQuantityChange = async (itemId, newQty) => {
    try {
      await updateQuantity(itemId, newQty);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>{cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <Link to={`/product/${item.product?.slug || ""}`} className="cart-item__image">
                  <img src={item.image || "/placeholder.jpg"} alt={item.name} />
                </Link>
                <div className="cart-item__details">
                  <Link to={`/product/${item.product?.slug || ""}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  {item.size && <p>Size: {item.size}</p>}
                  <div className="cart-item__price">
                    ₹{(item.discountPrice > 0 && item.discountPrice < item.price ? item.discountPrice : item.price).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="cart-item__qty">
                  <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <FiMinus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock}>
                    <FiPlus size={14} />
                  </button>
                </div>
                <div className="cart-item__total">
                  ₹{((item.discountPrice > 0 && item.discountPrice < item.price ? item.discountPrice : item.price) * item.quantity).toLocaleString("en-IN")}
                </div>
                <button className="cart-item__remove" onClick={() => handleRemove(item._id)}>
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>₹{cart.totalPrice.toLocaleString("en-IN")}</span>
            </div>
            {cart.totalDiscount > 0 && (
              <div className="cart-summary__row cart-summary__row--discount">
                <span>Discount</span>
                <span>-₹{cart.totalDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="cart-summary__row">
              <span>Shipping</span>
              <span>{cart.totalPrice >= 999 ? "Free" : "₹99"}</span>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>₹{(cart.totalPrice + (cart.totalPrice >= 999 ? 0 : 99)).toLocaleString("en-IN")}</span>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 16 }} onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
            <Link to="/shop" className="btn btn-ghost" style={{ width: "100%", marginTop: 8 }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
