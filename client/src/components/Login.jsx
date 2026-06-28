import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Login = () => {
    // Destructured backendUrl and setToken from global context
   const { 
    showUserLogin, 
    setShowUserLogin, 
    backendUrl, 
    setToken,
    checkAuthStatus
} = useContext(AppContext);
    
    // State to toggle between 'Login' view and 'Sign Up' view
    const [currentState, setCurrentState] = useState('Login');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    if (!showUserLogin) return null;

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            
            if (currentState === 'Sign Up') {
                // API call for Registration
                response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
            } else {
                // API call for Login
                response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
            }

            if (response.data.success) {

    setToken(response.data.token);
    localStorage.setItem('token', response.data.token);

    await checkAuthStatus();

    setShowUserLogin(false);
                // 4. Clear form input boxes
                setName('');
                setEmail('');
                setPassword('');
            } else {
                alert(response.data.message);
            }

        } catch (error) {
            console.error("Authentication Error:", error);
            alert(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        /* Outer Shaded Backdrop */
        <div 
            onClick={() => setShowUserLogin(false)} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
            {/* Inner Card Container */}
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border border-gray-100"
            >
                {/* Close Cross Symbol */}
                <button 
                    onClick={() => setShowUserLogin(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    <span className="text-green-600 font-extrabold">{currentState === 'Login' ? 'User' : 'Sign Up'}</span> {currentState === 'Login' ? 'Login' : ''}
                </h2>

                <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                    {currentState === 'Sign Up' && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                            <input 
                                type="text" 
                                placeholder="type your full name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none text-sm text-gray-700 focus:border-green-500"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                        <input 
                            type="email" 
                            placeholder="type here" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none text-sm text-gray-700 focus:border-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="type here" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none text-sm text-gray-700 focus:border-green-500"
                            required
                        />
                    </div>

                    <div className="text-xs text-gray-500 text-center py-2">
                        {currentState === 'Login' ? (
                            <p>Create an account? <span onClick={() => setCurrentState('Sign Up')} className="text-green-600 font-semibold underline cursor-pointer ml-1">click here</span></p>
                        ) : (
                            <p>Already have an account? <span onClick={() => setCurrentState('Login')} className="text-green-600 font-semibold underline cursor-pointer ml-1">Login here</span></p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-3 text-white bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer text-sm"
                    >
                        {currentState === 'Login' ? 'Login' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;