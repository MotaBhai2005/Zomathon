import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddOnDrawer = ({ isOpen, onClose, item }) => {
  const addOns = [
    { name: 'Pesto Paneer', price: 40 },
    { name: 'Extra Veggies', price: 40 },
    { name: 'Mushroom', price: 40 },
    { name: 'Corn', price: 40 }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60]"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] max-w-md mx-auto p-5 pb-safe"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{item?.name || 'Customize Item'}</h3>
                <p className="text-xs text-gray-500 italic">You can choose up to 4 options</p>
              </div>
              <button onClick={onClose} className="bg-gray-100 rounded-full p-1 text-gray-600">✕</button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
              <p className="text-sm font-bold border-b pb-2">Add On</p>
              {addOns.map((addon) => (
                <div key={addon.name} className="flex justify-between items-center py-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-green-600 flex items-center justify-center p-[2px]">
                      <div className="w-full h-full bg-green-600 rounded-full" />
                    </div>
                    <span className="text-sm text-gray-700">{addon.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500">₹{addon.price}</span>
                    <input type="checkbox" className="accent-red-500 h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full bg-zomato mt-6 py-3 rounded-xl text-white font-bold shadow-lg">
              Add Item • ₹{item?.price + 40 || 199}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddOnDrawer;