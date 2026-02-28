import React from 'react';

function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center px-4 z-50">
            <div className="flex items-center space-x-2 w-full text-left">
                <span className="text-red-500 text-xl">📍</span>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Home</span>
                    <span className="text-xs font-bold truncate">Bhubaneswar, Odisha...</span>
                </div>
            </div>
        </header>
    );
}

export default Header;
