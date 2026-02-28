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
import SuccessPage from './pages/SuccessPage'; // New Success Page
import MainLayout from './components/MainLayout';

function App() {
  // REMOVED: local cart state. We now use CartContext globally.

  return (
    <Routes>
      {/* 1. Routes inside MainLayout (Shared Header/BottomNav) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/dining" element={<DiningPage />} />
        <Route path="/order" element={<OrderPage />} />
        
        {/* Catch-all Route inside layout */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 2. Full-screen Routes (No Header/BottomNav) */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/success" element={<SuccessPage />} />
    </Routes>
  );
}

export default App;