import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link import fixed
import MenuItem from '../components/MenuItem';
import AddOnDrawer from '../components/AddOnDrawer';
import { useCart } from '../context/CartContext';
import { Search, ChevronDown } from 'lucide-react';

const RestaurantPage = () => {
  const { id } = useParams(); 
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { cart, totalAmount } = useCart();

  useEffect(() => {
    // Fetching from the FastAPI backend
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

  if (loading) return <div className="p-20 text-center font-bold text-gray-400">Loading Menu...</div>;

  return (
    <div className="bg-white min-h-screen pb-40">
      <div className="p-4 sticky top-0 bg-white z-40 border-b flex justify-between items-center">
        <h2 className="font-black text-xl italic text-red-500">zomato</h2>
        <Search size={20} className="text-gray-400" />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-4">Recommended</h3>
        {menuItems.map(item => (
          <MenuItem key={item.item_id} item={item} onAdd={() => handleOpenDrawer(item)} />
        ))}
      </div>

      <AddOnDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} item={selectedItem} />

      {/* Sticky Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-24 left-4 right-4 bg-[#E23744] text-white p-3 rounded-xl flex justify-between items-center shadow-2xl z-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase">{cart.length} ITEM</span>
            <span className="text-sm font-black">₹{totalAmount}</span>
          </div>
          <Link to="/order" className="flex items-center font-bold text-sm">
            View Cart <ChevronDown className="-rotate-90 ml-1" size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RestaurantPage;