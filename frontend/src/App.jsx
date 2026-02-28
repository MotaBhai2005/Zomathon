import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import OrderPage from './pages/OrderPage';
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';
import DiningPage from './pages/DiningPage';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/order" element={<OrderPage />} />
        {/* REGISTER THE MISSING ROUTE HERE */}
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        {/* Search Route */}
        <Route path="/search" element={<SearchPage />} />
        {/* Dining Route */}
        <Route path="/dining" element={<DiningPage />} />
        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Routes outside of MainLayout (no Header/BottomNav) */}
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  );
}

export default App;