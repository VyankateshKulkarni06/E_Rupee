import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Download, Filter, Search, Calendar, CreditCard } from 'lucide-react';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Mock data for demonstration, in real app this would be fetched
  const mockData = {
    "userResults": [
      {
        "payment_id": 1001,
        "sender_username": "kuldhar",
        "receiver_username": "kulkarni",
        "done_at": "2025-04-15T12:29:59.000Z",
        "amount": "50.00",
        "status_first": "a",
        "status": "done",
        "type": "extra",
        "bal_id": 1
      },
      {
        "payment_id": 1002,
        "sender_username": "kulkarni",
        "receiver_username": "kuldhar",
        "done_at": "2025-04-15T12:37:06.000Z",
        "amount": "10.00",
        "status_first": "a",
        "status": "done",
        "type": "normal",
        "bal_id": 1
      }
    ]
  };
  
  // Simulate API fetch
  useEffect(() => {
    // In a real app, replace with actual API call:
    // fetch('/api/transactions')
    //   .then(res => res.json())
    //   .then(data => {
    //     setTransactions(data.userResults);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error('Error fetching transactions:', err);
    //     setLoading(false);
    //   });
    
    // For demonstration, use mock data with a small delay
    setTimeout(() => {
      setTransactions(mockData.userResults);
      setLoading(false);
    }, 500);
  }, []);
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Used to check if the user is the sender
  const currentUser = "kulkarni"; // In a real app, this would come from auth context
  
  // Filter transactions based on search query and type filter
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.sender_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.receiver_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.payment_id.toString().includes(searchQuery);
      
    const matchesType = 
      filterType === 'all' || 
      (filterType === 'sent' && transaction.sender_username === currentUser) ||
      (filterType === 'received' && transaction.receiver_username === currentUser) ||
      (filterType === transaction.type);
      
    return matchesSearch && matchesType;
  });
  
  // Determine if transaction is incoming or outgoing for current user
  const isIncoming = (transaction) => transaction.receiver_username === currentUser;

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
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map(transaction => {
              const isIncomingTx = isIncoming(transaction);
              
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
                          <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded-full">
                            {transaction.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">
                          {isIncomingTx ? transaction.sender_username : transaction.receiver_username}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(transaction.done_at)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {transaction.payment_id}
                        </div>
                      </div>
                    </div>
                    <div className={`text-right font-medium ${isIncomingTx ? 'text-green-600' : 'text-red-600'}`}>
                      {isIncomingTx ? '+' : '-'}₹{parseFloat(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <span className={`text-xs px-2 py-1 rounded-full ${transaction.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {transaction.status}
                    </span>
                    <button className="text-xs text-indigo-600 hover:text-indigo-800">
                      View Details
                    </button>
                  </div>
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