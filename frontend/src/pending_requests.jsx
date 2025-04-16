import { useEffect, useState } from 'react';
import {
  Clock, CheckCircle, XCircle, DollarSign, User, CreditCard, ArrowRight
} from 'lucide-react';

export default function PendingRequestsPage() {
  const [data, setData] = useState({ userResults: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch pending requests
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching pending requests with token:', token);
        
        const response = await fetch('http://localhost:5001/getPending', {
          headers: {
            'token': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          let errorText;
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorText = errorData.message || `Server error: ${response.status}`;
          } else {
            errorText = await response.text();
            console.error('Non-JSON response:', errorText.slice(0, 100)); // Log first 100 chars
            errorText = `Server error: ${response.status} (Unexpected response format)`;
          }
          throw new Error(errorText);
        }

        const result = await response.json();
        console.log('Received data:', result);
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const handleRequestAction = async (pending_id, status) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5001/transact/pending_request', {
        method: 'PUT', // Changed to PUT to match backend route
        headers: {
          'Content-Type': 'application/json',
          'token': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pending_id,
          status // 'a' for approve, 'r' for reject
        }),
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage;
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || `Failed to process request: ${response.status}`;
        } else {
          const errorText = await response.text();
          console.error('Non-JSON response:', errorText.slice(0, 100)); // Log first 100 chars
          errorMessage = `Server error: ${response.status} (Unexpected response format)`;
        }
        throw new Error(errorMessage);
      }
      
      // Update the local state to reflect the new status
      const updatedData = {
        ...data,
        userResults: data.userResults.map(req => 
          req.pending_id === pending_id ? { ...req, status: status === 'a' ? 'c' : 'r' } : req
        )
      };
      setData(updatedData);
      
    } catch (err) {
      console.error('Error processing request:', err);
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
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

          {loading ? (
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center border border-indigo-50">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-100 rounded-2xl shadow-xl p-6 text-center border border-red-200">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : data.userResults.length === 0 ? (
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
                          <div className="text-gray-700">{request.purpose || 'Not specified'}</div>
                        </div>

                        <div className="text-sm text-gray-500">
                          Original sender: <span className="font-medium text-gray-700">{request.original_sender}</span>
                        </div>
                      </div>
                    </div>

                    {request.status === 'a' && (
                      <div className="bg-indigo-50 px-5 py-4 flex justify-end space-x-3">
                        <button
                          onClick={() => handleRequestAction(request.pending_id, 'r')}
                          className="px-4 py-2 border border-indigo-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-white transition-all duration-200"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.pending_id, 'a')}
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