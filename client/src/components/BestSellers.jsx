import React, { useEffect, useState } from 'react'
import { dummyProducts, assets } from '../assets/greencart_assets/assets'
import ProductCard from './ProductCard'

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([])
  const [popupMessage, setPopupMessage] = useState("")
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Force direct mapping arrays
    const productsWithRatings = dummyProducts.slice(0, 5).map((product, index) => ({
      ...product,
      rating: index % 2 === 0 ? 5 : 4 
    }))
    setBestSellers(productsWithRatings)
  }, [])

  const triggerCartPopup = (productName) => {
    setPopupMessage(`${productName} added to cart successfully!`)
    setShowPopup(true)

    // Clear alert row automatically after 3 seconds
    const timer = setTimeout(() => {
      setShowPopup(false)
    }, 3000)

    return () => clearTimeout(timer)
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 my-10 relative">
      
      {/* Dynamic Pop-up Alert Toast Window Block */}
      <div 
        className={`fixed top-5 right-5 bg-gray-900 text-white px-5 py-3.5 rounded-lg shadow-2xl z-50 flex items-center justify-between gap-4 border border-green-500 text-sm font-semibold min-w-[280px] sm:min-w-[320px] transition-all duration-300 ${
          showPopup ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-bold text-base">✓</span> 
          <span>{popupMessage}</span>
        </div>
        
        {/* Close Button pulling your remove_icon directly from assets.js */}
        <button 
          onClick={() => setShowPopup(false)} 
          className="w-5 h-5 flex items-center justify-center p-0.5 rounded hover:bg-gray-800 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <img 
            src={assets.remove_icon} 
            alt="close" 
            className="w-full h-full invert brightness-200" 
          />
        </button>
      </div>

      {/* Grid Container */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">Best Sellers</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {bestSellers.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            onAddToCart={triggerCartPopup}
          />
        ))}
      </div>
    </div>
  )
}

export default BestSellers