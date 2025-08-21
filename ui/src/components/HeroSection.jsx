import React from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="bg-white min-h-[calc(100vh-80px)] flex items-center justify-center text-center">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
                    Generate audio transcript at ease
                </h1>   
                <div className="flex justify-center gap-4 flex-wrap">
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-purple-600 text-white px-6 py-3 rounded-md text-lg hover:bg-purple-700 transition"
                    >
                        Get started
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
