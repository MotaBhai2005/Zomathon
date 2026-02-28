import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-full px-4 text-center mt-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Page Not Found</h1>
            <p className="text-gray-500 mb-8 max-w-sm">
                We can't seem to find the page you're looking for. It might have been removed or the link is incorrect.
            </p>
            <button
                onClick={() => navigate('/')}
                className="bg-red-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
            >
                Go back to Home
            </button>
        </div>
    );
}

export default NotFoundPage;
