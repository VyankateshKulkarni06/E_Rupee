
import { useEffect, useState, useRef } from 'react';
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
  Bell,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [qrError, setQrError] = useState('');
  const [isScanning, setIsScanning] = useState(false); // Controls QR scanning modal
  const [scanError, setScanError] = useState(''); // Stores scanning errors
  const [data, setData] = useState({ 
    user_name: 'Loading', 
    user_email: 'Loading',
    balance: 'Loading' 
  });
  const videoRef = useRef(null); // Reference to video element for camera feed
  const canvasRef = useRef(null); // Reference to canvas for QR scanning
  const scanIntervalRef = useRef(null); // Reference to scanning interval
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch user balance and data
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.post('https://e-rupee.onrender.com/getBalance', {}, {
          headers: {
            token: `Bearer ${token}`,
          },
        });
        
        const userData = response.data;
        if (userData && typeof userData.balance === 'object') {
          userData.balance = JSON.stringify(userData.balance);
        }
        
        setData(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchBalance();
  }, []);

  // Fetch user's QR code
  useEffect(() => {
    const fetchQrCode = async () => {
      if (data.user_name === 'Loading') return;

      const token = localStorage.getItem('token');
      if (!token) {
        setQrError('Authentication required');
        return;
      }

      try {
        setQrError('');
        const response = await axios.post(
          'https://e-rupee.onrender.com/get_qr',
          { text: data.user_name },
          {
            headers: {
              'Content-Type': 'application/json',
              'token': `Bearer ${token}`,
            },
          }
        );

        const { qrCode } = response.data;
        if (!qrCode) {
          throw new Error('No QR code data in response');
        }
        setQrImageUrl(qrCode);
      } catch (error) {
        console.error('QR code fetch failed:', error);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          setQrError(`Failed to load QR code: ${error.response.status}`);
        } else {
          setQrError('Failed to load QR code: Network error');
        }
      }
    };

    fetchQrCode();
  }, [data.user_name]);

  // Start QR scanning
  const startScanning = async () => {
    setIsScanning(true);
    setScanError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Prefer back camera
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        startQrScan();
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      setScanError('Failed to access camera. Please grant permission or try another device.');
      setIsScanning(false);
    }
  };

  // Stop QR scanning
  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    setIsScanning(false);
    setScanError('');
  };

  // Scan QR code from video feed
  const startQrScan = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const scan = () => {
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          const scannedUsername = code.data; // Assume QR code contains username
          localStorage.setItem('receiver_username', scannedUsername);
          stopScanning();
          navigate('/payment'); // Navigate to payment route
        }
      }
    };

    scanIntervalRef.current = setInterval(scan, 100); // Scan every 100ms
  };

  // Navigation handlers
  const navigateToPendingRequests = () => {
    navigate('/PendingRequests');
  };

  const navigateToTransactionHistory = () => {
    navigate('/Transaction_History');
  };
  
  const navigateToExtraBalance = () => {
    navigate('/ExtraBalances');
  };

  const navigateToSearchUsers = () => {
    navigate('/searchUsername');
  };

  const navigateToExtraPayment = () => {
    navigate('/ExtraPayment');
  };
  
  const username = data.user_name;
  const email = data.user_email;
  const balances = data.balance;
  localStorage.setItem('username', username);
  localStorage.setItem('email', email);

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
              <h3 className="text-base font-medium">{username}</h3>
              <p className="text-xs text-indigo-100">{email}</p>
            </div>
          </div>
          
          <div className="p-3 flex justify-center border-b border-indigo-100">
            <div className="p-2 bg-white rounded-lg shadow-md w-full">
              <div className="flex flex-col items-center">
                <h4 className="text-xs font-medium text-gray-500 mb-1">Scan to Pay</h4>
                <div className="w-24 h-24 bg-white p-1 border border-indigo-100 rounded-lg mb-1">
                  {qrError ? (
                    <p className="text-xs text-red-500 text-center">{qrError}</p>
                  ) : qrImageUrl ? (
                    <img src={qrImageUrl} alt="QR Code" className="w-full h-full object-contain" />
                  ) : (
                    <QrCode size={88} className="text-indigo-800" />
                  )}
                </div>
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
                <a href="#" onClick={navigateToTransactionHistory} className="flex items-center p-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors">
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

      {/* QR Scanning Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative bg-white rounded-xl p-4 max-w-md w-full">
            <button
              onClick={stopScanning}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <XCircle size={24} />
            </button>
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Scan QR Code</h3>
            {scanError ? (
              <p className="text-red-500 text-sm text-center">{scanError}</p>
            ) : (
              <div className="relative flex justify-center">
                <video
                  ref={videoRef}
                  className="w-full max-w-sm rounded-lg"
                  autoPlay
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />
                {/* Overlay to guide QR code placement */}
                <div className="absolute inset-0 border-4 border-transparent border-t-indigo-400 border-b-indigo-400 flex items-center justify-center">
                  <div className="w-48 h-48 border-4 border-indigo-400 rounded-lg opacity-50"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-3">
        {/* Welcome Section */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800">Welcome, <span className="text-indigo-600">{username}</span></h1>
          <p className="text-sm text-gray-600">Manage your payments and transactions</p>
        </div>
        
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 shadow-lg mb-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-indigo-100">Available Balance</p>
              <h2 className="text-2xl font-bold">{balances}</h2>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={startScanning}
            className="bg-white rounded-xl p-3 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-1">
              <Send size={16} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Scan QR</h3>
            <p className="text-xs text-gray-500 text-center">Quick transfers</p>
          </button>

          <button
            onClick={navigateToSearchUsers}
            className="bg-white rounded-xl p-3 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-1">
              <Send size={16} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Send by Username</h3>
            <p className="text-xs text-gray-500 text-center">Direct</p>
          </button>

          <button
            onClick={navigateToExtraBalance}
            className="bg-white rounded-xl p-3 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-1">
              <Wallet size={16} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Check Extra Bal</h3>
            <p className="text-xs text-gray-500 text-center">Account balance</p>
          </button>

          <button
            onClick={navigateToExtraPayment}
            className="bg-white rounded-xl p-3 shadow-sm border border-indigo-50 flex flex-col items-center hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-1">
              <Gift size={16} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Extra Payment</h3>
            <p className="text-xs text-gray-500 text-center">View Balances</p>
          </button>
        </div>
        
        {/* Pending Requests Button */}
        <button 
          className="bg-white rounded-xl p-3 shadow-sm border border-indigo-50 mb-3 w-full hover:shadow-md transition-shadow"
          onClick={navigateToPendingRequests}
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
          onClick={navigateToTransactionHistory}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800 text-sm">Transaction History</h3>
            <div className="flex items-center">
              <span className="text-indigo-600 text-xs">View All</span>
            </div>
          </div>
        </button>
      </main>
    </div>
  );
}

export default Dashboard;
