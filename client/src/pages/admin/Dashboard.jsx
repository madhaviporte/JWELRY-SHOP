import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiAlertTriangle } from "react-icons/fi";
import api from "../../services/api";
import "../Admin.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data.stats);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  const statCards = [
    { label: "Total Sales", value: `₹${(stats?.totalSales || 0).toLocaleString("en-IN")}`, icon: <FiDollarSign />, color: "#b8964e" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: <FiPackage />, color: "#2d7a4f" },
    { label: "Total Users", value: stats?.totalUsers || 0, icon: <FiUsers />, color: "#3b82f6" },
    { label: "Products", value: stats?.totalProducts || 0, icon: <FiShoppingBag />, color: "#8b5cf6" },
    { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: <FiAlertTriangle />, color: "#d4a017" },
    { label: "Low Stock", value: stats?.lowStockProducts || 0, icon: <FiAlertTriangle />, color: "#c4392d" },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <h3>Admin Panel</h3>
            <nav className="admin-nav">
              <Link to="/admin" className="active">Dashboard</Link>
              <Link to="/admin/products">Products</Link>
              <Link to="/admin/orders">Orders</Link>
              <Link to="/admin/users">Users</Link>
              <Link to="/">Back to Store</Link>
            </nav>
          </aside>

          <div className="admin-main">
            <h1>Dashboard</h1>
            <div className="admin-stats-grid">
              {statCards.map((card, i) => (
                <div key={i} className="admin-stat-card">
                  <div className="admin-stat-card__icon" style={{ color: card.color }}>{card.icon}</div>
                  <div>
                    <p className="admin-stat-card__label">{card.label}</p>
                    <p className="admin-stat-card__value">{card.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            {stats?.recentOrders?.length > 0 && (
              <div className="admin-section">
                <h2>Recent Orders</h2>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.orderNumber}</td>
                        <td>{order.user?.name}</td>
                        <td>₹{order.total.toLocaleString("en-IN")}</td>
                        <td><span className={`badge badge-${order.orderStatus === "delivered" ? "success" : order.orderStatus === "cancelled" ? "error" : "accent"}`}>{order.orderStatus.replace("_", " ")}</span></td>
                        <td>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
