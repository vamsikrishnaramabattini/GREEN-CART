import React from 'react'
import { assets } from '../assets/greencart_assets/assets'

const MainBanner = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-6">
      <div className="relative rounded-2xl bg-[#EAF7F2] min-h-[280px] md:min-h-[380px] flex items-center overflow-hidden p-8 md:p-16">
        
        {/* Correct background key linked from your assets.js config */}
        <div 
          className="absolute inset-0 bg-cover bg-right md:bg-contain bg-no-repeat z-0"
          style={{ backgroundImage: `url(${assets.main_banner_bg})` }}
        />

        {/* Text Content */}
        <div className="z-10 max-w-lg flex flex-col items-start text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Freshness You Can <br />
            Trust, Savings You <br />
            will Love!
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <button className="bg-[#3BB77E] hover:bg-green-700 text-white font-medium px-6 py-3 rounded-md text-sm shadow-sm transition-all cursor-pointer">
              Shop now
            </button>
            <button className="text-gray-800 hover:text-green-600 font-medium text-sm flex items-center gap-1 transition-all cursor-pointer">
              Explore deals &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MainBanner