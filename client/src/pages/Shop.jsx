import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FiSliders, FiX } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import api from "../services/api";
import "./Shop.css";

const MATERIALS = ["gold", "silver", "platinum", "diamond", "rose-gold", "imitation"];
const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-averageRating", label: "Top Rated" },
  { value: "-soldCount", label: "Best Selling" },
];

export default function Shop() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    material: searchParams.get("material") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "-createdAt",
    featured: searchParams.get("featured") || "",
    bestseller: searchParams.get("bestseller") || "",
    newArrival: searchParams.get("newArrival") || "",
  });

  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage);
      params.set("limit", 12);
      if (category) params.set("category", category);
      if (filters.search) params.set("search", filters.search);
      if (filters.material) params.set("material", filters.material);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.featured) params.set("featured", "true");
      if (filters.bestseller) params.set("bestseller", "true");
      if (filters.newArrival) params.set("newArrival", "true");

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [category, currentPage, filters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.categories);
      } catch { /* silent */ }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", "1");
    setSearchParams(params);
    setFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "", material: "", minPrice: "", maxPrice: "",
      sort: "-createdAt", featured: "", bestseller: "", newArrival: "",
    });
    setSearchParams(category ? {} : {});
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>{activeCategory ? activeCategory.name : searchParams.get("search") ? `Results for "${searchParams.get("search")}"` : "Shop All Jewellery"}</h1>
          <p>{pagination.total} {pagination.total === 1 ? "product" : "products"} found</p>
        </div>

        <div className="shop-layout">
          {/* Filters Sidebar */}
          <aside className={`shop-filters ${filtersOpen ? "shop-filters--open" : ""}`}>
            <div className="shop-filters__header">
              <h3>Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="shop-filters__close">
                <FiX size={20} />
              </button>
            </div>

            <div className="shop-filters__section">
              <h4>Category</h4>
              <select
                value={category || ""}
                onChange={(e) => {
                  if (e.target.value) {
                    window.location.href = `/shop/${e.target.value}`;
                  } else {
                    window.location.href = "/shop";
                  }
                }}
                className="form-input"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="shop-filters__section">
              <h4>Material</h4>
              <div className="shop-filters__chips">
                {MATERIALS.map((m) => (
                  <button
                    key={m}
                    className={`shop-filters__chip ${filters.material === m ? "active" : ""}`}
                    onClick={() => handleFilterChange("material", filters.material === m ? "" : m)}
                  >
                    {m.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="shop-filters__section">
              <h4>Price Range</h4>
              <div className="shop-filters__price">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="form-input"
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="shop-filters__section">
              <h4>Special</h4>
              <div className="shop-filters__chips">
                <button
                  className={`shop-filters__chip ${filters.featured ? "active" : ""}`}
                  onClick={() => handleFilterChange("featured", filters.featured ? "" : "true")}
                >
                  Featured
                </button>
                <button
                  className={`shop-filters__chip ${filters.bestseller ? "active" : ""}`}
                  onClick={() => handleFilterChange("bestseller", filters.bestseller ? "" : "true")}
                >
                  Best Sellers
                </button>
                <button
                  className={`shop-filters__chip ${filters.newArrival ? "active" : ""}`}
                  onClick={() => handleFilterChange("newArrival", filters.newArrival ? "" : "true")}
                >
                  New Arrivals
                </button>
              </div>
            </div>

            <div className="shop-filters__actions">
              <button className="btn btn-primary" onClick={handleApplyFilters} style={{ width: "100%" }}>
                Apply Filters
              </button>
              <button className="btn btn-ghost" onClick={handleClearFilters} style={{ width: "100%" }}>
                Clear All
              </button>
            </div>
          </aside>

          {/* Products */}
          <div className="shop-main">
            <div className="shop-toolbar">
              <button className="btn btn-ghost shop-toolbar__filter-btn" onClick={() => setFiltersOpen(true)}>
                <FiSliders size={16} /> Filters
              </button>
              <select
                value={filters.sort}
                onChange={(e) => {
                  handleFilterChange("sort", e.target.value);
                  const params = new URLSearchParams(searchParams);
                  params.set("sort", e.target.value);
                  params.set("page", "1");
                  setSearchParams(params);
                }}
                className="form-input shop-toolbar__sort"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="loading-page">
                <div className="spinner" />
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn btn-outline" onClick={handleClearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {filtersOpen && <div className="shop-filters__overlay" onClick={() => setFiltersOpen(false)} />}
    </div>
  );
}
