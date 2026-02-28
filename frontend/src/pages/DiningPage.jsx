import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ChevronDown, Filter, Star } from 'lucide-react';

const DiningPage = () => {
    // Mock data for Dining Out
    const collections = [
        { title: 'New in Town', places: 12, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80' },
        { title: 'Romantic Dining', places: 8, image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=300&q=80' },
        { title: 'Great Buffets', places: 15, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80' },
    ];

    const diningRestaurants = [
        {
            id: 1,
            name: 'Olive Bar & Kitchen',
            rating: 4.8,
            cuisine: 'Italian, Mediterranean',
            cost: '₹2,500 for two',
            location: 'Khar West',
            image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
            offer: 'Flat 15% off on walk-in',
        },
        {
            id: 2,
            name: 'The Bombay Canteen',
            rating: 4.9,
            cuisine: 'Modern Indian, Bar',
            cost: '₹2,000 for two',
            location: 'Lower Parel',
            image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
            offer: 'Free Dessert per couple',
        },
    ];

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* 1. Header (Reusing similar style to HomePage) */}
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

            {/* 2. Search & Filters */}
            <div className="px-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center space-x-3 shadow-sm mb-4">
                    <Search size={18} className="text-red-500" />
                    <input
                        className="bg-transparent outline-none text-sm w-full font-medium"
                        placeholder="Search dining restaurants..."
                    />
                </div>

                <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                    <button className="flex-shrink-0 flex items-center bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-sm active:scale-95 transition-transform">
                        <Filter size={14} className="mr-1" /> Filters
                    </button>
                    <button className="flex-shrink-0 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-sm active:scale-95 transition-transform">
                        Rating: 4.0+
                    </button>
                    <button className="flex-shrink-0 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-sm active:scale-95 transition-transform">
                        Outdoor Seating
                    </button>
                    <button className="flex-shrink-0 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-sm active:scale-95 transition-transform">
                        Serves Alcohol
                    </button>
                </div>
            </div>

            {/* 3. Handpicked Collections */}
            <div className="px-4 mb-8">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Curated Collections</h3>
                        <p className="text-[10px] text-gray-500 mt-1">Explore curated lists of top restaurants</p>
                    </div>
                    <span className="text-xs text-red-500 font-bold">See all</span>
                </div>

                <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4">
                    {collections.map((col, index) => (
                        <div key={index} className="flex-shrink-0 relative w-40 h-52 rounded-2xl overflow-hidden shadow-md">
                            <img src={col.image} alt={col.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                <h4 className="font-bold text-sm leading-tight mb-1">{col.title}</h4>
                                <p className="text-[10px] font-medium opacity-90">{col.places} Places ▸</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Must-Visit Restaurants */}
            <div className="px-4">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Trending Dining Restaurants</h3>

                {diningRestaurants.map((restaurant) => (
                    <div key={restaurant.id} className="block rounded-3xl border border-gray-100 overflow-hidden shadow-sm mb-6 bg-white">
                        <div className="h-48 relative">
                            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                            {/* Offer Badge badge */}
                            <div className="absolute bottom-3 left-0 bg-blue-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-r-lg shadow-md">
                                {restaurant.offer}
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-xl font-black text-gray-800 tracking-tight">{restaurant.name}</h4>
                                <div className="bg-green-700 text-white px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm shrink-0 ml-2">
                                    <span className="text-xs font-bold">{restaurant.rating}</span>
                                    <Star size={10} className="fill-white" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 font-medium">{restaurant.location}</p>
                            <div className="mt-2 text-xs text-gray-400 font-medium">
                                {restaurant.cuisine} • {restaurant.cost}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiningPage;
