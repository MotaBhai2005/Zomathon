import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, CreditCard, Wallet, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { totalAmount, cart } = useCart();
    const [tip, setTip] = useState(20);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [isPaying, setIsPaying] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Delivery + Taxes mock calculation
    const deliveryFee = 40;
    const taxes = Math.round(totalAmount * 0.05);
    const finalTotal = totalAmount + deliveryFee + taxes + tip;

    const handlePayment = () => {
        setIsPaying(true);
        // Simulate payment processing delay
        setTimeout(() => {
            setIsPaying(false);
            setPaymentSuccess(true);
        }, 2000);
    };

    if (paymentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-green-50 px-4 text-center">
                <CheckCircle size={80} className="text-green-500 mb-6 drop-shadow-md" />
                <h1 className="text-2xl font-black text-gray-800 mb-2">Order Confirmed!</h1>
                <p className="text-gray-500 mb-8 max-w-xs text-sm">
                    Your food is being prepared by the restaurant. The delivery partner is on the way.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-green-700 transition-colors w-full max-w-xs"
                >
                    Track Order
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-32">
            {/* Header */}
            <div className="sticky top-0 bg-white z-50 px-4 pt-4 pb-3 border-b border-gray-100 flex items-center shadow-sm">
                <button onClick={() => navigate(-1)} className="p-1 mr-3 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={20} className="text-gray-800" />
                </button>
                <h1 className="font-black text-lg text-gray-800 tracking-tight">Checkout</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Adress Section */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start">
                        <div className="bg-red-50 p-2 rounded-lg mr-3">
                            <MapPin size={20} className="text-red-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-sm text-gray-800 mb-1">Delivering to Home</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                A-101, Highland Park, Patia, Bhubaneswar, Odisha, 751024
                            </p>
                        </div>
                        <button className="text-red-500 text-xs font-bold pl-2 cursor-pointer uppercase tracking-tight">Change</button>
                    </div>
                </div>

                {/* Tip Section */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-sm text-gray-800 mb-3">Tip your delivery partner</h3>
                    <p className="text-[10px] text-gray-400 mb-4">100% of the tip goes to the partner.</p>
                    <div className="flex space-x-3">
                        {[10, 20, 30, 50].map((amount) => (
                            <button
                                key={amount}
                                onClick={() => setTip(amount)}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${tip === amount
                                        ? 'border-red-500 bg-red-50 text-red-600'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                ₹{amount}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bill Details */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-sm text-gray-800 mb-4">Bill Details</h3>
                    <div className="space-y-3 text-xs text-gray-600 border-b border-gray-100 pb-4 mb-4">
                        <div className="flex justify-between">
                            <span>Item Total ({cart.reduce((a, c) => a + c.qty, 0)} items)</span>
                            <span className="font-medium">₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span className="font-medium text-green-600">₹{deliveryFee}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes & Charges</span>
                            <span className="font-medium">₹{taxes}</span>
                        </div>
                        {tip > 0 && (
                            <div className="flex justify-between text-gray-500">
                                <span>Delivery Partner Tip</span>
                                <span>₹{tip}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center font-black text-gray-800 text-lg">
                        <span>To Pay</span>
                        <span>₹{finalTotal}</span>
                    </div>
                </div>

                {/* Payment Methods */}
                <h3 className="font-bold text-sm text-gray-800 px-1 pt-2">Pay via</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    <button
                        onClick={() => setPaymentMethod('upi')}
                        className="w-full flex items-center p-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <div className={`p-2 rounded-lg mr-3 ${paymentMethod === 'upi' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                            <Smartphone size={20} />
                        </div>
                        <div className="flex-1 text-left">
                            <span className="font-bold text-sm text-gray-800 block">UPI</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">Google Pay, PhonePe, Paytm</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-green-500' : 'border-gray-300'}`}>
                            {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                        </div>
                    </button>

                    <button
                        onClick={() => setPaymentMethod('card')}
                        className="w-full flex items-center p-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <div className={`p-2 rounded-lg mr-3 ${paymentMethod === 'card' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                            <CreditCard size={20} />
                        </div>
                        <div className="flex-1 text-left">
                            <span className="font-bold text-sm text-gray-800 block">Credit/Debit Card</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-green-500' : 'border-gray-300'}`}>
                            {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                        </div>
                    </button>
                </div>
            </div>

            {/* Floating Pay Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-50">
                <button
                    onClick={handlePayment}
                    disabled={isPaying}
                    className="w-full bg-[#E23744] overflow-hidden relative text-white py-4 rounded-2xl font-black flex justify-center items-center shadow-lg shadow-red-200 active:scale-[0.98] transition-transform disabled:opacity-80"
                >
                    {isPaying ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm tracking-widest uppercase">Processing</span>
                        </div>
                    ) : (
                        <div className="relative z-10 w-full flex justify-between px-8">
                            <span className="text-sm tracking-tight uppercase">Pay ₹{finalTotal}</span>
                            <span className="text-sm">Swipe to pay <span className="ml-1 opacity-60">→</span></span>
                        </div>
                    )}
                    {!isPaying && (
                        <div className="absolute top-0 left-0 w-1/4 h-full bg-white/20 -skew-x-12 translate-x-10"></div>
                    )}
                </button>
            </div>

        </div>
    );
};

export default CheckoutPage;
