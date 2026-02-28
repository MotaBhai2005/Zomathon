import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft, Clock, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const recentSearches = ['Biryani', 'Pizza', 'KFC', 'Burger King'];
    const trendingSearches = [
        { name: 'KFC', label: 'Promoted' },
        { name: 'Ice Cream', label: 'Popular' },
        { name: 'Pasta', label: 'Trending' }
    ];

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Search Header */}
            <div className="sticky top-0 bg-white z-50 px-4 pt-4 pb-3 border-b border-gray-100 shadow-sm">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-700" />
                    </button>

                    <div className={`flex-1 flex items-center bg-white border ${isFocused ? 'border-red-500 shadow-md shadow-red-100' : 'border-gray-300'} rounded-xl px-3 py-2.5 transition-all duration-200`}>
                        <Search size={18} className={`${isFocused ? 'text-red-500' : 'text-gray-400'}`} />
                        <input
                            ref={inputRef}
                            type="text"
                            className="flex-1 bg-transparent border-none outline-none ml-2 text-sm text-gray-800 placeholder-gray-400"
                            placeholder="Search for restaurant, item or more"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                        {query && (
                            <button onClick={() => setQuery('')}>
                                <X size={16} className="text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4">
                {query ? (
                    // Active Search Results (Mock)
                    <div className="mt-4">
                        <h3 className="font-bold text-gray-800 mb-4 text-sm">Showing results for "{query}"</h3>

                        {/* Mock Result Items */}
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center p-3 border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4 overflow-hidden">
                                        {/* Mock image placeholder */}
                                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-800">Delicious {query} Item {i}</h4>
                                        <p className="text-xs text-gray-500 mt-1">Restaurant Name • 4.2★</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">₹200 for one</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-8 italic">End of results</p>
                    </div>
                ) : (
                    // Empty State - Recent & Trending
                    <>
                        {/* Recent Searches */}
                        <div className="mb-8 mt-2">
                            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center">
                                <Clock size={16} className="mr-2 text-gray-400" /> Recent Searches
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {recentSearches.map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => setQuery(term)}
                                        className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 active:scale-95 transition-transform"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trending */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4 text-sm flex items-center">
                                <TrendingUp size={16} className="mr-2 text-red-500" /> Trending near you
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {trendingSearches.map((trend) => (
                                    <div
                                        key={trend.name}
                                        className="border border-gray-100 rounded-xl p-3 flex flex-col justify-between h-20 active:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => setQuery(trend.name)}
                                    >
                                        <span className="font-bold text-sm text-gray-800">{trend.name}</span>
                                        <span className="text-[10px] text-red-500 font-semibold uppercase tracking-wider">{trend.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
