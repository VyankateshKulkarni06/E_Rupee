import { useState, useEffect } from 'react';
import { DollarSign, User, FileText, Send, AlertCircle, Check, ArrowRight } from 'lucide-react';

const ExtraPaymentRequestForm = () => {
  const [formData, setFormData] = useState({
    payment_id: '',
    receiver_username: '',
    amount: '',
    purpose: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [step, setStep] = useState(1); // 1: Form, 2: Confirmation, 3: Success
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setFeedback({ type: 'error', message: 'No authentication token found. Please log in.' });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Restrict amount to numbers only and ensure it's positive
    if (name === 'amount') {
      formattedValue = value.replace(/[^0-9.]/g, '');
      if (formattedValue.split('.').length > 2) {
        formattedValue = formattedValue.slice(0, -1); // Prevent multiple decimals
      }
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const validateForm = () => {
    if (!formData.payment_id.trim()) return 'Payment ID is required';
    if (!formData.receiver_username.trim()) return 'Receiver username is required';
    if (!formData.amount.trim()) return 'Amount is required';
    if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      return 'Please enter a valid amount greater than 0';
    }
    return null;
  };

  const handleContinue = () => {
    const error = validateForm();
    
    if (error) {
      setFeedback({ type: 'error', message: error });
      return;
    }
    
    setStep(2);
    setFeedback({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step !== 2) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setFeedback({ type: 'error', message: 'No authentication token found. Please log in.' });
      return;
    }

    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const payload = {
        payment_id: formData.payment_id,
        receiver_username: formData.receiver_username,
        amount: parseFloat(formData.amount),
        purpose: formData.purpose || 'Not specified'
      };

      const response = await fetch('http://localhost:5001/transact/permission_extra_bal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.status === 'pending') {
        setStep(3);
        setFeedback({
          type: 'success',
          message: result.message || '✅ Permission request created successfully.'
        });
      } else {
        setFeedback({
          type: 'error',
          message: result.message || 'Failed to process request.'
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      payment_id: '',
      receiver_username: '',
      amount: '',
      purpose: ''
    });
    setStep(1);
    setFeedback({ type: '', message: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setFeedback({ type: 'error', message: 'You have been logged out. Please log in to continue.' });
  };

  // Clear error message after 5 seconds
  useEffect(() => {
    if (feedback.type === 'error' && feedback.message) {
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
          <DollarSign size={28} className="text-purple-600" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Extra Balance Transfer
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-50">
          {/* Form Container */}
          <div className="p-6">
            {/* Feedback Message */}
            {feedback.message && (
              <div
                className={`mb-4 p-3 rounded-xl text-sm font-medium animate-slide-down ${
                  feedback.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {feedback.message}
              </div>
            )}

            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start mb-4 w-full">
                  <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5" />
                  <p className="text-red-700 text-sm">{feedback.message}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Log In
                </button>
              </div>
            ) : (
              <>
                {/* Step 1: Form */}
                {step === 1 && (
                  <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
                    {/* Payment ID */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Extra Balance Payment ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={18} className="text-indigo-400" />
                        </div>
                        <input
                          type="text"
                          name="payment_id"
                          value={formData.payment_id}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                          placeholder="Enter payment ID"
                        />
                      </div>
                    </div>

                    {/* Receiver Username */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Receiver Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-indigo-400" />
                        </div>
                        <input
                          type="text"
                          name="receiver_username"
                          value={formData.receiver_username}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                          placeholder="Enter receiver's username"
                        />
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Amount
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={18} className="text-indigo-400" />
                        </div>
                        <input
                          type="text"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>

                    {/* Purpose */}
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Purpose
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                          <FileText size={18} className="text-indigo-400" />
                        </div>
                        <textarea
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                          placeholder="Enter purpose of transaction"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                      Continue
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  </form>
                )}

                {/* Step 2: Confirmation */}
                {step === 2 && (
                  <div>
                    <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                      <h3 className="font-medium text-indigo-700 mb-3">Confirm Request Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">Payment ID:</div>
                        <div className="text-gray-900 font-medium">{formData.payment_id}</div>
                        <div className="text-gray-600">Receiver:</div>
                        <div className="text-gray-900 font-medium">{formData.receiver_username}</div>
                        <div className="text-gray-600">Amount:</div>
                        <div className="text-gray-900 font-medium">₹{parseFloat(formData.amount).toFixed(2)}</div>
                        <div className="text-gray-600">Purpose:</div>
                        <div className="text-gray-900 font-medium">{formData.purpose || 'Not specified'}</div>
                      </div>
                    </div>

                    <div className="mb-6 p-3 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start">
                      <AlertCircle size={18} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-700">
                        This request requires approval from the original sender before funds can be transferred.
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={resetForm}
                        className="flex-1 py-3 border border-indigo-200 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center ${
                          loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Send size={18} className="mr-2" />
                            Submit Request
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4 animate-bounce">
                      <Check size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Request Submitted</h3>
                    <p className="text-gray-600 mb-6">
                      Your extra balance transfer request has been sent to the original sender for approval.
                    </p>
                    <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">Receiver:</div>
                        <div className="text-gray-900 font-medium">{formData.receiver_username}</div>
                        <div className="text-gray-600">Amount:</div>
                        <div className="text-gray-900 font-medium">₹{parseFloat(formData.amount).toFixed(2)}</div>
                      </div>
                    </div>
                    <button
                      onClick={resetForm}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Make Another Request
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="w-full max-w-md mt-4 bg-white rounded-xl shadow-md p-4 border border-indigo-50">
          <div className="flex items-start">
            <AlertCircle size={18} className="text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-1">About Extra Balance Transfers</h4>
              <p className="text-xs text-gray-600">
                An extra balance transfer allows you to use funds that were designated for you to pay another user. The original sender must approve all transfers to maintain transparency and security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind Animation Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExtraPaymentRequestForm;