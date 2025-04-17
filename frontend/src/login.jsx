import { useState, useEffect } from 'react';
import { User, Mail, Lock, Info, CreditCard, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function AuthUI() {
  // Add navigation
  const navigate = useNavigate();
  
  // State for managing the active tab (login or register)
  const [activeTab, setActiveTab] = useState('login');
  
  // State for form data
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  
  // State to toggle OTP input visibility
  const [showOTP, setShowOTP] = useState(false);
  
  // State for feedback messages (success or error)
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Handle tab switching between login and register
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowOTP(false); // Hide OTP field when switching tabs
    setFeedback({ type: '', message: '' }); // Clear feedback
  };

  // Update form data on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Send OTP request to the server
  const handleSendOTP = async () => {
    try {
      let url, body;
      if (activeTab === 'login') {
        url = 'https://e-rupee.onrender.com/user/login-step1';
        body = {
          user_name: formData.username,
          email: formData.email,
        };
      } else {
        url = 'https://e-rupee.onrender.com/user/register-step1';
        body = {
          name: formData.fullName,
          user_name: formData.username,
          email: formData.email,
        };
      }

      // Show OTP field immediately
      setShowOTP(true);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.message) {
        setFeedback({ type: 'success', message: data.message || 'OTP sent successfully' });
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to send OTP' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Error sending OTP. Please try again.' });
    }
  };

  // Handle form submission for login or registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url, body;
      if (activeTab === 'login') {
        url = 'https://e-rupee.onrender.com/user/login-step2';
        body = {
          user_name: formData.username,
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
        };
      } else {
        url = 'https://e-rupee.onrender.com/user/register-step2';
        body = {
          name: formData.fullName,
          user_name: formData.username,
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        setFeedback({
          type: 'success',
          message: data.message || `${activeTab === 'login' ? 'Login' : 'Registration'} successful`,
        });

        // Reset form after successful registration
        if (activeTab === 'register') {
          setFormData({
            username: '',
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            otp: '',
          });
          setShowOTP(false);
        }
        
        // Navigate to dashboard after a short delay to show success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setFeedback({
          type: 'error',
          message: data.message || `${activeTab === 'login' ? 'Login' : 'Registration'} failed`,
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: `Error during ${activeTab === 'login' ? 'login' : 'registration'}. Please try again.`,
      });
    }
  };

  // Clear feedback message after 5 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="py-6 px-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <CreditCard size={28} className="text-purple-600" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            E Rupee
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-50">
          {/* Tab Navigation */}
          <div className="flex">
            <button
              className={`flex-1 py-4 text-center font-medium transition-all duration-200 ${
                activeTab === 'login'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 bg-opacity-50'
                  : 'text-gray-500 hover:text-indigo-500'
              }`}
              onClick={() => handleTabChange('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition-all duration-200 ${
                activeTab === 'register'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 bg-opacity-50'
                  : 'text-gray-500 hover:text-indigo-500'
              }`}
              onClick={() => handleTabChange('register')}
            >
              Register
            </button>
          </div>

          {/* Form Container */}
          <div className="p-6">
            {/* Feedback Message */}
            {feedback.message && (
              <div
                className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                  feedback.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {activeTab === 'login' && (
                <>
                  {/* Username */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-indigo-400" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                        placeholder="Enter username"
                      />
                    </div>
                  </div>

                  {/* Email with Send OTP */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Email
                    </label>
                    <div className="relative flex">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-indigo-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                        placeholder="Enter email"
                      />
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-r-xl text-sm font-medium whitespace-nowrap hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                      >
                        Send OTP
                      </button>
                    </div>
                  </div>

                  {/* OTP Input */}
                  {showOTP && (
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Enter OTP
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-indigo-400" />
                        </div>
                        <input
                          type="text"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                          placeholder="Enter OTP"
                          autoFocus
                        />
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-indigo-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Login
                  </button>

                  {/* Forgot Password Link */}
                  <div className="mt-4 text-center">
                    <a
                      href="#"
                      className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                </>
              )}

              {activeTab === 'register' && (
                <>
                  {/* Full Name */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-indigo-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-indigo-400" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>

                  {/* Email with Send OTP */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Email
                    </label>
                    <div className="relative flex">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-indigo-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                        placeholder="Enter email"
                      />
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-r-xl text-sm font-medium whitespace-nowrap hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                      >
                        Send OTP
                      </button>
                    </div>
                  </div>

                  {/* OTP Input */}
                  {showOTP && (
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Enter OTP
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-indigo-400" />
                        </div>
                        <input
                          type="text"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                          placeholder="Enter OTP"
                          autoFocus
                        />
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-indigo-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                        placeholder="Create password"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-indigo-400" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Register
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        {/* Security Badge */}
        <div className="w-full max-w-md mt-4 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-indigo-50">
          <div className="flex items-center justify-center">
            <Shield size={16} className="text-green-500 mr-2" />
            <span className="text-gray-600 text-sm">
              Secure Payments | 256-bit Encryption
            </span>
          </div>
        </div>

        {/* About Us (Register Tab Only) */}
        {activeTab === 'register' && (
          <div className="w-full max-w-md mt-4 bg-white rounded-xl shadow-md p-4 border border-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Info size={18} className="text-indigo-500 mr-2" />
                <span className="text-gray-700 font-medium">About us</span>
              </div>
              <span className="text-indigo-500 font-medium">E Rupee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthUI;