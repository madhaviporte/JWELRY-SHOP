import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Pagination from "../../components/Pagination";
import "../Admin.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set("search", search);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return (
    <div className="page">
      <div className="container">
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <h3>Admin Panel</h3>
            <nav className="admin-nav">
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/products">Products</Link>
              <Link to="/admin/orders">Orders</Link>
              <Link to="/admin/users" className="active">Users</Link>
              <Link to="/">Back to Store</Link>
            </nav>
          </aside>
          <div className="admin-main">
            <div className="admin-toolbar">
              <h1>Users ({pagination.total})</h1>
              <input className="form-input" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchUsers(1)} />
            </div>
            {loading ? <div className="loading-page"><div className="spinner" /></div> : (
              <div className="admin-section" style={{ overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td>{u.phone || "—"}</td>
                        <td><span className={`badge ${u.role === "admin" ? "badge-accent" : "badge-success"}`}>{u.role}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={fetchUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}
