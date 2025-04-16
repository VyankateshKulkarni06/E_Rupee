import { useState } from 'react';
import { Clock, CheckCircle, XCircle, DollarSign, User, CreditCard, ArrowRight } from 'lucide-react';

export default function PendingRequestsPage() {
  // Mock data based on what you provided
  const [data, setData] = useState({
    userResults: [
      {
        pending_id: 1,
        requester_username: "kulkarni",
        receiver_username: "kuldhar",
        amount: "10.00",
        purpose: "purchase of kuldhar",
        status: "a",
        created_at: "2025-04-15T12:33:11.000Z",
        original_sender: "kuldhar",
        bal_id: 1
      }
    ]
  });

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get status details
  const getStatusDetails = (status) => {
    switch (status) {
      case 'a':
        return {
          text: 'Active',
          icon: <Clock className="text-indigo-400" size={20} />,
          color: 'bg-indigo-50 text-indigo-600'
        };
      case 'c':
        return {
          text: 'Completed',
          icon: <CheckCircle className="text-green-500" size={20} />,
          color: 'bg-green-50 text-green-600'
        };
      case 'r':
        return {
          text: 'Rejected',
          icon: <XCircle className="text-red-500" size={20} />,
          color: 'bg-red-50 text-red-600'
        };
      default:
        return {
          text: 'Unknown',
          icon: <Clock className="text-gray-500" size={20} />,
          color: 'bg-gray-100 text-gray-700'
        };
    }
  };

  // Functions to handle request actions
  const handleApprove = (id) => {
    console.log(`Approved request ${id}`);
    // Here you would call your API to update the request status
  };

  const handleReject = (id) => {
    console.log(`Rejected request ${id}`);
    // Here you would call your API to update the request status
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
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-700 mb-6 flex items-center">
            <Clock size={24} className="text-indigo-500 mr-2" />
            Pending Requests
          </h1>
          
          {data.userResults.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center border border-indigo-50">
              <p className="text-gray-500">No pending requests found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.userResults.map((request) => {
                const statusDetails = getStatusDetails(request.status);
                
                return (
                  <div key={request.pending_id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-50">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusDetails.color}`}>
                            {statusDetails.icon}
                            <span className="ml-1">{statusDetails.text}</span>
                          </span>
                          <span className="ml-3 text-sm text-gray-500">
                            ID: {request.pending_id}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(request.created_at)}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <User className="text-indigo-400 mr-2" size={18} />
                          <div>
                            <div className="text-sm text-gray-500">From</div>
                            <div className="font-medium text-gray-700">{request.requester_username}</div>
                          </div>
                          <div className="mx-4">
                            <ArrowRight className="text-indigo-300" size={18} />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">To</div>
                            <div className="font-medium text-gray-700">{request.receiver_username}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <DollarSign className="text-indigo-400 mr-2" size={18} />
                          <div>
                            <div className="text-sm text-gray-500">Amount</div>
                            <div className="font-medium text-indigo-600">₹{request.amount}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500">Purpose</div>
                          <div className="text-gray-700">{request.purpose}</div>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          Original sender: <span className="font-medium text-gray-700">{request.original_sender}</span>
                        </div>
                      </div>
                    </div>
                    
                    {request.status === 'a' && (
                      <div className="bg-indigo-50 px-5 py-4 flex justify-end space-x-3">
                        <button 
                          onClick={() => handleReject(request.pending_id)}
                          className="px-4 py-2 border border-indigo-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-white transition-all duration-200"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleApprove(request.pending_id)}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Security Badge */}
          <div className="mt-6 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-indigo-50">
            <div className="flex items-center justify-center">
              <Clock size={16} className="text-indigo-500 mr-2" />
              <span className="text-gray-600 text-sm">
                Pending requests are automatically processed within 24 hours
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}