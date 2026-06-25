import React from "react";
import { assets } from "../assets/greencart_assets/assets";

const ProductCard = ({ product, onAddToCart }) => {
    const [count, setCount] = React.useState(0);

    // Reads the rating value sent down directly from BestSellers.jsx
    const productRating = product.rating || 4; 

    const handleAddClick = () => {
        setCount(1);
        if (onAddToCart) {
            onAddToCart(product.name); // Fires off the text popup notification toast alert wrapper
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300 flex flex-col justify-between text-left">
            
            {/* Clickable Product Image Wrapper Box */}
            <div className="group cursor-pointer flex items-center justify-center w-full h-32 md:h-40 overflow-hidden rounded-lg bg-gray-50 mb-3">
                <img 
                    className="group-hover:scale-105 transition-transform duration-300 max-h-full max-w-full object-contain" 
                    src={product.image[0]} 
                    alt={product.name} 
                />
            </div>

            {/* Product Meta Data Block */}
            <div className="flex-grow flex flex-col justify-between">
                <div>
                    {/* Category Label */}
                    <span className="text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">
                        {product.category}
                    </span>
                    {/* Product Name Title */}
                    <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 leading-tight mb-1 min-h-[36px]">
                        {product.name}
                    </h3>
                    
                    {/* Dynamic Numerical Array Star Icon Mapping Matrix */}
                    <div className="flex items-center gap-0.5 mb-3 text-xs text-gray-400">
                        {Array(5).fill('').map((_, i) => (
                            <img 
                                key={i} 
                                className="w-3 h-3"
                                src={i < productRating ? assets.star_icon : assets.star_dull_icon} 
                                alt="Star" 
                            />
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">({productRating})</span>
                    </div>
                </div>

                {/* Pricing & Cart Action Interface Row */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base md:text-lg font-bold text-green-600">
                            ${product.offerPrice}
                        </span>
                        {product.price !== product.offerPrice && (
                            <span className="text-xs text-gray-400 line-through">
                                ${product.price}
                            </span>
                        )}
                    </div>

                    {/* Action Item Buttons Panel */}
                    <div className="text-green-600">
                        {count === 0 ? (
                            <button 
                                className="flex items-center justify-center gap-1 bg-[#E8F5EE] hover:bg-green-600 text-green-700 hover:text-white border border-transparent font-semibold px-2.5 py-1.5 rounded text-xs md:text-sm transition-all cursor-pointer" 
                                onClick={handleAddClick} 
                            >
                                <img 
                                    src={assets.add_icon || assets.cart_icon} 
                                    alt="add" 
                                    className="w-3 h-3 filter group-hover:brightness-200"
                                />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[32px] bg-green-100 text-green-700 border border-green-200 font-semibold rounded select-none text-xs md:text-sm">
                                <button 
                                    onClick={() => setCount((prev) => Math.max(prev - 1, 0))} 
                                    className="cursor-pointer text-md font-bold px-2 h-full flex items-center justify-center"
                                >
                                    -
                                </button>
                                <span className="w-4 text-center font-bold">{count}</span>
                                <button 
                                    onClick={() => setCount((prev) => prev + 1)} 
                                    className="cursor-pointer text-md font-bold px-2 h-full flex items-center justify-center"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductCard;