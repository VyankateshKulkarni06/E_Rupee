import React, { useState } from 'react';
import { User as UserIcon, Lock, CreditCard, Shield, ChevronDown } from 'lucide-react';

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
  const [receiverName, setReceiverName] = useState('Ranaavir Enterprises');
  const [isReceiverOpen, setIsReceiverOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ amount, transactionType, purpose, password });
    // Add payment logic here
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Remove special characters and letters, keep only numbers
    if (value === '' || parseInt(value) >= 0) {
      setAmount(value);
    }
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
            Rajeshahi Canteen <ChevronDown size={20} className="ml-2" />
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
                Rajeshahi Canteen <ChevronDown size={20} className="ml-2" />
              </span>
              {isReceiverOpen && (
                <div className="absolute mt-2 w-48 bg-white border border-indigo-100 rounded-xl shadow-lg z-10">
                  <div className="p-2 text-gray-700">{receiverName}</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <input
                  type="text"
                  value={amountDisplay}
                  onChange={handleAmountChange}
                  className="w-40 mx-auto text-center text-xl font-bold py-3 rounded-xl focus:outline-none transition-all duration-200 bg-transparent border-none text-indigo-800"
                  placeholder={amountDisplay}
                  style={{ color: amount ? 'indigo-800' : 'gray-600' }}
                />
              </div>

              <SelectField
                label="Transaction Type"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                options={[
                  { value: 'extra', label: 'Extra' },
                  { value: 'standard', label: 'Standard' },
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
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <Shield size={16} className="mr-2" /> Send Securely
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDashboard;