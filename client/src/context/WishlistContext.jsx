import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const togglingRef = useRef(new Set());

  const fetchWishlistIds = useCallback(async () => {
    if (!user) {
      setWishlistIds(new Set());
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/wishlist");
      const ids = (res.data.wishlist?.products || []).map((p) =>
        typeof p === "string" ? p : p._id
      );
      setWishlistIds(new Set(ids));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlistIds();
  }, [fetchWishlistIds]);

  const toggleWishlist = useCallback(
    async (productId) => {
      // Prevent double-clicking on the same product
      if (togglingRef.current.has(productId)) return;

      togglingRef.current.add(productId);

      // Optimistic update
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        return next;
      });

      try {
        const res = await api.post("/wishlist/toggle", { productId });
        // Sync with server response action
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (res.data.action === "added") {
            next.add(productId);
          } else {
            next.delete(productId);
          }
          return next;
        });
        return res.data;
      } catch (err) {
        // Revert on failure
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (next.has(productId)) {
            next.delete(productId);
          } else {
            next.add(productId);
          }
          return next;
        });
        throw err;
      } finally {
        togglingRef.current.delete(productId);
      }
    },
    []
  );

  const isWishlisted = useCallback(
    (productId) => wishlistIds.has(productId),
    [wishlistIds]
  );

  const wishlistCount = wishlistIds.size;

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount,
        loading,
        toggleWishlist,
        isWishlisted,
        refreshWishlist: fetchWishlistIds,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
};
