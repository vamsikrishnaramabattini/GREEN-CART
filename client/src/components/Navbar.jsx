import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/greencart_assets/assets';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const navigate = useNavigate();

  const { 
    user, setUser, showUserLogin, setShowUserLogin, 
    search, setSearch, cartCount, getCartProducts, getCartAmount 
  } = useContext(AppContext);

  const logout = async () => {
    setUser(null);
    navigate('/');
  };

  const cartProducts = getCartProducts();
  const cartTotal = getCartAmount();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all z-50">

      {/* Logo */}
      <NavLink to='/' onClick={() => setOpen(false)} className="flex items-center gap-2">
        <img className="h-9" src={assets.logo} alt="GreenCart Logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/products'>All Products</NavLink>
        <NavLink to='/contact'>Contact</NavLink>

        {/* Search Input */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full bg-transparent w-64">
          <input 
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-gray-700 text-sm" 
            type="text" 
            placeholder="Search products" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img src={assets.search_icon} alt='Search' className='w-4 h-4 shrink-0' />
        </div>

        {/* Cart Icon */}
        <div className="relative cursor-pointer">
          <NavLink to="/cart" className="relative">
            <img src={assets.cart_icon} alt='Cart' className='w-6 opacity-80' />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-green-600 w-[18px] h-[18px] rounded-full">
              {cartCount}
            </button>
          </NavLink>
        </div>

        {/* Profile Icon beside Cart */}
        {!user ? (
          <button 
            onClick={() => setShowUserLogin(true)} 
            className="cursor-pointer px-8 py-2 bg-green-600 hover:bg-green-700 transition-all text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group cursor-pointer">
            <img 
              src={assets.profile_icon} 
              className="w-9 h-9 rounded-full object-cover border border-gray-300" 
              alt="Profile" 
            />
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-xl min-w-[160px] text-gray-700 z-50 overflow-hidden">
              <ul className="flex flex-col text-sm font-medium">
                <li 
                  onClick={() => navigate('/MyOrders')} 
                  className="px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
                >
                  My Orders
                </li>
                <li 
                  onClick={logout} 
                  className="px-4 py-2.5 hover:bg-red-50 hover:text-red-600 transition-colors border-t border-gray-100 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
