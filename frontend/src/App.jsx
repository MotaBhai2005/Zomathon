import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import OrderPage from './pages/OrderPage';
import CategoryPage from './pages/CategoryPage'; 
import BottomNav from './components/BottomNav';

function App() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch all unique locations from your CSV via the Backend
  useEffect(() => {
    fetch('http://localhost:8000/locations/available')
      .then(res => res.json())
      .then(data => {
        setAvailableLocations(data);
        if (data.length > 0) setSelectedLocation(data[0]); // Default to first location
        setIsLoading(false);
      })
      .catch(err => console.error("Error fetching locations:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center px-4 z-50">
        <div className="flex items-center space-x-2 w-full text-left">
          <span className="text-red-500 text-xl">📍</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Current Location</span>
            
            {isLoading ? (
              <span className="text-xs text-gray-300 animate-pulse font-bold">Detecting Areas...</span>
            ) : (
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="text-xs font-black bg-transparent outline-none appearance-none cursor-pointer text-gray-800"
              >
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mt-16 pb-24">
        <Routes>
          {/* Only render HomePage once location is set to prevent 404s */}
          <Route path="/" element={selectedLocation && <HomePage location={selectedLocation} />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

export default App;