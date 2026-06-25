import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [products, setProducts] = useState([]);      
  const [cartItems, setCartItems] = useState({});    
  const [orders, setOrders] = useState([]);          
  const [search, setSearch] = useState(""); 
  const [user, setUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  
  // ADDED: Centralized Address tracking state
  const [address, setAddress] = useState("");
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  axios.defaults.withCredentials = true;

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error loading shop catalog:", error.message);
    }
  };

  // UPDATED: Now auto-extracts saved addresses from the user object
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/is-auth`);
      if (response.data.success) {
        setUser(response.data.user);
        if (response.data.user.cartItems) {
          setCartItems(response.data.user.cartItems);
        }
        // AUTO-LOAD SAVED ADDRESS STRING:
        if (response.data.user.address) {
          setAddress(response.data.user.address);
        } else {
          setAddress("");
        }
      } else {
        setUser(null);
        setAddress("");
      }
    } catch (error) {
      setUser(null);
      setAddress("");
    }
  };

  // ADDED: New handler to push fresh addresses through Axios to MongoDB
  const syncAddressWithDatabase = async (addressText) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/save-address`, { addressData: addressText });
      if (response.data.success) {
        setAddress(addressText);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to sync address to database:", error.message);
    }
  };

  const syncCartWithDatabase = async (updatedCart) => {
    try {
      await axios.post(
        `${backendUrl}/api/cart/update`, 
        { cartItems: updatedCart },
        { headers: token ? { token } : {} } 
      );
    } catch (error) {
      console.error("Failed to sync cart to database:", error.message);
    }
  };

  const addToCart = (id, qty = 1) => {
    setCartItems((prev) => {
      const newCart = { ...prev, [id]: qty };
      syncCartWithDatabase(newCart); 
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      delete newCart[id];
      syncCartWithDatabase(newCart); 
      return newCart;
    });
  };

  const getCartProducts = () =>
    Object.keys(cartItems)
      .map((id) => {
        const product = products.find((p) => String(p._id) === String(id));
        return product ? { ...product, qty: cartItems[id] } : null;
      })
      .filter(Boolean);

  const getCartAmount = () =>
    getCartProducts().reduce((sum, item) => sum + item.price * item.qty, 0);

  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  useEffect(() => {
    getProductsData();
    checkAuthStatus();
  }, [token]); 

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        user,
        setUser,
        showUserLogin,
        setShowUserLogin,
        products,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getCartProducts,
        getCartAmount,
        cartCount,
        orders,
        search,       
        setSearch,
        token,      
        setToken,   
        checkAuthStatus,
        address,                    // EXPORTED
        syncAddressWithDatabase     // EXPORTED
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;