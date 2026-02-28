import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  const addToCart = (item, res) => {
    if (res) setRestaurant(res);
    setCart((prev) => {
      const existing = prev.find((i) => i.item_id === item.item_id);
      if (existing) {
        return prev.map((i) =>
          i.item_id === item.item_id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // NEW: Decrement or remove if qty becomes 0
  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const item = prev.find(i => i.item_id === itemId);
      if (item.qty > 1) {
        return prev.map(i => i.item_id === itemId ? { ...i, qty: i.qty - 1 } : i);
      }
      return prev.filter((i) => i.item_id !== itemId);
    });
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, restaurant, addToCart, removeFromCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);