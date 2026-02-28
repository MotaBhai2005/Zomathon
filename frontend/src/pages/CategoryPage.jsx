import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Plus, Info } from 'lucide-react';
import { getFoodImage } from '../utils/ImageHelper';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/category/${categoryName}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });
  }, [categoryName]);

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white shadow-sm z-30 p-4 flex items-center border-b border-gray-50">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <div className="ml-3">
          <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight">{categoryName}</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{items.length} Options Near You</p>
        </div>
      </div>

      <div className="p-4 space-y-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-bold text-gray-300 uppercase text-xs tracking-widest">Searching Dataset...</p>
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <div key={item.item_id} className="flex justify-between items-start pb-10 border-b border-gray-100 last:border-0 relative group">
              
              {/* LEFT SIDE: Content */}
              <div className="flex-1 pr-4 text-left">
                <div className="flex items-start space-x-2 mb-1.5">
                  <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm mt-1 flex-shrink-0 ${item.is_veg ? 'border-green-600' : 'border-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </div>
                  <h3 className="font-black text-gray-800 text-lg leading-tight">{item.name}</h3>
                </div>
                
                {/* Indented Meta Info */}
                <div className="ml-6">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-black text-gray-900">₹{item.price}</p>
                        {item.price > 350 && (
                            <span className="text-[9px] font-black text-white bg-orange-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Bestseller</span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                        {item.description.includes('|') ? item.description.split('|').pop().trim() : item.description}
                    </p>
                    <div className="mt-4 inline-flex items-center px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none">{item.restaurant_name}</span>
                    </div>
                </div>
              </div>

              {/* RIGHT SIDE: Visuals */}
              <div className="relative flex-shrink-0">
                <div className="w-36 h-36 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
                  <img 
                    src={getFoodImage(item.name)} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Food+Image"; }}
                  />
                </div>
                <button className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border border-gray-200 text-green-600 px-8 py-2 rounded-xl font-black text-sm shadow-xl hover:bg-green-50 active:scale-95 transition-all flex items-center ring-4 ring-white">
                  ADD <Plus size={16} className="ml-1 text-green-600 font-bold" />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <Info size={48} className="mb-4" />
            <p className="font-black uppercase text-xs tracking-widest text-center">No {categoryName} found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;