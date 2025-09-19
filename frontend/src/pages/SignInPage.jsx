import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { auth, googleProvider, facebookProvider, appleProvider } from '../context/firebase';
import { signInWithPopup } from 'firebase/auth';

const SignInPage = ({ onToggleToSignUp, onSuccess }) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn(formData.email, formData.password);
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSocialLogin = async (providerName) => {
    try {
      if (!auth) {
        throw new Error('Social login is not configured. Please set Firebase env vars.');
      }
      let provider;
      if (providerName === 'Google') provider = googleProvider;
      else if (providerName === 'Facebook') provider = facebookProvider;
      else if (providerName === 'Apple') provider = appleProvider;
      else throw new Error('Unsupported provider');

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Social login success:', user);

      // If your backend needs to create/login user using Firebase ID token, do it here:
      // const idToken = await user.getIdToken();
      // await apiService.auth.loginWithFirebase({ idToken });

      onSuccess?.();
    } catch (err) {
      console.error('Social login error:', err);
      setError(err?.message || 'Social login failed');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      
      {/* Main Container */}
      <div className="relative z-20 bg-black/95 backdrop-blur-xl rounded-3xl p-12 w-full max-w-md border-2 border-yellow-400/30 shadow-2xl shadow-black/50">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Logo className="w-12 h-10 mr-3" />
          </div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-wide">VisionCast</h1>
          <p className="text-gray-400 text-lg">Sign in to continue</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-4 rounded-xl border border-yellow-400/30 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:bg-white/10 focus:ring-4 focus:ring-yellow-400/10 transition-all duration-300"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-4 pr-12 rounded-xl border border-yellow-400/30 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:bg-white/10 focus:ring-4 focus:ring-yellow-400/10 transition-all duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-300 hover:to-orange-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-b border-gray-700"></div>
          <span className="px-4 text-gray-500 text-sm">or continue with</span>
          <div className="flex-1 border-b border-gray-700"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-3 gap-3">
          {['Google', 'Apple', 'Facebook'].map((provider) => (
            <button
              key={provider}
              onClick={() => handleSocialLogin(provider)}
              className="py-3 px-4 border border-yellow-400/30 rounded-xl bg-white/5 text-yellow-400 hover:bg-yellow-400/10 hover:-translate-y-1 hover:border-yellow-400 transition-all duration-300 transform font-medium"
            >
              {provider}
            </button>
          ))}
        </div>

        {/* Extra Links */}
        <div className="text-center mt-6 text-sm text-gray-400">
          <a href="#" className="text-yellow-400 hover:text-orange-400 transition-colors">
            Forgot Password?
          </a>
          <span className="mx-2">•</span>
          <button 
            onClick={onToggleToSignUp}
            className="text-yellow-400 hover:text-orange-400 transition-colors"
          >
            Sign Up
          </button>
        </div>

      </div>
    </div>
  );
};

export default SignInPage;
