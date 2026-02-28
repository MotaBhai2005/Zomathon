import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import OrderPage from './pages/OrderPage';
import CategoryPage from './pages/CategoryPage'; 
import BottomNav from './components/BottomNav';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center px-4 z-50">
        <div className="flex items-center space-x-2 w-full text-left">
          <span className="text-red-500 text-xl">📍</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Home</span>
            <span className="text-xs font-bold truncate">Bhubaneswar, Odisha...</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mt-16 pb-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/order" element={<OrderPage />} />
          {/* REGISTER THE MISSING ROUTE HERE */}
          <Route path="/category/:categoryName" element={<CategoryPage />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

export default App;