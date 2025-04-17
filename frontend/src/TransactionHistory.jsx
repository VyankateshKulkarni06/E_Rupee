import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Send, Download, Filter, Search, Calendar, CreditCard } from 'lucide-react';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedTransactionId, setSelectedTransactionId] = useState(null); // Track which transaction's details are shown

  const currentUser = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      setError("Authentication error: No token found");
      setLoading(false);
      return;
    }

    if (!currentUser) {
      console.error("No username found");
      setError("Authentication error: No username found");
      setLoading(false);
      return;
    }

    console.log("Fetching transactions for user:", currentUser);

    axios.get("https://e-rupee.onrender.com/getHistory", {
      headers: {
        "Content-Type": "application/json",
        "token": `Bearer ${token}`
      },
    })
      .then(res => {
        console.log("Transaction data received:", res.data);
        if (res.data && res.data.userResults) {
          setTransactions(res.data.userResults);
        } else {
          console.error("Unexpected data format:", res.data);
          setError("Received unexpected data format from server");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching transactions:", err);
        if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.data.message || "Unknown error"}`);
        } else if (err.request) {
          setError("No response received from server. Please check your connection.");
        } else {
          setError(`Error: ${err.message}`);
        }
        setLoading(false);
      });
  }, [currentUser]);

  // Format date and time
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch (e) {
      console.error("Date formatting error:", e);
      return "Invalid date";
    }
  };

  const isIncoming = (transaction) => transaction.receiver_username === currentUser;

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      (transaction.sender_username && transaction.sender_username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.receiver_username && transaction.receiver_username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.payment_id && transaction.payment_id.toString().includes(searchQuery));

    const matchesType =
      filterType === 'all' ||
      (filterType === 'sent' && transaction.sender_username === currentUser) ||
      (filterType === 'received' && transaction.receiver_username === currentUser) ||
      (filterType === transaction.type);

    return matchesSearch && matchesType;
  });

  // Toggle details visibility
  const toggleDetails = (payment_id) => {
    setSelectedTransactionId(selectedTransactionId === payment_id ? null : payment_id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sticky top-0 z-10">
        <div className="flex items-center">
          <button className="mr-3 text-indigo-600" onClick={() => window.history.back()}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Transaction History</h1>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="p-4 bg-white sticky top-16 z-10">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search by username or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${filterType === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setFilterType('all')}
          >
            <Filter size={12} className="mr-1" />
            All
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${filterType === 'sent' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setFilterType('sent')}
          >
            <Send size={12} className="mr-1" />
            Sent
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${filterType === 'received' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setFilterType('received')}
          >
            <Download size={12} className="mr-1" />
            Received
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${filterType === 'normal' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setFilterType('normal')}
          >
            <Send size={12} className="mr-1" />
            Normal
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${filterType === 'extra' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setFilterType('extra')}
          >
            <CreditCard size={12} className="mr-1" />
            Extra
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map(transaction => {
              const isIncomingTx = isIncoming(transaction);
              const formattedDateTime = formatDateTime(transaction.done_at);

              return (
                <div
                  key={transaction.payment_id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isIncomingTx ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Send
                          size={16}
                          className={isIncomingTx ? 'text-green-600 transform rotate-180' : 'text-red-600'}
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-800">
                            {isIncomingTx ? 'Received from' : 'Sent to'}
                          </span>
                          {transaction.type && (
                            <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded-full">
                              {transaction.type}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">
                          {isIncomingTx ? transaction.sender_username : transaction.receiver_username}
                        </p>
                      </div>
                    </div>
                    <div className={`text-right font-medium ${isIncomingTx ? 'text-green-600' : 'text-red-600'}`}>
                      {isIncomingTx ? '+' : '-'}₹{parseFloat(transaction.amount || 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <span className={`text-xs px-2 py-1 rounded-full ${transaction.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {transaction.status || 'pending'}
                    </span>
                    <button
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                      onClick={() => toggleDetails(transaction.payment_id)}
                    >
                      {selectedTransactionId === transaction.payment_id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                  {/* Details Section - Shown only when View Details is clicked */}
                  {selectedTransactionId === transaction.payment_id && (
                    <div className="mt-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {formattedDateTime}
                      </div>
                      <div className="mt-1">
                        ID: {transaction.payment_id}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;