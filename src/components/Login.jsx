import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Set authentication state
      login();
      
      // Navigate to home page
      navigate('/home', { replace: true });
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const LoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-600">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium text-gray-600">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );

  const SignupForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="flex flex-col">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-600">Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-600">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium text-gray-600">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-600">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );

  const ForgotPasswordForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm font-medium text-gray-600">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 disabled:bg-gray-400"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Reset Password'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          {showForgotPassword ? 'Reset Password' : isLogin ? 'Login' : 'Create Account'}
        </h2>
        {showForgotPassword ? (
          <ForgotPasswordForm />
        ) : isLogin ? (
          <LoginForm />
        ) : (
          <SignupForm />
        )}
        <div className="mt-4 text-center">
          {!showForgotPassword && (
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:underline"
              disabled={isLoading}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          )}
          {isLogin && !showForgotPassword && (
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-600 hover:underline mt-2 block mx-auto"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          )}
          {showForgotPassword && (
            <button
              onClick={() => setShowForgotPassword(false)}
              className="text-sm text-blue-600 hover:underline mt-2 block mx-auto"
              disabled={isLoading}
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;