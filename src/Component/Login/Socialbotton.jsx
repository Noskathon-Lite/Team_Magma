import React from 'react';
import { FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';

const SocialButtons = () => {
    const handleSocialLogin = (platform) => {
        console.log(`Logging in with ${platform}`);
    };

    return (
        <div className="flex justify-center space-x-4">
            <button
                className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
                onClick={() => handleSocialLogin('Facebook')}
            >
                <FaFacebookF />
            </button>
            <button
                className="flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                onClick={() => handleSocialLogin('Google')}
            >
                <FaGoogle />
            </button>
            <button
                className="flex items-center justify-center w-12 h-12 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition duration-300"
                onClick={() => handleSocialLogin('Twitter')}
            >
                <FaTwitter />
            </button>
        </div>
    );
};

export default SocialButtons;
