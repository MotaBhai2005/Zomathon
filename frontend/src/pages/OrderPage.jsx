import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const OrderPage = () => {
  const { cart, totalAmount, addToCart } = useCart();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if the cart has items
    if (cart.length > 0) {
      setLoading(true);
      // Trigger 64D similarity based on the last item added to the cart
      const lastItem = cart[cart.length - 1];

      fetch(`http://localhost:8000/recommend/${lastItem.item_id}`)
        .then(res => {
          if (!res.ok) throw new Error('Backend Connection Refused');
          return res.json();
        })
        .then(data => {
          setRecs(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("AI Engine Error:", err);
          setLoading(false);
        });
    }
  }, [cart.length]); // Re-run when the number of items in cart changes

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-10 text-center">
        <div className="text-6xl mb-4 opacity-20">🛒</div>
        <h2 className="text-xl font-black text-gray-300">Your cart is empty</h2>
        <p className="text-xs text-gray-400 mt-2">Add some items from Punjab Grill to see AI recommendations!</p>
      </div>
    );
  }

  return (
    <div className="pt-16 p-4 pb-44 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-black mb-6 tracking-tight">My Cart</h2>

      {/* 1. Active Cart Items */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-8">
        {cart.map(item => (
          <div key={item.item_id} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800">{item.name}</span>
              <span className="text-[10px] text-gray-400 font-medium">Quantity: {item.qty}</span>
            </div>
            <span className="text-sm font-black text-gray-700">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      {/* 2. CSAO Rail - Powered by 64D Embedding Model */}
      <div className="mt-10">
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Complete Your Meal</h4>
            <p className="text-[9px] text-red-400 font-bold italic">Based on your current order</p>
          </div>
          {loading && <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>

        <div className="flex overflow-x-auto space-x-4 no-scrollbar pb-4">
          <AnimatePresence>
            {recs.map((item, index) => (
              <motion.div
                key={item.item_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 w-36 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm"
              >
                <div className="h-24 bg-gray-50 rounded-xl mb-3 flex items-center justify-center text-2xl opacity-50">
                  {item.is_veg ? '🥗' : '🍗'}
                </div>
                <p className="text-[10px] font-bold text-gray-800 truncate leading-tight">{item.name}</p>
                <p className="text-[10px] text-red-500 font-black mt-1">₹{item.price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="mt-3 w-full text-[9px] border border-red-100 text-red-500 py-1.5 rounded-lg font-black uppercase hover:bg-red-50 transition-colors"
                >
                  Add +
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

  /* 3. Sticky Checkout Bar */
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50">
        <button
          onClick={() => {
            import('react-router-dom').then(({ useNavigate }) => {
              // Using window.location.href as a quick workaround since useNavigate hook violation won't work inside callback
              window.location.href = '/checkout';
            });
          }}
          className="w-full bg-[#E23744] text-white py-4 rounded-2xl font-black flex justify-between px-8 shadow-2xl shadow-red-200 active:scale-[0.98] transition-transform"
        >
          <span className="text-sm tracking-tight uppercase">Place Order</span>
          <span className="text-sm">₹{totalAmount + 40} <span className="ml-1 opacity-60">→</span></span>
        </button>
      </div>
    </div>
  );
};

export default OrderPage;