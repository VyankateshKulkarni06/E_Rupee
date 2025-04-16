import { useState } from 'react';
import { User, Mail, Lock, Info, CreditCard, Shield } from 'lucide-react';

function AuthUI() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [showOTP, setShowOTP] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowOTP(false); // Reset OTP visibility when switching tabs
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add authentication logic here
  };

  const handleSendOTP = () => {
    console.log('Sending OTP to:', formData.email);
    setShowOTP(true); // Show OTP input field
    // Add OTP logic here
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header with app branding */}
      <header className="py-6 px-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <CreditCard size={28} className="text-purple-600" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            E Rupee
          </span>
        </div>
      </header>

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

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Login Form */}
              {activeTab === 'login' && (
                <>
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
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      PasswordAs
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

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Login
                  </button>

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

              {/* Register Form */}
              {activeTab === 'register' && (
                <>
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
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

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
                        placeholder="Enter your email"
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
                        />
                      </div>
                    </div>
                  )}

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
                        placeholder="Create a password"
                      />
                    </div>
                  </div>

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
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>

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

        {/* About Us Section */}
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