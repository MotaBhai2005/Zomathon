import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Sticky Header */}
            <Header />

            {/* Main Content Area */}
            <main className="flex-1 mt-16 pb-24">
                <Outlet />
            </main>

            <BottomNav />
        </div>
    );
}

export default MainLayout;
