import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Loading = () => {
  const navigate = useNavigate();
  const { search } = useLocation(); // Get URL query string
  const query = new URLSearchParams(search);
  const nextUrl = query.get('next'); // Reads 'myorders'
  const orderId = query.get('orderId');
  const success = query.get('success');

  const { backendUrl, setCartItems } = useContext(AppContext);

  useEffect(() => {
    const finalizeStripePayment = async () => {
      // If returning from a successful checkout, tell the backend to update order status
      if (success === 'true' && orderId) {
        try {
          const response = await axios.post(
            `${backendUrl}/api/order/verifyStripe`, 
            { orderId, success },
            { withCredentials: true }
          );
          
          if (response.data.success) {
            // Empty the shopping cart
            setCartItems({});
            await axios.post(`${backendUrl}/api/cart/update`, { cartItems: {} }, { withCredentials: true });
          }
        } catch (error) {
          console.error("Payment verification failed:", error);
        }
      }

      // Hold loader on screen for exactly 3 seconds before navigating
      setTimeout(() => {
        if (nextUrl) {
          navigate(`/${nextUrl}`);
        } else {
          navigate('/');
        }
      }, 3000);
    };

    finalizeStripePayment();
  }, [nextUrl, orderId, success]);

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center gap-4 bg-white">
      {/* Animated Spinner Ring */}
      <div className="w-14 h-14 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
      
      {/* Processing Messages */}
      <div className="text-center">
        <p className="text-gray-700 font-semibold text-base tracking-wide animate-pulse">
          Processing Payment Securely...
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Please do not refresh or close this window.
        </p>
      </div>
    </div>
  );
};

export default Loading;