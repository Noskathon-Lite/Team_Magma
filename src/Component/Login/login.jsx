import React from 'react';
import SocialButtons from './Socialbotton';

const LoginPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                    Sign In Virtual Doctor! 👋
                </h2>
                <p className="text-center text-gray-500 mt-2">

                </p>
                <form className="mt-6">
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Email or Username
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email or username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember-me"
                                className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-400"
                            />
                            <label
                                htmlFor="remember-me"
                                className="text-gray-600"
                            >
                                Remember Me
                            </label>
                        </div>
                        <a
                            href="/forgot-password"
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Forgot Password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-300"
                    >
                        Log in
                    </button>
                </form>
                <div className="text-center text-gray-500 mt-4">
                    New on our platform?{' '}
                    <a
                        href="/register"
                        className="text-blue-500 hover:underline"
                    >
                        Create an account
                    </a>
                </div>
                <div className="mt-6">
                    <p className="text-center text-gray-600 mb-4">or</p>
                    <SocialButtons />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
