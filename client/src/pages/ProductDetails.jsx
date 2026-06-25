import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart } = useContext(AppContext);
  const [productData, setProductData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      const foundProduct = products.find(item => String(item._id) === String(id));
      if (foundProduct) {
        setProductData(foundProduct);

        const related = products
          .filter(item =>
            item.category === foundProduct.category &&
            String(item._id) !== String(id)
          )
          .slice(0, 4);

        setRelatedProducts(related);
      }
    }
  }, [id, products]);

  const handleAddToCart = () => {
    if (productData) {
      addToCart(productData._id);   // ✅ update cartItems in context
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  if (!productData) {
    return (
      <div className="text-center py-32 text-gray-400 text-sm">
        Retrieving detailed item information sheet...
      </div>
    );
  }

  const imageSrc = productData.image || productData.img;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8 bg-white text-left min-h-screen">
      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed top-6 left-0 right-0 mx-auto w-full max-w-md px-4">
          <div className="bg-green-600 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center text-center">
            {productData.name} added to cart
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 font-medium mb-8 flex items-center gap-1.5 select-none">
        <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-green-600 transition-colors">Products</Link>
        <span>/</span>
        <span className="capitalize">{productData.category}</span>
        <span>/</span>
        <span className="text-gray-700 font-semibold">{productData.name}</span>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-16">
        {/* Left: images */}
        <div className="md:col-span-6 flex flex-col-reverse sm:flex-row gap-4 w-full">
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto shrink-0 pb-2 sm:pb-0 justify-start">
            {(productData.images || [imageSrc]).map((img, idx) => (
              <div
                key={idx}
                className="w-16 h-16 border border-gray-200 hover:border-green-500 rounded-xl flex items-center justify-center p-1.5 bg-gray-50/30 cursor-pointer transition-all"
              >
                <img src={img} alt={`thumb-${idx}`} className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
          <div className="w-full aspect-square border border-gray-100 rounded-2xl flex items-center justify-center p-8 bg-white shadow-sm/50">
            <img
              src={imageSrc}
              alt={productData.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Right: details */}
        <div className="md:col-span-6 flex flex-col pt-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
            {productData.name}
          </h1>

          {/* Ratings */}
          <div className="flex items-center gap-0.5 text-green-500 mb-5">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>{i < productData.rating ? "★" : "☆"}</span>
            ))}
            <span className="text-xs text-gray-400 font-semibold ml-1.5">
              ({productData.rating})
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-0.5 mb-6 bg-gray-50/50 border border-gray-100 p-4 rounded-xl max-w-xs">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              MRP: <span className="line-through">${Number(productData.price) + 5}</span>
            </span>
            <span className="text-2xl font-black text-gray-900 flex items-center gap-1.5">
              MRP: <span className="text-green-600">${productData.price}</span>
              <span className="text-[10px] font-bold text-gray-400 mt-1.5 tracking-tight font-normal">
                (inclusive of all taxes)
              </span>
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">About Product</h4>
            <ul className="space-y-1.5 text-xs font-semibold text-gray-500 list-disc pl-4">
              {(productData.details || [
                "Fresh and organic",
                "Rich in nutrients and minerals",
                "Ideal for home cooking and daily meals",
              ]).map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 max-w-md w-full pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm py-3.5 rounded-xl transition-all active:scale-[0.99] cursor-pointer shadow-sm"
            >
              Add to Cart
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all active:scale-[0.99] cursor-pointer shadow-md">
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="border-t border-gray-100 pt-10">
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider relative pb-2 inline-block border-b-2 border-green-500 mb-8">
          Related Products
        </h3>

        {relatedProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No related products found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.map((item) => {
              const itemImage = item.image || item.img;
              return (
                <Link
                  to={`/product/${item._id}`}
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col h-48 hover:border-green-500 transition-all"
                >
                  <div className="flex items-center justify-center h-24 mb-2">
                    <img
                      src={itemImage}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="text-xs font-bold text-green-600 mt-1">
                    ${item.price}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
