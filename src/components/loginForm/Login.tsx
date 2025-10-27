import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL, USE_MOCK_AUTH } from '../config/env';


// Mock user storage (keep for development/testing)
const getMockUsers = () => {
  const users = localStorage.getItem('mockUsers');
  if (!users) {
    const defaultUsers = {
      'test@example.com': {
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        id: 'user-123'
      }
    };
    localStorage.setItem('mockUsers', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(users);
};

const saveMockUser = (email, userData) => {
  const users = getMockUsers();
  users[email] = userData;
  localStorage.setItem('mockUsers', JSON.stringify(users));
};

// Mock OTP storage (not used on login page; included unchanged for parity)
const saveOTP = (email, otp) => {
  const otpData = { otp, timestamp: Date.now(), email };
  localStorage.setItem('passwordResetOTP', JSON.stringify(otpData));
};
const getStoredOTP = () => {
  const otpData = localStorage.getItem('passwordResetOTP');
  if (!otpData) return null;
  const parsed = JSON.parse(otpData);
  if (Date.now() - parsed.timestamp > 10 * 60 * 1000) {
    localStorage.removeItem('passwordResetOTP');
    return null;
  }
  return parsed;
};

// Mock authentication services
const mockRegister = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const users = getMockUsers();
  if (users[userData.email]) throw new Error('An account with this email already exists.');
  const newUser = {
    id: 'user-' + Date.now(),
    firstName: userData.first_name,
    lastName: userData.last_name,
    email: userData.email,
    password: userData.password,
    createdAt: new Date().toISOString()
  };
  saveMockUser(userData.email, newUser);
  return {
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  };
};

const mockLogin = async (credentials) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const users = getMockUsers();
  const user = users[credentials.email];
  if (!user || user.password !== credentials.password) throw new Error('Invalid email or password');
  return {
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  };
};

const mockSendOTP = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const users = getMockUsers();
  if (!users[email]) throw new Error('No account found with this email address');
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  saveOTP(email, otp);
  console.log('Mock OTP sent:', otp);
  return { success: true, message: `OTP sent to ${email}` };
};

const mockVerifyOTP = async (email, otp) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const storedOTPData = getStoredOTP();
  if (!storedOTPData) throw new Error('OTP has expired. Please request a new one.');
  if (storedOTPData.email !== email || storedOTPData.otp !== otp) throw new Error('Invalid OTP');
  return { success: true, reset_token: 'mock-reset-token' };
};

const mockResetPassword = async (email, newPassword) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const users = getMockUsers();
  const user = users[email];
  if (!user) throw new Error('User not found');
  user.password = newPassword;
  saveMockUser(email, user);
  localStorage.removeItem('passwordResetOTP');
  return { success: true };
};

// Real backend authentication services
const sendOTPToEmail = async (email) => {
  const response = await fetch(`${BACKEND_URL}/api/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
  return data;
};

const verifyOTPCode = async (email, otp) => {
  const response = await fetch(`${BACKEND_URL}/api/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Invalid OTP');
  return data;
};

const resetUserPassword = async (email, password, resetToken) => {
  const response = await fetch(`${BACKEND_URL}/api/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, reset_token: resetToken })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to reset password');
  return data;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateSignIn = () => {
    const errors = {};
    if (!signInData.email) errors.email = 'Email is required';
    else if (!validateEmail(signInData.email)) errors.email = 'Invalid email format';
    if (!signInData.password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    setLoading(true);
    setError('');

    try {
      let data;
      if (USE_MOCK_AUTH) {
        data = await mockLogin({
          email: signInData.email,
          password: signInData.password
        });
      } else {
        const response = await fetch(`${BACKEND_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: signInData.email, password: signInData.password })
        });
        if (!response) throw new Error('No response from server. Please check if the backend is running.');
        data = await response.json();
        if (!response.ok) {
          if (response.status === 401) throw new Error('Invalid email or password');
          else if (response.status === 404) throw new Error('Account not found. Please sign up first.');
          else throw new Error(data.message || 'Login failed. Please try again.');
        }
      }

      setSuccess('Login successful! Redirecting...');
      await login(data.token, data.user, signInData.rememberMe);
    } catch (err) {
      console.error('Login error:', err);
      if (err.message.includes('fetch')) {
        setError(`Cannot connect to server. Please ensure the backend is running on ${BACKEND_URL}`);
      } else if (err.message.includes('JSON')) {
        setError('Invalid response from server. Please try again.');
      } else {
        setError(err.message || 'Unable to sign in. Please try again later.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">TalentFlow AI</h1>
          <p className="text-gray-300">Sign in to continue</p>
          {USE_MOCK_AUTH && (
            <p className="text-yellow-400 text-xs mt-2">
              (Using mock authentication - backend not connected)
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-green-300 text-sm">{success}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                className={`w-full pl-10 pr-3 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.email ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            {formErrors.email && <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                className={`w-full pl-10 pr-10 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.password ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formErrors.password && <p className="mt-1 text-xs text-red-400">{formErrors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={signInData.rememberMe}
                onChange={(e) => setSignInData({ ...signInData, rememberMe: e.target.checked })}
                className="w-4 h-4 bg-white/10 border-white/20 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-300">Remember me</span>
            </label>
            {/* Link to your ForgotPassword route */}
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="animate-spin w-5 h-5 mr-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-gray-300 text-sm mt-6">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Create one
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
