import React, { useState, useEffect } from 'react';
import { User as UserIcon, Lock, Shield, ChevronDown, Check, AlertCircle } from 'lucide-react';

const InputField = ({ label, type, value, onChange, icon: Icon, placeholder, name }) => (
  <div className="mb-6">
    <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon size={18} className="text-indigo-400" />
      </div>
      <input
        id={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
        placeholder={placeholder}
        name={name}
      />
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options, name }) => (
  <div className="mb-6">
    <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
    <select
      id={name}
      value={value}
      onChange={onChange}
      className="w-full pl-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
      name={name}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

function PaymentDashboard() {
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('extra');
  const [purpose, setPurpose] = useState('');
  const [password, setPassword] = useState('');
  const [receiverName, setReceiverName] = useState('kulkarni');
  const [isReceiverOpen, setIsReceiverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null); // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Load receiver name and check token on component mount
  useEffect(() => {
    const savedReceiverName = localStorage.getItem('receiver_username');
    if (savedReceiverName) {
      setReceiverName(savedReceiverName);
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setTransactionStatus('error');
      setErrorMessage('No authentication token found. Please log in.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !password) {
      setErrorMessage('Please enter amount and password');
      setTransactionStatus('error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setTransactionStatus('error');
      setErrorMessage('No authentication token found. Please log in.');
      return;
    }

    setIsSubmitting(true);
    setTransactionStatus(null);
    setErrorMessage('');

    try {
      const payloadData = {
        receiver: receiverName,
        amount: parseFloat(amount),
        password: password,
        type: transactionType,
        purpose: purpose || 'project_bonus',
      };
      console.log("token",token);

      const response = await fetch('https://e-rupee.onrender.com/transact/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': `Bearer ${token}`, // Ensure token is sent in the correct header
        },
        body: JSON.stringify(payloadData),
      });

      const result = await response.json();

      if (response.ok && result.done === true) {
        setTransactionStatus('success');
        setTransactionAmount(amount);
        // Reset form fields after successful transaction
        setAmount('');
        setPurpose('');
        setPassword('');
      } else {
        setTransactionStatus('error');
        if (result.message === 'Access denied. No token provided.') {
          setIsAuthenticated(false);
          setErrorMessage('Authentication failed. Please log in again.');
        } else {
          setErrorMessage(result.message || 'Transaction failed');
        }
      }
    } catch (error) {
      setTransactionStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Remove special characters and letters, keep only numbers
    if (value === '' || parseInt(value) >= 0) {
      setAmount(value);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('receiver_username');
    setIsAuthenticated(false);
    setTransactionStatus('error');
    setErrorMessage('You have been logged out. Please log in to continue.');
    // Optionally redirect to login page here if you have a routing setup
  };

  const amountDisplay = amount ? `₹${amount}` : 'Enter Amount';

  const toggleReceiver = () => {
    setIsReceiverOpen(!isReceiverOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Enhanced Header - Now part of the card in desktop view */}
      <div className="lg:hidden sticky top-0 z-10 bg-white shadow-md p-4 w-full">
        <div className="flex justify-center items-center">
          <UserIcon size={24} className="text-purple-600 mr-2" />
          <span
            onClick={toggleReceiver}
            className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 cursor-pointer flex items-center"
          >
            {receiverName} <ChevronDown size={20} className="ml-2" />
          </span>
          {isReceiverOpen && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-indigo-100 rounded-xl shadow-lg z-10">
              <div className="p-2 text-gray-700">{receiverName}</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-50">
          {/* Header inside the card for desktop view */}
          <div className="hidden lg:block bg-gradient-to-r from-indigo-100 to-purple-100 p-4">
            <div className="flex justify-center items-center">
              <UserIcon size={24} className="text-purple-600 mr-2" />
              <span
                onClick={toggleReceiver}
                className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 cursor-pointer flex items-center"
              >
                {receiverName} <ChevronDown size={20} className="ml-2" />
              </span>
              {isReceiverOpen && (
                <div className="absolute mt-2 w-48 bg-white border border-indigo-100 rounded-xl shadow-lg z-10">
                  <div className="p-2 text-gray-700">{receiverName}</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {transactionStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <Check size={32} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-2">
                  Your payment of <span className="font-semibold">₹{transactionAmount}</span> to {receiverName} has been processed.
                </p>
                <p className="text-green-600 font-medium mb-6">✅ Transaction completed</p>
                <button
                  onClick={() => setTransactionStatus(null)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Make Another Payment
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {!isAuthenticated ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start mb-4 w-full">
                      <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5" />
                      <p className="text-red-700 text-sm">{errorMessage}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Log In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {transactionStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start mb-4">
                        <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5" />
                        <p className="text-red-700 text-sm">{errorMessage}</p>
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <input
                        type="text"
                        value={amountDisplay}
                        onChange={handleAmountChange}
                        className="w-40 mx-auto text-center text-xl font-bold py-3 rounded-xl focus:outline-none transition-all duration-200 bg-transparent border-none text-indigo-800"
                        placeholder="Enter Amount"
                        style={{ color: amount ? '#4f46e5' : '#4b5563' }}
                      />
                    </div>

                    <SelectField
                      label="Transaction Type"
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                      options={[
                        { value: 'extra', label: 'Extra' },
                        { value: 'normal', label: 'Standard' },
                      ]}
                      name="transactionType"
                    />

                    <InputField
                      label="Purpose"
                      type="text"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      icon={UserIcon}
                      placeholder="Enter purpose"
                      name="purpose"
                    />

                    <InputField
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={Lock}
                      placeholder="Enter password"
                      name="password"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Shield size={16} className="mr-2" /> Send Securely
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDashboard;