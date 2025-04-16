import { useEffect, useState } from 'react';
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

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState({ user_name: "Loading",name_full:"Loading", balance: {} });

  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      console.log("before getting token");
      const token = localStorage.getItem("token");
      console.log("token:", token);

      try {
        console.log("before fetching");
        const response = await axios.get("http://localhost:5001/getBalance", {
          headers: {
            token: `Bearer ${token}`,
          },
        });
        console.log("after fetching");
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm py-3 px-3 flex justify-between items-center border-b border-indigo-100">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-3 text-indigo-600">
            <Menu size={20} />
          </button>
          <div className="flex items-center space-x-1">
            <CreditCard size={18} className="text-purple-600" />
            <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              PayEase
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <button className="relative">
            <Bell size={20} className="text-indigo-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
          </button>
        </div>
      </header>

      {/* Sliding Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Profile</h2>
              <button onClick={toggleSidebar} className="text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2">
                <User size={28} className="text-indigo-600" />
              </div>
              <h3 className="text-base font-medium">{user_name}</h3>
              <p className="text-xs text-indigo-100">{name_full}</p>
            </div>
          </div>
          
          <div className="p-3 flex justify-center border-b border-indigo-100">
            <div className="p-2 bg-white rounded-lg shadow-md w-full">
              <div className="flex flex-col items-center">
                <h4 className="text-xs font-medium text-gray-500 mb-1">Scan to Pay</h4>
                <div className="w-24 h-24 bg-white p-1 border border-indigo-100 rounded-lg mb-1">
                  <QrCode size={88} className="text-indigo-800" />
                </div>
                <p className="text-xs text-gray-500">ID: VT123456789</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-3">
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center p-2 text-indigo-600 bg-indigo-50 rounded-lg">
                  <BarChart4 size={16} className="mr-2" />
                  <span className="text-sm">Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Wallet size={16} className="mr-2" />
                  <span className="text-sm">My Wallet</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm">Transactions</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Settings size={16} className="mr-2" />
                  <span className="text-sm">Settings</span>
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="p-3 border-t border-indigo-100">
            <button className="flex items-center p-2 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={16} className="mr-2" />
              <span className="text-sm">Logout</span>
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
      <main className="flex-1 p-3">
        {/* Welcome Section */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800">Welcome, <span className="text-indigo-600">VyanTech</span></h1>
          <p className="text-sm text-gray-600">Manage your payments and transactions</p>
        </div>
        
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 shadow-lg mb-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-indigo-100">Available Balance</p>
              <h2 className="text-2xl font-bold">₹24,500.00</h2>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-1">
              <Send size={16} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Send QR</h3>
            <p className="text-xs text-gray-500 text-center">Quick transfers</p>
          </div>
          
          <div className="bg-white rounded-xl p-3 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-1">
              <Send size={16} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Send UPI</h3>
            <p className="text-xs text-gray-500 text-center">UPI/Mobile</p>
          </div>
          
          <div className="bg-white rounded-xl p-3 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-1">
              <Wallet size={16} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Check Bal</h3>
            <p className="text-xs text-gray-500 text-center">Account balance</p>
          </div>
          
          <div className="bg-white rounded-xl p-3 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-1">
              <Gift size={16} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Rewards</h3>
            <p className="text-xs text-gray-500 text-center">View bonuses</p>
          </div>
        </div>
        
        {/* Pending Requests Button */}
        <button 
          className="bg-white rounded-xl p-3 shadow-sm border border-indigo-50 mb-3 w-full hover:shadow-md transition-shadow"
          onClick={() => setActiveTab('pendingRequests')}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Clock size={16} className="text-indigo-500 mr-2" />
              <h3 className="font-medium text-gray-800 text-sm">Pending Requests</h3>
            </div>
            <div className="flex items-center">
              <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">2</span>
            </div>
          </div>
        </button>
        
        {/* Transaction History Button */}
        <button 
          className="bg-white rounded-xl p-3 shadow-sm border border-indigo-50 w-full hover:shadow-md transition-shadow"
          onClick={() => setActiveTab('transactions')}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800 text-sm">Transaction History</h3>
            <div className="flex items-center">
              <span className="text-indigo-600 text-xs">View All</span>
            </div>
          </div>
        </button>
      </main>

      {/* This would be separate page content that would appear when clicking the buttons */}
      {activeTab === 'pendingRequests' && (
        <div className="fixed inset-0 bg-white z-50 p-4 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Pending Requests</h2>
            <button onClick={() => setActiveTab('home')} className="text-indigo-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-indigo-50">
              <div>
                <p className="font-medium text-sm text-gray-800">Rahul Sharma</p>
                <p className="text-xs text-gray-500">Requested ₹2,000</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-indigo-600 text-white px-3 py-1 rounded text-xs">Pay</button>
                <button className="bg-white text-gray-600 border border-gray-300 px-3 py-1 rounded text-xs">Decline</button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-indigo-50">
              <div>
                <p className="font-medium text-sm text-gray-800">Priya Patel</p>
                <p className="text-xs text-gray-500">Requested ₹500</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-indigo-600 text-white px-3 py-1 rounded text-xs">Pay</button>
                <button className="bg-white text-gray-600 border border-gray-300 px-3 py-1 rounded text-xs">Decline</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'transactions' && (
        <div className="fixed inset-0 bg-white z-50 p-4 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Transaction History</h2>
            <button onClick={() => setActiveTab('home')} className="text-indigo-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-indigo-50">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Send size={16} className="text-green-600 transform rotate-180" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">Money Received</p>
                  <p className="text-xs text-gray-500">From: Amit Kumar</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm text-green-600">+₹1,500</p>
                <p className="text-xs text-gray-500">Today, 10:30 AM</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-indigo-50">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <Send size={16} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">Money Sent</p>
                  <p className="text-xs text-gray-500">To: Neha Singh</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm text-red-600">-₹2,000</p>
                <p className="text-xs text-gray-500">Yesterday, 2:15 PM</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-indigo-50">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <CreditCard size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">Added to Wallet</p>
                  <p className="text-xs text-gray-500">Via UPI</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm text-green-600">+₹5,000</p>
                <p className="text-xs text-gray-500">Apr 14, 4:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;