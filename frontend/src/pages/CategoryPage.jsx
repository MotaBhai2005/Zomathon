import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Initialized as empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/category/${categoryName}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        // Double-check that data is an array to prevent .map() crash
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });
  }, [categoryName]);

  return (
    <div className="bg-white min-h-screen p-4 pt-6 pb-20">
      <div className="flex items-center mb-6 sticky top-0 bg-white py-2 z-10">
        <button onClick={() => navigate(-1)} className="p-1"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-black ml-2 tracking-tight">{categoryName}</h2>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-gray-200 animate-pulse uppercase tracking-widest">Searching Dataset...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <Link 
                key={`${item.item_id}-${idx}`} 
                to={`/restaurant/${item.restaurant_id}`}
                className="flex border border-gray-100 rounded-2xl overflow-hidden p-3 space-x-4 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                  {item.is_veg ? '🥗' : '🍗'}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm text-gray-800 line-clamp-1">{item.name}</p>
                  <p className="text-[10px] text-red-500 font-bold flex items-center mt-1">
                    {item.restaurant_name} • 4.2 <Star size={8} className="ml-1 fill-red-500" />
                  </p>
                  <p className="text-xs font-black mt-2 text-gray-700">₹{item.price}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No results found in CSV</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;