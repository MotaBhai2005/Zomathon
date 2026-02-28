import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Clear the cart immediately when the order is "placed"
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {/* Animated Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-8"
      >
        <CheckCircle size={80} className="text-green-500" strokeWidth={1.5} />
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter mb-2">
          ORDER PLACED!
        </h1>
        <p className="text-gray-500 font-medium mb-8">
          Your food from the dataset is being prepared. <br />
          Estimated arrival: <span className="text-gray-800 font-bold">25-35 mins</span>
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="w-full max-w-xs space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-full bg-[#E23744] text-white py-4 rounded-2xl font-black flex items-center justify-center shadow-xl shadow-red-100 active:scale-95 transition-transform"
        >
          <Home size={20} className="mr-2" /> Back to Home
        </button>
        
        <button
          onClick={() => navigate('/dining')}
          className="w-full bg-gray-50 text-gray-600 py-4 rounded-2xl font-black flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-transform"
        >
          <ShoppingBag size={20} className="mr-2" /> Track Order
        </button>
      </motion.div>

      {/* Fun Dataset Note */}
      <p className="fixed bottom-10 text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">
        Powered by Zomathon
      </p>
    </div>
  );
};

export default SuccessPage;