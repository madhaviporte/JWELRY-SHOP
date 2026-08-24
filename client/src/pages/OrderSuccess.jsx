import { Link, useLocation } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600, textAlign: "center", padding: "80px 24px" }}>
        <FiCheckCircle size={80} style={{ color: "var(--color-success)", marginBottom: 24 }} />
        <h1 style={{ marginBottom: 12 }}>Order Placed Successfully!</h1>
        <p style={{ color: "var(--color-text-light)", marginBottom: 8, fontSize: "1.05rem" }}>
          Thank you for your purchase. Your order has been confirmed.
        </p>
        {orderId && (
          <p style={{ color: "var(--color-text-muted)", marginBottom: 32 }}>
            Order ID: <strong>{orderId}</strong>
          </p>
        )}
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <Link to="/orders" className="btn btn-primary">View My Orders</Link>
          <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
