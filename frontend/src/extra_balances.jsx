import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, CreditCard } from 'lucide-react';

function ExtraBalances() {
  const [extraBalances, setExtraBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication error: No token found");
      setLoading(false);
      return;
    }

    axios.get("http://localhost:5001/getBalance/Extra", {
      headers: {
        token: `Bearer ${token}`
      },
    })
    .then(res => {
      if (res.data.extraBalance) {
        setExtraBalances(res.data.extraBalance);
        console.log(res.data);
      } else {
        setError("Unexpected data format from server");
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching extra balances:", err);
      setError("Failed to fetch extra balances");
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sticky top-0 z-10">
        <div className="flex items-center">
          <button className="mr-3 text-indigo-600" onClick={() => window.history.back()}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Extra Balances</h1>
        </div>
      </header>

      {/* Content */}
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
        ) : extraBalances.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No extra balances found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {extraBalances.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <CreditCard size={16} className="text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-700 font-medium">
                        From: {item.sender_username}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Purpose: {item.purpose || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-yellow-600">
                    +₹{parseFloat(item.amount || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExtraBalances;
