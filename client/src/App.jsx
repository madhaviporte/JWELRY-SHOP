import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminProductForm from "./pages/admin/ProductForm";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartProvider>
      <WishlistProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
          },
        }}
      />
      <Navbar />
      <main style={{ paddingTop: "var(--nav-height)" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />
          <Route
            path="/checkout"
            element={<ProtectedRoute><Checkout /></ProtectedRoute>}
          />
          <Route
            path="/order-success"
            element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>}
          />
          <Route
            path="/orders"
            element={<ProtectedRoute><MyOrders /></ProtectedRoute>}
          />
          <Route
            path="/orders/:id"
            element={<ProtectedRoute><OrderDetail /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
          <Route
            path="/admin/products"
            element={<AdminRoute><AdminProducts /></AdminRoute>}
          />
          <Route
            path="/admin/products/new"
            element={<AdminRoute><AdminProductForm /></AdminRoute>}
          />
          <Route
            path="/admin/products/:id/edit"
            element={<AdminRoute><AdminProductForm /></AdminRoute>}
          />
          <Route
            path="/admin/orders"
            element={<AdminRoute><AdminOrders /></AdminRoute>}
          />
          <Route
            path="/admin/users"
            element={<AdminRoute><AdminUsers /></AdminRoute>}
          />
        </Routes>
      </main>
      <Footer />
      </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;