import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import ProductDetails from './pages/ProductDetails';
import { AppContext } from './context/AppContext';
import Login from './components/Login'; 
import Cart from './pages/Cart';
import Myorders from './pages/Myorders';
import Footer from './components/Footer';   //  import Footer
import Loading from './components/Loading';

const App = () => {
  const { showUserLogin, getCartProducts, getCartAmount } = useContext(AppContext);

  // ✅ Inline Checkout component
  const Checkout = () => {
    const cartProducts = getCartProducts();
    const cartTotal = getCartAmount();

    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10 min-h-screen bg-white">
        <h1 className="text-2xl font-bold mb-6 text-green-600">Checkout</h1>

        {cartProducts.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartProducts.map((item) => (
              <div key={item._id} className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-14 h-14 object-contain border rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">Quantity: {item.qty}</p>
                  </div>
                </div>
                <p className="font-semibold text-green-600">
                  ${item.offerPrice * item.qty}
                </p>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <p className="text-lg font-bold">Total:</p>
              <p className="text-lg font-bold text-green-600">${cartTotal}</p>
            </div>

            <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
              Place Order
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {showUserLogin && <Login />}
      <Navbar />

      {/* Main content grows to fill space */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/myorders" element={<Myorders />} />
          <Route path="/checkout" element={<Checkout />} /> {/* new route */}
          <Route path="/loader" element={<Loading />} />
        </Routes>
      </div>

      {/* ✅ Footer always visible */}
      <Footer />
    </div>
  );
};

export default App;
