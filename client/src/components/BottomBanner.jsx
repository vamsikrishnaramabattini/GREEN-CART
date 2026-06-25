import React from 'react'
import { assets, features } from '../assets/greencart_assets/assets'

const BottomBanner = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 my-16">
      <div className="relative rounded-2xl bg-[#EAF7F2] overflow-hidden flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 lg:p-16 gap-12">
        
        {/* Left Column: Image Asset Group Layout */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative min-h-[300px] md:min-h-[380px]">
          {/* Main Background Cover Asset Image */}
          <img 
            src={assets.bottom_banner_image} 
            alt="Fresh Delivery" 
            className="max-h-[320px] md:max-h-[400px] object-contain z-10"
          />
          
          {/* Floating Small Fast Delivery Badge Overlay Card */}
          <div className="absolute bottom-4 left-4 md:left-12 bg-white rounded-full px-5 py-2.5 shadow-md flex items-center gap-3 z-20 animate-bounce">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <img src={assets.delivery_truck_icon} alt="Truck" className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-blue-900 leading-none">Fast Delivery</p>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">In 30 Min</p>
            </div>
          </div>
        </div>

        {/* Right Column: Title and Mapped Features Dynamic List */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">
            Why We Are the Best?
          </h2>

          {/* Dynamic Feature list loop reading parameters from assets.js */}
          <div className="flex flex-col gap-6 w-full">
            {features.map((item, index) => (
              <div key={index} className="flex items-start gap-4 group">
                {/* Square Feature Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#3BB77E]/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <img 
                    src={item.icon} 
                    alt={item.title} 
                    className="w-6 h-6 object-contain"
                    style={{ 
                      // Custom matrix styling to match the exact dark-green icon style from your screen capture
                      filter: 'invert(53%) sepia(68%) saturate(441%) md:hue-rotate(104deg) brightness(91%) contrast(85%)' 
                    }}
                  />
                </div>
                
                {/* Feature Content Text Blocks */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-base font-bold text-gray-900 mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default BottomBanner