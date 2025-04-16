import { useState, useEffect, useCallback } from 'react';
import { Search, ArrowLeft, User, X } from 'lucide-react';
import { debounce } from 'lodash';

function SearchUsername() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (!query) {
        setUsers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      fetch(`http://localhost:5001/transact/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ username: query }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('No users found');
          return res.json();
        })
        .then((data) => {
          setUsers(data.users || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to fetch users');
          setLoading(false);
        });
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const clearSearch = () => {
    setSearchQuery('');
    setUsers([]);
  };

  const goBack = () => {
    window.history.back();
  };
  
  // New function to handle user selection
  const selectUser = (username) => {
    // Store the selected username in localStorage
    localStorage.setItem('receiver_username', username);
    
    // Navigate to the payment gateway page
    window.location.href = '/payment';
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
        <div className="flex items-center">
          <button onClick={goBack} className="mr-3">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Search Username</h1>
        </div>
      </header>

      <div className="px-4 py-3 sticky top-0 bg-white shadow-sm z-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-2.5 bg-gray-100 text-gray-900 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by username"
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={clearSearch}
            >
              <X size={18} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-2">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : users.length > 0 ? (
          <div className="space-y-2">
            {users.map((user, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-100 shadow-sm bg-white flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <User size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user.user_name}</p>
                    <p className="text-xs text-gray-500">{user.name}</p>
                  </div>
                </div>
                <button 
                  className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium"
                  onClick={() => selectUser(user.user_name)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-8 text-gray-500">
            No users found matching "{searchQuery}"
          </div>
        ) : (
          <div className="py-8">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Search size={48} className="text-gray-300" />
              </div>
              <p className="text-gray-500">Search for a username to send money or view their profile</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchUsername;