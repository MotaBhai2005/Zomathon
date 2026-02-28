import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const HomePage = () => {
  // Expanded categories based on your items.csv data
  const categories = [
    { name: 'Biryani', icon: '🍲' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Mughlai', icon: '🍛' },
    { name: 'Dosa', icon: '🥞' },
    { name: 'Paneer', icon: '🧀' },
    { name: 'Chicken', icon: '🍗' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Thali', icon: '🍱' },
    { name: 'Cakes', icon: '🍰' },
    { name: 'Dessert', icon: '🍨' },
    { name: 'Drinks', icon: '🥤' },
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 1. Location Header - Bhubaneswar Context */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center space-x-2">
          <MapPin size={20} className="text-red-500 fill-red-500" />
          <div className="flex flex-col text-left">
            <div className="flex items-center">
              <span className="text-xs font-black uppercase tracking-tight">Home</span>
              <ChevronDown size={14} className="ml-1 text-gray-400" />
            </div>
            <span className="text-[10px] text-gray-500 truncate w-40">Bhubaneswar, Odisha, India</span>
          </div>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="px-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center space-x-3 shadow-sm">
          <Search size={18} className="text-red-500" />
          <input 
            className="bg-transparent outline-none text-sm w-full font-medium" 
            placeholder="Search for 'Biryani', 'Mughlai' or 'Cakes'..." 
          />
        </div>
      </div>

      {/* 3. Mindful Categories - Now Dynamic & Responsive */}
      <div className="px-4">
        <h3 className="font-bold text-gray-800 mb-4 text-[11px] uppercase tracking-[0.15em] opacity-60">What's on your mind?</h3>
        <div className="flex space-x-6 overflow-x-auto no-scrollbar mb-10 pb-2">
          {categories.map(c => (
            <Link 
              key={c.name} 
              to={`/category/${c.name}`} 
              className="flex-shrink-0 text-center group active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl shadow-sm">
                {c.icon}
              </div>
              <p className="text-[10px] font-bold text-gray-600 mt-2">{c.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Top Restaurants Section */}
      <div className="px-4">
        <h3 className="font-bold text-gray-800 mb-4 text-[11px] uppercase tracking-[0.15em] opacity-60">Top Restaurants</h3>
        
        {/* Restaurant Card linking to ID 6317637 (Barbeque Nation from your CSV) */}
        <Link 
          to="/restaurant/6317637" 
          className="block rounded-3xl border border-gray-100 overflow-hidden shadow-sm active:scale-[0.98] transition-transform mb-6"
        >
          <div className="h-48 bg-gray-100 relative">
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter">
              35-40 mins • 5 km
            </div>
            <div className="w-full h-full bg-gradient-to-b from-transparent to-black/20"></div>
          </div>
          <div className="p-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-gray-800 tracking-tight">Barbeque Nation</span>
              <div className="bg-green-700 text-white px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                <span className="text-xs font-bold">4.2</span>
                <span className="text-[10px]">★</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight">
              Mughlai • North Indian • ₹400 for two
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;