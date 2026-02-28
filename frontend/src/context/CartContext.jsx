import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('zomathon_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [activeRestaurantId, setActiveRestaurantId] = useState(() => {
    return localStorage.getItem('zomathon_res_id') || null;
  });

  useEffect(() => {
    localStorage.setItem('zomathon_cart', JSON.stringify(cart));
    if (activeRestaurantId) {
      localStorage.setItem('zomathon_res_id', activeRestaurantId);
    } else {
      localStorage.removeItem('zomathon_res_id');
    }
  }, [cart, activeRestaurantId]);

  const addToCart = (item, resId) => {
    const stringResId = resId ? String(resId) : null;
    
    // 1. Restaurant Validation Logic
    if (activeRestaurantId && stringResId && activeRestaurantId !== stringResId) {
      const confirmClear = window.confirm(
        "You have items from another restaurant in your cart. Discard and add this instead?"
      );
      if (confirmClear) {
        setCart([{ ...item, qty: 1 }]);
        setActiveRestaurantId(stringResId);
      }
      return;
    }

    if (!activeRestaurantId && stringResId) setActiveRestaurantId(stringResId);

    setCart((prev) => {
      // FIX: Force both IDs to String for comparison
      const existing = prev.find((i) => String(i.item_id) === String(item.item_id));
      if (existing) {
        return prev.map((i) =>
          String(i.item_id) === String(item.item_id) ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      // FIX: Force ID to String
      const item = prev.find(i => String(i.item_id) === String(itemId));
      if (!item) return prev;

      if (item.qty > 1) {
        return prev.map(i => String(i.item_id) === String(itemId) ? { ...i, qty: i.qty - 1 } : i);
      }
      
      const newCart = prev.filter((i) => String(i.item_id) !== String(itemId));
      if (newCart.length === 0) setActiveRestaurantId(null);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setActiveRestaurantId(null);
  };

  const totalAmount = cart.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      activeRestaurantId, 
      addToCart, 
      removeFromCart, 
      clearCart,
      totalAmount, 
      totalQty 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);