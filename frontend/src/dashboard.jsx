import { useState } from 'react';
import { 
  Menu, 
  X, 
  Send, 
  Wallet, 
  Gift, 
  Clock, 
  QrCode,
  User,
  CreditCard,
  BarChart4,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm py-4 px-4 flex justify-between items-center border-b border-indigo-100">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4 text-indigo-600">
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-2">
            <CreditCard size={22} className="text-purple-600" />
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              PayEase
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative">
            <Bell size={22} className="text-indigo-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
          </button>
        </div>
      </header>

      {/* Sliding Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Profile</h2>
              <button onClick={toggleSidebar} className="text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-2">
                <User size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium">VyanTech</h3>
              <p className="text-indigo-100">user@vyantech.com</p>
            </div>
          </div>
          
          <div className="p-4 flex justify-center border-b border-indigo-100">
            <div className="p-3 bg-white rounded-lg shadow-md w-full">
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Scan to Pay</h4>
                <div className="w-32 h-32 bg-white p-2 border border-indigo-100 rounded-lg mb-2">
                  <QrCode size={120} className="text-indigo-800" />
                </div>
                <p className="text-xs text-gray-500">ID: VT123456789</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center p-3 text-indigo-600 bg-indigo-50 rounded-lg">
                  <BarChart4 size={18} className="mr-3" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Wallet size={18} className="mr-3" />
                  <span>My Wallet</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Clock size={18} className="mr-3" />
                  <span>Transactions</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Settings size={18} className="mr-3" />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t border-indigo-100">
            <button className="flex items-center p-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={18} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, <span className="text-indigo-600">VyanTech</span></h1>
          <p className="text-gray-600">Manage your payments and transactions</p>
        </div>
        
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 shadow-lg mb-6 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-indigo-100">Available Balance</p>
              <h2 className="text-3xl font-bold">₹24,500.00</h2>
            </div>
            <button className="bg-white bg-opacity-20 px-3 py-1 rounded-lg text-sm">
              Add Money
            </button>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-indigo-100">Account Number</p>
              <p>••••8564</p>
            </div>
            <div>
              <p className="text-indigo-100">Valid Till</p>
              <p>12/29</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <Send size={20} className="text-indigo-600" />
            </div>
            <h3 className="font-medium text-gray-800">Send Money QR</h3>
            <p className="text-xs text-gray-500 text-center mt-1">Quick transfers via QR</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <Send size={20} className="text-indigo-600" />
            </div>
            <h3 className="font-medium text-gray-800">Send Money UPI</h3>
            <p className="text-xs text-gray-500 text-center mt-1">Transfer to UPI/Mobile</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <Wallet size={20} className="text-indigo-600" />
            </div>
            <h3 className="font-medium text-gray-800">Fetch Balance</h3>
            <p className="text-xs text-gray-500 text-center mt-1">Check account balance</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <Gift size={20} className="text-indigo-600" />
            </div>
            <h3 className="font-medium text-gray-800">Extra Balance</h3>
            <p className="text-xs text-gray-500 text-center mt-1">View rewards & bonuses</p>
          </div>
        </div>
        
        {/* Pending Requests */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800 flex items-center">
              <Clock size={18} className="text-indigo-500 mr-2" />
              Pending Requests
            </h3>
            <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">2 new</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Rahul Sharma</p>
                <p className="text-xs text-gray-500">Requested ₹2,000</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Pay</button>
                <button className="bg-white text-gray-600 border border-gray-300 px-3 py-1 rounded text-sm">Decline</button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Priya Patel</p>
                <p className="text-xs text-gray-500">Requested ₹500</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Pay</button>
                <button className="bg-white text-gray-600 border border-gray-300 px-3 py-1 rounded text-sm">Decline</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transaction History */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Transaction History</h3>
            <button className="text-indigo-600 text-sm">View All</button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Send size={16} className="text-green-600 transform rotate-180" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Money Received</p>
                  <p className="text-xs text-gray-500">From: Amit Kumar</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+₹1,500</p>
                <p className="text-xs text-gray-500">Today, 10:30 AM</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <Send size={16} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Money Sent</p>
                  <p className="text-xs text-gray-500">To: Neha Singh</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-600">-₹2,000</p>
                <p className="text-xs text-gray-500">Yesterday, 2:15 PM</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <CreditCard size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Added to Wallet</p>
                  <p className="text-xs text-gray-500">Via UPI</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+₹5,000</p>
                <p className="text-xs text-gray-500">Apr 14, 4:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}