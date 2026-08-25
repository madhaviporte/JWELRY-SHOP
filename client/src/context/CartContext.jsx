import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/cart");
      setCart(res.data.cart);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productId, quantity = 1, size = "") => {
      const res = await api.post("/cart", { productId, quantity, size });
      setCart(res.data.cart);
      return res.data.cart;
    },
    []
  );

  const computeCartTotals = (items) => {
    let totalPrice = 0;
    let totalDiscount = 0;
    let itemCount = 0;
    for (const item of items) {
      const effectivePrice =
        item.discountPrice > 0 && item.discountPrice < item.price
          ? item.discountPrice
          : item.price;
      totalPrice += effectivePrice * item.quantity;
      if (item.discountPrice > 0 && item.discountPrice < item.price) {
        totalDiscount += (item.price - item.discountPrice) * item.quantity;
      }
      itemCount += item.quantity;
    }
    return {
      totalPrice: Math.round(totalPrice * 100) / 100,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
      itemCount,
    };
  };

  const removeFromCart = useCallback(async (itemId) => {
    // Optimistic: remove item immediately
    setCart((prev) => {
      if (!prev) return prev;
      const newItems = prev.items.filter((item) => item._id !== itemId);
      const totals = computeCartTotals(newItems);
      return { ...prev, items: newItems, ...totals };
    });
    try {
      const res = await api.delete(`/cart/${itemId}`);
      setCart(res.data.cart);
    } catch (err) {
      // Revert on failure by re-fetching
      await fetchCart();
      throw err;
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(
    async (itemId, newQty) => {
      if (newQty < 1) return;
      // Optimistic: update quantity immediately
      let previousCart;
      setCart((prev) => {
        if (!prev) return prev;
        previousCart = prev;
        const newItems = prev.items.map((item) =>
          item._id === itemId ? { ...item, quantity: newQty } : item
        );
        const totals = computeCartTotals(newItems);
        return { ...prev, items: newItems, ...totals };
      });
      try {
        const res = await api.put(`/cart/${itemId}`, { quantity: newQty });
        setCart(res.data.cart);
      } catch (err) {
        // Revert on failure
        if (previousCart) setCart(previousCart);
        throw err;
      }
    },
    []
  );

  const cartCount = cart?.itemCount ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        cartCount,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
