import React from 'react';
import { assets } from '../assets/greencart_assets/assets';

const Footer = () => {
    return (
        <footer className="w-full bg-[#EAF7F2] text-gray-600 text-sm mt-16">
            <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
                
                {/* Column 1: Brand Logo & Description */}
                <div className="lg:col-span-2 flex flex-col space-y-4">
                    <div className="flex items-center gap-2">
                        <img className="h-9" src={assets.logo} alt="GreenCart Logo" />
                    </div>
                    <p className="text-gray-500 leading-relaxed max-w-sm">
                        We deliver fresh groceries and snacks straight to your door. 
                        Trusted by thousands, we aim to make your shopping experience simple and affordable.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-base">Quick Links</h4>
                    <ul className="space-y-2.5">
                        <li><a href="/" className="hover:text-green-600 transition-colors">Home</a></li>
                        <li><a href="/products" className="hover:text-green-600 transition-colors">Best Sellers</a></li>
                        <li><a href="/" className="hover:text-green-600 transition-colors">Offers & Deals</a></li>
                        <li><a href="/" className="hover:text-green-600 transition-colors">Contact Us</a></li>
                    </ul>
                </div>

                {/* Column 3: Need Help? */}
                <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-base">Need help?</h4>
                    <ul className="space-y-2.5">
                        <li><a href="/" className="hover:text-green-600 transition-colors">Delivery Information</a></li>
                        <li><a href="/" className="hover:text-green-600 transition-colors">Return & Refund Policy</a></li>
                        <li><a href="/" className="hover:text-green-600 transition-colors">Payment Methods</a></li>
                        <li><a href="/" className="hover:text-green-600 transition-colors">Track your Order</a></li>
                    </ul>
                </div>

                {/* Column 4: Follow Us */}
                <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-base">Follow Us</h4>
                    <ul className="space-y-2.5">
                        <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-colors">Instagram</a></li>
                        <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-colors">Twitter</a></li>
                        <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-colors">Facebook</a></li>
                        <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-colors">YouTube</a></li>
                    </ul>
                </div>

            </div>

            {/* Bottom Copyright Row */}
            <div className="border-t border-gray-200/60 px-6 md:px-16 lg:px-24 xl:px-32 py-5 text-center text-xs text-gray-400 font-medium">
                Copyright 2026 © GreatStack.dev All Right Reserved.
            </div>
        </footer>
    );
};

export default Footer;