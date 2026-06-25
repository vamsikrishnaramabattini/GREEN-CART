import React from 'react';

const NewsLetter = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 px-6 my-12">
            <h1 className="md:text-4xl text-2xl font-semibold text-gray-900">Never Miss a Deal!</h1>
            <p className="md:text-lg text-gray-500/70 pb-8">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts
            </p>
            
            <form 
                onSubmit={(e) => e.preventDefault()} 
                className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
            >
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-700 placeholder-gray-400"
                    type="email"
                    placeholder="Enter your email id"
                    required
                />
                {/* UPDATED: Changed from bg-indigo-500 to our theme green bg-green-600 */}
                <button 
                    type="submit" 
                    className="md:px-12 px-8 h-full text-white bg-green-600 hover:bg-green-700 transition-all font-semibold cursor-pointer rounded-md rounded-l-none shrink-0"
                >
                    Subscribe
                </button>
            </form>
        </div>
    );
};

export default NewsLetter;