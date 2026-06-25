import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProductCategory = () => {
    const { category } = useParams(); 
    const { products, search, assets } = useContext(AppContext);
    const navigate = useNavigate();

    const filteredProducts = products.filter(item => {
        if (!item) return false;
        
        const currentCategory = category ? String(category).toLowerCase() : 'all';
        
        if (currentCategory === 'all') {
            return !search ? true : String(item.name).toLowerCase().includes(search.toLowerCase());
        }

        if (!item.category) return false;
        const itemCategory = String(item.category).toLowerCase();

        const matchesCategory = itemCategory.includes(currentCategory) || 
                                currentCategory.includes(itemCategory) ||
                                (currentCategory === 'vegetables' && itemCategory.includes('veggie')) ||
                                (currentCategory === 'fruits' && itemCategory.includes('fruit'));

        const matchesSearch = !search ? true : String(item.name).toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    let titleText = "ALL PRODUCTS";
    if (category) {
        const currentCategory = String(category).toLowerCase();
        if (currentCategory.includes('fruit')) titleText = 'FRESH FRUITS';
        else if (currentCategory.includes('veg')) titleText = 'ORGANIC VEGGIES';
    }

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10 min-h-screen bg-white">
            <div className="text-left mb-8">
                <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-gray-900 inline-block relative pb-2 border-b-2 border-green-500">
                    {titleText}
                </h1>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredProducts.map((item) => {
                        // POTATO AND FALLBACK IMAGE RESOLUTION RULE:
                        // Pulls the image directly from your global assets file or the item object to prevent missing items
                        let finalImageSrc = item.image || item.img;
                        
                        if (item.name && String(item.name).toLowerCase().includes('potato')) {
                            finalImageSrc = assets?.potato_image_1 || "/src/assets/greencart_assets/potato_image_1.png";
                        }

                        return (
                            <div 
                                key={item._id} 
                                onClick={() => navigate(`/product/${item._id}`)}
                                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col text-left group cursor-pointer"
                            >
                                <div className="w-full h-40 flex items-center justify-center overflow-hidden rounded-xl mb-3 bg-gray-50/50 p-2">
                                    <img 
                                        src={finalImageSrc} 
                                        alt={item.name} 
                                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
                                        onError={(e) => {
                                            // Secure backup in case local system images have naming gaps
                                            e.target.src = "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400";
                                        }}
                                    />
                                </div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-tight mb-0.5">{item.category}</p>
                                <h3 className="text-sm font-bold text-gray-800 line-clamp-1 mb-1">{item.name}</h3>
                                
                                {/* Matches Screenshot 2026-06-17 174153_2.png rating metrics */}
                                <div className="flex items-center gap-0.5 text-green-500 mb-4">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                    <span className="text-[10px] text-gray-400 font-medium ml-1">(5)</span>
                                </div>
                                
                                <div className="mt-auto flex items-center justify-between gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-lg font-extrabold text-green-600">${item.price || 20}</span>
                                        <span className="text-[11px] text-gray-400 line-through">${Number(item.price || 20) + 5}</span>
                                    </div>
                                    <button className="cursor-pointer flex items-center gap-1 border border-green-100 hover:border-green-600 bg-green-50/30 hover:bg-green-600 px-3 py-1 rounded-lg text-xs font-bold text-green-600 hover:text-white transition-all shadow-sm">
                                        <span>+</span> Add
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-base">No items match your parameters.</p>
                </div>
            )}
        </div>
    );
};

export default ProductCategory;