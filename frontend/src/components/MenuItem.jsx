import React from 'react';
import { useCart } from '../context/CartContext';

const MenuItem = ({ item, restaurant }) => {
  const { addToCart, removeFromCart, cart } = useCart();
  const cartItem = cart.find(i => i.item_id === item.item_id);

  return (
    <div className="flex justify-between items-center py-5 border-b border-gray-100 bg-white">
      <div className="flex-1 pr-4">
        {/* Veg/Non-Veg Indicator */}
        <div className={`w-3 h-3 border ${item.is_veg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center p-[2px] mb-1`}>
          <div className={`w-full h-full rounded-full ${item.is_veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
        </div>
        
        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
        <p className="text-sm font-semibold text-gray-700">₹{item.price}</p>
        
        {/* Description from your items.csv */}
        <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="relative">
        {/* Placeholder for Item Image */}
        <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          {/* You can add item.image_url here if available in your CSV */}
        </div>

        {/* Dynamic Add/Counter Button */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-md rounded-lg overflow-hidden">
          {!cartItem ? (
            <button 
              onClick={() => addToCart(item, restaurant)}
              className="bg-white border border-red-500 text-red-500 font-bold px-7 py-1.5 text-[10px] uppercase transition-colors active:bg-red-50"
            >
              Add
            </button>
          ) : (
            <div className="bg-red-500 text-white flex items-center justify-between min-w-[85px] px-2 py-1.5">
              <button 
                onClick={() => removeFromCart(item.item_id)}
                className="font-bold text-sm px-1"
              >
                −
              </button>
              <span className="text-xs font-black">{cartItem.qty}</span>
              <button 
                onClick={() => addToCart(item, restaurant)}
                className="font-bold text-sm px-1"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;