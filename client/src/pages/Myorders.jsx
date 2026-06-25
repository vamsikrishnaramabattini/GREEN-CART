import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const MyOrders = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from database on mount
  const loadOrderHistory = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/user`);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error loading order log details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token || localStorage.getItem("token")) {
      loadOrderHistory();
    }
  }, [token]);

  if (loading) {
    return <p className="text-gray-500 text-center py-16">Loading your order history...</p>;
  }

  return (
    <div className="mt-16 pb-16 px-6 md:px-16 lg:px-24">
      <div className="flex flex-col items-start mb-8">
        <p className="text-2xl font-medium uppercase text-green-600">My Orders</p>
        <div className="w-16 h-0.5 bg-green-600 rounded-full"></div>
      </div>

      {(!orders || orders.length === 0) ? (
        <p className="text-gray-500 text-left">You have no orders yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 rounded-lg p-5 shadow-sm bg-white text-left"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">OrderId:</span> {order._id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Payment:</span> {order.paymentType}
                </p>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item, index) => {
                  // Guard clause block in case reference product details don't exist
                  if (!item.product) {
                    return (
                      <div key={index} className="text-sm text-gray-400 py-2 border-b border-gray-100">
                        Item details unavailable (Product no longer exists)
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item._id || index}
                      className="flex justify-between items-center text-sm border-b border-gray-200 pb-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={Array.isArray(item.product.image) ? item.product.image[0] : item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 object-contain border rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Category: {item.product.category || "N/A"}</p>
                          <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-xs text-green-600">Status: {order.status}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-600">
                        ${((item.product.offerPrice !== undefined ? item.product.offerPrice : item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-3">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(order.createdAt || order.date || Date.now()).toLocaleDateString()}
                </p>
                <p className="text-sm font-bold text-green-600">
                  Total: ${order.amount ? order.amount.toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;