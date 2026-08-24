import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../services/api";
import Pagination from "../../components/Pagination";
import "../Admin.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set("search", search);
      const res = await api.get(`/admin/products?${params}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts(pagination.page);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleActive = async (id, current) => {
    try {
      await api.put(`/products/${id}`, { isActive: !current });
      toast.success(current ? "Product deactivated" : "Product activated");
      fetchProducts(pagination.page);
    } catch {
      toast.error("Failed to update");
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
              <Link to="/admin/products" className="active">Products</Link>
              <Link to="/admin/orders">Orders</Link>
              <Link to="/admin/users">Users</Link>
              <Link to="/">Back to Store</Link>
            </nav>
          </aside>
          <div className="admin-main">
            <div className="admin-toolbar">
              <h1>Products ({pagination.total})</h1>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input className="form-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchProducts(1)} />
                <Link to="/admin/products/new" className="btn btn-primary btn-sm"><FiPlus /> Add Product</Link>
              </div>
            </div>
            {loading ? <div className="loading-page"><div className="spinner" /></div> : (
              <div className="admin-section" style={{ overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <img src={p.images?.[0]?.url || "/placeholder.jpg"} alt="" style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover" }} />
                          <div>
                            <strong style={{ fontSize: "0.85rem" }}>{p.name}</strong>
                            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{p.SKU || "No SKU"}</p>
                          </div>
                        </td>
                        <td>{p.category?.name || "—"}</td>
                        <td>₹{p.price.toLocaleString("en-IN")}</td>
                        <td style={{ color: p.stock <= 5 ? "var(--color-error)" : "inherit" }}>{p.stock}</td>
                        <td>
                          <button className={`badge ${p.isActive ? "badge-success" : "badge-error"}`} onClick={() => handleToggleActive(p._id, p.isActive)}>
                            {p.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <Link to={`/admin/products/${p._id}/edit`}><FiEdit2 size={16} /></Link>
                            <button onClick={() => handleDelete(p._id, p.name)}><FiTrash2 size={16} color="var(--color-error)" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={fetchProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
