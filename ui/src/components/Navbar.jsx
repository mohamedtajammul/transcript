import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white text-gray-800 px-24 py-6 flex justify-between items-center shadow-md z-10 relative">
            <div className="text-xl font-bold">
                <Link to="/" className="font-bold">Transcript</Link>
            </div>

            <div className="space-x-4">
                <Link
                    to="/login"
                    className="font-bold border border-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition"
                >
                    Login
                </Link>
                {/* <Link
                    to="/register"
                    className="font-bold bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                    Sign Up
                </Link> */}
            </div>
        </nav>
    );
};

export default Navbar;
