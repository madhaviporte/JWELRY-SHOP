import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import "../Admin.css";

const MATERIALS = ["gold", "silver", "platinum", "diamond", "rose-gold", "imitation", "other"];

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [form, setForm] = useState({
    name: "", description: "", price: "", discountPrice: "", category: "",
    material: "gold", purity: "", weight: "", stock: "", SKU: "", brand: "",
    tags: "", featured: false, bestseller: false, newArrival: false, isActive: true, size: "",
  });

  useEffect(() => {
    const fetchCats = async () => {
      const res = await api.get("/categories");
      setCategories(res.data.categories);
    };
    fetchCats();
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/id/${id}`);
          const p = res.data.product;
          setForm({
            name: p.name, description: p.description || "", price: p.price,
            discountPrice: p.discountPrice || "", category: p.category?._id || "",
            material: p.material || "gold", purity: p.purity || "", weight: p.weight || "",
            stock: p.stock, SKU: p.SKU || "", brand: p.brand || "",
            tags: p.tags?.join(", ") || "", featured: p.featured, bestseller: p.bestseller,
            newArrival: p.newArrival, isActive: p.isActive, size: p.size?.join(", ") || "",
          });
        } catch { toast.error("Product not found"); navigate("/admin/products"); }
        finally { setFetching(false); }
      };
      fetchProduct();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
        stock: Number(form.stock),
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        size: form.size ? form.size.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };

      if (id) {
        await api.put(`/products/${id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally { setLoading(false); }
  };

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  if (fetching) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <Link to="/admin/products" className="btn btn-ghost" style={{ marginBottom: 20 }}>← Back</Link>
        <div className="admin-section">
          <h2>{id ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Name *</label><input className="form-input" value={form.name} onChange={(e) => update("name", e.target.value)} required /></div>
            <div className="form-group"><label>Description</label><textarea className="form-input" rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group"><label>Price (₹) *</label><input type="number" className="form-input" value={form.price} onChange={(e) => update("price", e.target.value)} required /></div>
              <div className="form-group"><label>Discount Price (₹)</label><input type="number" className="form-input" value={form.discountPrice} onChange={(e) => update("discountPrice", e.target.value)} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div className="form-group"><label>Category *</label><select className="form-input" value={form.category} onChange={(e) => update("category", e.target.value)} required><option value="">Select</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
              <div className="form-group"><label>Material</label><select className="form-input" value={form.material} onChange={(e) => update("material", e.target.value)}>{MATERIALS.map((m) => <option key={m} value={m}>{m.replace("-", " ")}</option>)}</select></div>
              <div className="form-group"><label>Stock *</label><input type="number" className="form-input" value={form.stock} onChange={(e) => update("stock", e.target.value)} required /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div className="form-group"><label>Purity</label><input className="form-input" placeholder="e.g. 22K" value={form.purity} onChange={(e) => update("purity", e.target.value)} /></div>
              <div className="form-group"><label>Weight</label><input className="form-input" placeholder="e.g. 5g" value={form.weight} onChange={(e) => update("weight", e.target.value)} /></div>
              <div className="form-group"><label>SKU</label><input className="form-input" value={form.SKU} onChange={(e) => update("SKU", e.target.value)} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group"><label>Brand</label><input className="form-input" value={form.brand} onChange={(e) => update("brand", e.target.value)} /></div>
              <div className="form-group"><label>Tags (comma-separated)</label><input className="form-input" value={form.tags} onChange={(e) => update("tags", e.target.value)} /></div>
            </div>
            <div className="form-group"><label>Sizes (comma-separated)</label><input className="form-input" placeholder="S, M, L, XL" value={form.size} onChange={(e) => update("size", e.target.value)} /></div>
            <div style={{ display: "flex", gap: 24, margin: "16px 0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured</label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><input type="checkbox" checked={form.bestseller} onChange={(e) => update("bestseller", e.target.checked)} /> Bestseller</label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><input type="checkbox" checked={form.newArrival} onChange={(e) => update("newArrival", e.target.checked)} /> New Arrival</label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} /> Active</label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : id ? "Update Product" : "Create Product"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
