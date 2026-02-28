import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import OrderPage from './pages/OrderPage';
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchPage from './pages/SearchPage';
import MainLayout from './components/MainLayout';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      // Check if item already exists to increment quantity
      const existingItem = prevCart.find((i) => i.item_id === item.item_id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.item_id === item.item_id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  return (
    <Routes>
      {/* Pass cart data to MainLayout to show the bottom "View Cart" bar */}
      <Route element={<MainLayout cart={cart} />}>
        <Route path="/" element={<HomePage />} />
        {/* Pass addToCart to pages that have "Add" buttons */}
        <Route path="/restaurant/:id" element={<RestaurantPage addToCart={addToCart} />} />
        <Route path="/category/:categoryName" element={<CategoryPage addToCart={addToCart} />} />
        <Route path="/search" element={<SearchPage addToCart={addToCart} />} />
        <Route path="/order" element={<OrderPage cart={cart} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;