import React from 'react';
import Topbar from '../components/Topbar';
import { useNavigate } from 'react-router-dom';

const Downloads = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#1A1625]">
            <Topbar />
            <div className="flex flex-col items-center justify-center h-96 text-white text-center">
                <i className="ri-download-cloud-2-line text-6xl text-purple-400/50 mb-4" />
                <h2 className="text-xl font-bold mb-2">Downloads Not Available</h2>
                <p className="text-gray-400 mb-6 text-sm max-w-xs">This feature is currently under development and will be available soon.</p>
                <button onClick={() => navigate('/')}
                    className="bg-purple-600 hover:bg-purple-500 px-6 py-2.5 rounded-xl transition text-sm">
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default Downloads;