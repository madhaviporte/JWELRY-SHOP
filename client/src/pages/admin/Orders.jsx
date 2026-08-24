import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import Pagination from "../../components/Pagination";
import "../Admin.css";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.set("status", statusFilter);
      const res = await api.get(`/admin/orders?${params}`);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success("Status updated");
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <h3>Admin Panel</h3>
            <nav className="admin-nav">
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/products">Products</Link>
              <Link to="/admin/orders" className="active">Orders</Link>
              <Link to="/admin/users">Users</Link>
              <Link to="/">Back to Store</Link>
            </nav>
          </aside>
          <div className="admin-main">
            <div className="admin-toolbar">
              <h1>Orders ({pagination.total})</h1>
              <select className="form-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>
            {loading ? <div className="loading-page"><div className="spinner" /></div> : (
              <div className="admin-section" style={{ overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id}>
                        <td><strong>{o.orderNumber}</strong></td>
                        <td>{o.user?.name}</td>
                        <td>{o.items.length}</td>
                        <td>₹{o.total.toLocaleString("en-IN")}</td>
                        <td><span className={`badge ${o.paymentStatus === "paid" ? "badge-success" : "badge-warning"}`}>{o.paymentStatus}</span></td>
                        <td>
                          <select className="form-input" style={{ width: "auto", padding: "6px 8px", fontSize: "0.8rem" }} value={o.orderStatus} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                            {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                          </select>
                        </td>
                        <td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={fetchOrders} />
          </div>
        </div>
      </div>
    </div>
  );
}
