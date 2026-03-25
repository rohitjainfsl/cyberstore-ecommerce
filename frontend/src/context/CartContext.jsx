import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { userInfo } = useContext(AuthContext);

  // Sync cart from backend when user logs in
  useEffect(() => {
    const syncCart = async () => {
      if (userInfo) {
        try {
          // Check for local items to merge
          const localItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
          if (localItems.length > 0) {
            for (const item of localItems) {
              await api.post("/api/cart", {
                productId: item.product,
                quantity: item.quantity,
              });
            }
            localStorage.removeItem("cartItems");
          }

          // Fetch final cart from backend
          const { data } = await api.get("/api/cart");
          setCartItems(data);
        } catch (error) {
          console.error("Cart sync error:", error);
        }
      } else {
        // Load anonymous local cart
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      }
    };
    syncCart();
  }, [userInfo]);

  const updateLocalStorage = (items) => {
    if (!userInfo) {
      localStorage.setItem("cartItems", JSON.stringify(items));
    }
  };

  const addToCart = async (product, qty) => {
    try {
      if (userInfo) {
        // Logged-in user uses backend Cart
        const { data } = await api.post("/api/cart", {
          productId: product._id,
          quantity: qty,
        });
        setCartItems(data);
      } else {
        // Anonymous user uses local storage
        const existItem = cartItems.find((x) => x.product === product._id);
        let newItems;
        if (existItem) {
          newItems = cartItems.map((x) =>
            x.product === existItem.product ? { ...x, quantity: qty } : x
          );
        } else {
          newItems = [...cartItems, { product: product._id, name: product.name, price: product.price, image: product.imageUrl, quantity: qty }];
        }
        setCartItems(newItems);
        updateLocalStorage(newItems);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (userInfo) {
        const { data } = await api.delete(`/api/cart/${productId}`);
        setCartItems(data);
      } else {
        const newItems = cartItems.filter((x) => x.product !== productId);
        setCartItems(newItems);
        updateLocalStorage(newItems);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (!userInfo) {
      localStorage.removeItem("cartItems");
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
