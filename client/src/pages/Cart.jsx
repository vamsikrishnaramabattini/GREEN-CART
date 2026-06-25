import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const { cartItems, products, addToCart, removeFromCart, address, syncAddressWithDatabase, backendUrl, setCartItems } = useContext(AppContext);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [localAddress, setLocalAddress] = useState("");
  
  // State to track Payment Method Dropdown
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      setLocalAddress(address);
    }
  }, [address]);

  // Map cartItems (id → qty) into product objects formatted matching your order model schema requirements
  const cartProducts = Object.keys(cartItems).map((id) => {
    const product = products.find((p) => String(p._id) === String(id));
    return product ? { ...product, qty: cartItems[id] } : null;
  }).filter(Boolean);

  const subtotal = cartProducts.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.02;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  const handleSaveAddressClick = async () => {
    await syncAddressWithDatabase(localAddress);
    setShowAddressForm(false);
  };

  // ACTION HANDLER ON CHECKOUT CLICK (Handles both COD and Stripe Payment)
  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please add a delivery address before placing an order.");
      return;
    }
    if (cartProducts.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Format item payload array to match structural schema expectations: { product: id, quantity: qty }
    const orderItems = cartProducts.map(item => ({
      product: item._id,
      quantity: item.qty
    }));

    if (paymentMethod === "Online") {
      // ==========================================
      // STRIPE ONLINE PAYMENT PROCESSING
      // ==========================================
      try {
        // Hit the stripe deployment controller route with credentials
        const response = await axios.post(
          `${backendUrl}/api/order/stripe`, 
          { items: orderItems, address: address },
          { withCredentials: true }
        );

        if (response.data.success) {
          const { session_url } = response.data;
          // Redirect the browser window context directly over to Stripe's secure page host
          window.location.replace(session_url);
        } else {
          alert(response.data.message || "Failed to initialize Stripe checkout.");
        }
      } catch (error) {
        console.error("Stripe Checkout Error:", error);
        alert("An error occurred while launching online checkout process.");
      }

    } else {
      // ==========================================
      // COD ORDER PROCESSING
      // ==========================================
      try {
        const response = await axios.post(
          `${backendUrl}/api/order/cod`, 
          { items: orderItems, address: address },
          { withCredentials: true }
        );

        if (response.data.success) {
          alert("🎉 Order Placed Successfully via Cash On Delivery!");
          
          // Clear app cart layout state values
          setCartItems({});
          await axios.post(`${backendUrl}/api/cart/update`, { cartItems: {} }, { withCredentials: true });
          
          // Clear window views context directly over onto customer orders panel hub
          navigate("/MyOrders");
        } else {
          alert(response.data.message || "Failed to place order.");
        }
      } catch (error) {
        console.error("COD Order error:", error);
        alert("An error occurred while processing your order request.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      {/* Left: Cart Items */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart <span className="text-sm text-green-600">{cartProducts.length} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartProducts.length === 0 ? (
          <p className="text-gray-400 text-center py-20">Your cart is empty.</p>
        ) : (
          cartProducts.map((product) => (
            <div key={product._id} className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base font-medium pt-3">
              <div className="flex items-center md:gap-6 gap-3">
                <div className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                  <img className="max-w-full h-full object-cover" src={product.image || product.img} alt={product.name} />
                </div>
                <div>
                  <p className="hidden md:block font-semibold">{product.name}</p>
                  <div className="font-normal text-gray-500/70">
                    <p>Size: <span>{product.size || "N/A"}</span></p>
                    <div className="flex items-center">
                      <p>Qty:</p>
                      <select
                        value={product.qty}
                        onChange={(e) => addToCart(product._id, Number(e.target.value))}
                        className="outline-none ml-2"
                      >
                        {Array(5).fill("").map((_, index) => (
                          <option key={index} value={index + 1}>{index + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center">${(product.price * product.qty).toFixed(2)}</p>
              <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto text-red-500">
                ✕
              </button>
            </div>
          ))
        )}

        <button onClick={() => navigate('/products')} className="group flex items-center mt-8 gap-2 text-green-600 font-medium cursor-pointer">
          ← Continue Shopping
        </button>
      </div>

      {/* Right: Order Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl font-medium text-left">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase text-left">Delivery Address</p>
          {address ? (
            <div className="flex justify-between items-start mt-2">
              <p className="text-gray-700 break-words max-w-[200px] text-left">{address}</p>
              <button onClick={() => setShowAddressForm(true)} className="text-green-600 hover:underline cursor-pointer">
                Change
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-start mt-2">
              <p className="text-gray-500 text-left">No address found</p>
              <button onClick={() => setShowAddressForm(true)} className="text-green-600 hover:underline cursor-pointer">
                Add Address
              </button>
            </div>
          )}

          {showAddressForm && (
            <div className="mt-4 text-left">
              <textarea
                value={localAddress}
                onChange={(e) => setLocalAddress(e.target.value)}
                placeholder="Enter your delivery address..."
                className="w-full border border-gray-300 rounded p-2 text-sm outline-none bg-white min-h-[80px]"
              />
              <button
                onClick={handleSaveAddressClick}
                className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer font-medium text-sm"
              >
                Save Address
              </button>
            </div>
          )}

          <p className="text-sm font-medium uppercase mt-6 text-left">Payment Method</p>
          <select 
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none cursor-pointer"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment (Stripe)</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2 text-left">
          <p className="flex justify-between"><span>Price</span><span>${subtotal.toFixed(2)}</span></p>
          <p className="flex justify-between"><span>Shipping Fee</span><span className="text-green-600">Free</span></p>
          <p className="flex justify-between"><span>Tax (2%)</span><span>${tax.toFixed(2)}</span></p>
          <p className="flex justify-between text-lg font-medium mt-3 text-gray-800">
            <span>Total Amount:</span><span>${total.toFixed(2)}</span>
          </p>
        </div>

        {/* Change text dynamically based on selection option choice */}
        <button 
          onClick={handlePlaceOrder}
          className="w-full py-3 mt-6 bg-green-600 text-white font-medium hover:bg-green-700 transition cursor-pointer"
        >
          {paymentMethod === "Online" ? "Pay Online with Stripe" : "Place COD Order"}
        </button>
      </div>
    </div>
  );
};

export default Cart;