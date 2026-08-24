import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import Pagination from "../components/Pagination";
import api from "../services/api";
import "./Orders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?page=${page}&limit=10`);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  if (orders.length === 0) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state">
          <FiPackage size={64} />
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div></div>
    );
  }

  const getBadgeClass = (status) => ({
    pending: "badge-warning", confirmed: "badge-accent",
    processing: "badge-accent", shipped: "badge-accent",
    out_for_delivery: "badge-success", delivered: "badge-success",
    cancelled: "badge-error",
  }[status] || "badge-accent");

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>My Orders</h1></div>
        <div className="orders-list">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="order-card">
              <div className="order-card__header">
                <span className="order-card__number">{order.orderNumber}</span>
                <span className={`badge ${getBadgeClass(order.orderStatus)}`}>
                  {order.orderStatus.replace("_", " ")}
                </span>
              </div>
              <div className="order-card__items">
                {order.items.slice(0, 3).map((item, i) => (
                  <span key={i}>{item.name}{i < Math.min(order.items.length, 3) - 1 ? ", " : ""}</span>
                ))}
                {order.items.length > 3 && <span> +{order.items.length - 3} more</span>}
              </div>
              <div className="order-card__footer">
                <span className="order-card__total">₹{order.total.toLocaleString("en-IN")}</span>
                <span className="order-card__date">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </Link>
          ))}
        </div>
        <Pagination page={pagination.page} pages={pagination.pages} onPageChange={fetchOrders} />
      </div>
    </div>
  );
}
