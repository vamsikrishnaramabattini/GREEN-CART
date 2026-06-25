import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';   // ✅ import useNavigate
import { AppContext } from '../context/AppContext';

const AllProducts = () => {
  const { products, search, assets, addToCart } = useContext(AppContext);
  const navigate = useNavigate();   // ✅ hook for navigation

  // Filter products dynamically based on the Navbar search query
  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes((search || '').toLowerCase())
  );

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10 min-h-screen bg-white">
      {/* Page Header */}
      <div className="text-left mb-8">
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-gray-900 inline-block relative pb-2 border-b-2 border-green-500">
          ALL PRODUCTS
        </h1>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredProducts.map((item) => {
            let finalImageSrc = item.image || item.img;
            if (item.name.toLowerCase().includes('potato')) {
              finalImageSrc = "/src/assets/greencart_assets/potato_image_1.png";
            }

            return (
              <div 
                key={item._id} 
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col text-left group"
              >
                {/* Product Image */}
                <Link to={`/product/${item._id}`}>
                  <div className="w-full h-40 flex items-center justify-center overflow-hidden rounded-xl mb-3 bg-gray-50/50 p-2">
                    <img 
                      src={finalImageSrc} 
                      alt={item.name} 
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
                      onError={(e) => {
                        e.target.src = assets.potato_img || assets.potato || '';
                      }}
                    />
                  </div>
                </Link>

                {/* Category & Name */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-tight mb-0.5">
                  {item.category || 'Vegetables'}
                </p>
                <h3 className="text-sm font-bold text-gray-800 line-clamp-1 mb-1">
                  {item.name}
                </h3>

                {/* Ratings */}
                <div className="flex items-center gap-0.5 text-green-500 mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className="text-xs">
                      {i < (item.rating || 4) ? "★" : "☆"}
                    </span>
                  ))}
                  <span className="text-[10px] text-gray-400 font-medium ml-1">
                    ({item.rating || 4})
                  </span>
                </div>

                {/* Price + Buttons */}
                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-green-600">${item.price}</span>
                    {item.oldPrice && (
                      <span className="text-xs text-gray-400 line-through ml-1">${item.oldPrice}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {/* ✅ Add to Cart */}
                    <button 
                      onClick={() => addToCart(item._id)}
                      className="cursor-pointer flex items-center gap-1 border border-green-100 hover:border-green-600 bg-green-50/30 hover:bg-green-600 px-3 py-1 rounded-lg text-xs font-bold text-green-600 hover:text-white transition-all shadow-sm"
                    >
                      <span>+</span> Add
                    </button>

                    {/* ✅ Buy Now → Checkout */}
                    <button
                      onClick={() => {
                        addToCart(item._id);   // add item first
                        navigate("/checkout"); // then go to checkout
                      }}
                      className="cursor-pointer flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs font-bold text-white transition-all shadow-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-base">
            No matching products found for "{search}".
          </p>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
