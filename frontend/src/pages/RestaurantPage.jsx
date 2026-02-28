import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MenuItem from '../components/MenuItem';
import AddOnDrawer from '../components/AddOnDrawer';
import { useCart } from '../context/CartContext';
import { Search, ChevronRight } from 'lucide-react';

const RestaurantPage = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Destructure from your provided CartContext
  const { cart, totalAmount, addToCart } = useCart();

  // Calculate total quantity for the badge
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    fetch(`http://localhost:8000/restaurant/${id}/menu`)
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(err => console.error("Menu fetch failed:", err));
  }, [id]);

  const handleOpenDrawer = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen pb-40">
        <div className="p-4 sticky top-0 bg-white z-40 border-b flex justify-between items-center">
          <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="p-4">
          <div className="h-6 w-32 bg-gray-200 rounded-md mb-6 animate-pulse"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-start mb-8 animate-pulse">
              <div className="flex-1 pr-4">
                <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded-md w-full mb-1"></div>
              </div>
              <div className="w-32 h-32 rounded-2xl bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-40">
      <div className="p-4 sticky top-0 bg-white z-40 border-b flex justify-between items-center">
        <h2 className="font-black text-xl italic text-red-500">zomato</h2>
        <Search size={20} className="text-gray-400" />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-4">Recommended</h3>
        {menuItems.map(item => (
          <MenuItem 
            key={item.item_id} 
            item={item} 
            onAdd={() => handleOpenDrawer(item)} 
          />
        ))}
      </div>

      <AddOnDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        item={selectedItem}
        onConfirm={(item) => {
            // Pass the item and the restaurant ID to context
            addToCart(item, id); 
            setDrawerOpen(false);
        }}
      />

      {/* Sticky Cart Bar - Updates based on totalQty and totalAmount from Context */}
      {totalQty > 0 && (
        <div className="fixed bottom-24 left-4 right-4 bg-[#E23744] text-white p-4 rounded-2xl flex justify-between items-center shadow-2xl z-50 animate-slide-up">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-90">
                {totalQty} ITEM{totalQty > 1 ? 'S' : ''} ADDED
            </span>
            <span className="text-lg font-black tracking-tighter">₹{totalAmount}</span>
          </div>
          <Link to="/order" className="flex items-center font-black text-sm uppercase tracking-tighter">
            Next <ChevronRight size={18} className="ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RestaurantPage;