import { createContext, useContext, useEffect, useState } from "react";

import axios from "../services/axios";

// Create Context
const CartContext = createContext();

// Custom Hook
export const useCart = () => useContext(CartContext);

// Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const [loading, setLoading] = useState(false);

  // GET CART
  const getCart = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/cart");

      setCart(res.data.cart);
    } catch (error) {
  console.log(error);
  throw error;
}  finally {
      setLoading(false);
    }
  };

  // ADD TO CART
  const addToCart = async (productId, variantId, quantity) => {
    try {
      const res = await axios.post("/cart/add", {
        productId,
        variantId,
        quantity,
      });

      setCart(res.data.cart);
    } catch (error) {
  console.log(error);
  throw error;
}
  };

  // REMOVE ITEM
  const removeFromCart = async (itemId) => {
    try {
      const res = await axios.delete(`/cart/remove/${itemId}`);

      setCart(res.data.cart);
    } catch (error) {
  console.log(error);
  throw error;
}
  };

  // UPDATE QUANTITY
  const updateCart = async (itemId, quantity) => {
    try {
      const res = await axios.put(`/cart/update/${itemId}`, { quantity });

      setCart(res.data.cart);
    } catch (error) {
  console.log(error);
  throw error;
}
  };

  // CLEAR CART (after order)
  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  };

  // Load cart on start
  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        getCart,
        addToCart,
        removeFromCart,
        updateCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
