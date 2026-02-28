import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Clock, ChevronRight } from 'lucide-react';

const HomePage = ({ location }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Map of category names to Emojis (Fallback to 🍽️ if not found)
  const iconMap = {
    "Biryani": "🍲", "Pizza": "🍕", "Burger": "🍔", "Drink": "🥤", 
    "Dessert": "🍨", "Cake": "🍰", "Thali": "🍱", "Main": "🍛", 
    "Street Food": "🍢", "Chinese": "🥢", "South Indian": "🥞"
  };

  useEffect(() => {
    setLoading(true);
    // 1. Fetch Categories available in CSV
    const fetchCats = fetch('http://localhost:8000/categories/available').then(res => res.json());
    // 2. Fetch Restaurants in current location
    const fetchRes = fetch(`http://localhost:8000/restaurants/location/${location}`).then(res => res.json());

    Promise.all([fetchCats, fetchRes]).then(([catData, resData]) => {
      setCategories(catData);
      setRestaurants(resData);
      setLoading(false);
    });
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/category/${searchQuery.toLowerCase()}`);
  };

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      {/* 1. Search Bar */}
      <div className="px-4 mb-8 mt-4">
        <form onSubmit={handleSearch} className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center space-x-3 shadow-sm focus-within:ring-2 focus-within:ring-red-500/10 transition-all">
          <Search size={18} className="text-red-500" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-sm w-full font-bold text-gray-700" 
            placeholder={`Search Street Food or Biryani in ${location}...`} 
          />
        </form>
      </div>

      {/* 2. Dynamic Mindful Categories (From CSV) */}
      <div className="px-4 mb-10">
        <h3 className="font-black text-gray-400 mb-5 text-[10px] uppercase tracking-widest">Inspiration for your order</h3>
        <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="flex-shrink-0 text-center group active:scale-95 transition-all">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl shadow-sm group-hover:bg-white group-hover:shadow-md transition-all">
                {iconMap[cat] || "🍽️"}
              </div>
              <p className="text-[10px] font-black text-gray-500 mt-3">{cat}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Restaurant Listing */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-gray-800 text-lg tracking-tight">
            Explore restaurants in <span className="text-red-500">{location}</span>
          </h3>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => <div key={i} className="h-64 bg-gray-50 rounded-3xl animate-pulse" />)}
          </div>
        ) : restaurants.length > 0 ? (
          restaurants.map((res) => (
            <Link 
              key={res.restaurant_id} 
              to={`/restaurant/${res.restaurant_id}`} 
              className="block rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm active:scale-[0.98] transition-all mb-8 bg-white"
            >
              {/* Card Image area */}
              <div className="h-56 bg-gray-100 relative">
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                  30-35 MINS
                </div>
                <div className="w-full h-full bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-5 text-white">
                  <h4 className="text-xl font-black tracking-tight">{res.restaurant_name}</h4>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{res.cuisine_type}</p>
                </div>
                <div className="absolute bottom-4 right-5 bg-green-700 text-white px-2 py-1 rounded-lg flex items-center space-x-1 font-black text-xs">
                  <span>4.1</span> <Star size={10} fill="white" />
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                  <Clock size={12} className="mr-1 text-gray-300" />
                  FREE DELIVERY ON ORDERS ABOVE ₹199
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No restaurants found in {location}</p>
            <p className="text-[10px] text-gray-300 mt-2 uppercase">Try changing your location above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;