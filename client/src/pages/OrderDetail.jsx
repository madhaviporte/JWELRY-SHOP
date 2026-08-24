import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../services/api";
import "./Orders.css";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!order) return <div className="empty-state"><h3>Order not found</h3></div>;

  const statusColors = {
    pending: "badge-warning", confirmed: "badge-accent",
    processing: "badge-accent", shipped: "badge-accent",
    out_for_delivery: "badge-success", delivered: "badge-success",
    cancelled: "badge-error",
  };

  const statusOrder = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
  const currentStatusIdx = statusOrder.indexOf(order.orderStatus);

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link to="/orders" className="btn btn-ghost" style={{ marginBottom: 24 }}>
          <FiArrowLeft /> Back to Orders
        </Link>

        <div className="page-header">
          <h1>Order {order.orderNumber}</h1>
          <span className={`badge ${statusColors[order.orderStatus]}`}>
            {order.orderStatus.replace("_", " ")}
          </span>
        </div>

        {/* Timeline */}
        {order.orderStatus !== "cancelled" && (
          <div className="order-timeline">
            {statusOrder.map((status, i) => (
              <div key={status} className={`timeline-step ${i <= currentStatusIdx ? "active" : ""}`}>
                <div className="timeline-step__dot" />
                <span>{status.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        )}

        {/* Items */}
        <div className="order-section">
          <h3>Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className="order-item">
              <img src={item.image || "/placeholder.jpg"} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <p>Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
              </div>
              <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>

        {/* Summary & Address */}
        <div className="order-detail-grid">
          <div className="order-section">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="order-section">
            <h3>Order Summary</h3>
            <div className="order-summary-row"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString("en-IN")}</span></div>
            <div className="order-summary-row"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span></div>
            <div className="order-summary-row"><span>Tax</span><span>₹{order.tax.toLocaleString("en-IN")}</span></div>
            <div className="order-summary-row order-summary-row--total"><span>Total</span><span>₹{order.total.toLocaleString("en-IN")}</span></div>
            <div className="order-summary-row"><span>Payment</span><span className={`badge ${order.paymentStatus === "paid" ? "badge-success" : "badge-warning"}`}>{order.paymentStatus}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
