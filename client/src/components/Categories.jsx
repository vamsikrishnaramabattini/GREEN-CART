import React from 'react'
import { useNavigate } from 'react-router-dom'
// Import the native categories array configuration directly
import { categories } from '../assets/greencart_assets/assets' 

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-12 mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
      
      {/* Scrollable category row */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((item, index) => (
          <div 
            key={index}
            onClick={() => navigate(`/products?category=${item.path}`)}
            style={{ backgroundColor: item.bgColor }} // Dynamic background color from your array
            className="flex flex-col items-center justify-between min-w-[130px] sm:min-w-[140px] p-6 rounded-xl cursor-pointer hover:shadow-md transition-all group border border-transparent hover:border-gray-200"
          >
            {/* Category Image Box */}
            <div className="w-20 h-20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <img 
                src={item.image} 
                alt={item.text} 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Category Text Label */}
            <p className="text-xs sm:text-sm font-semibold text-gray-800 text-center whitespace-nowrap">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories