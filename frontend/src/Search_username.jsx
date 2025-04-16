import { useState, useEffect, useCallback } from 'react';
import { Search, ArrowLeft, User, X } from 'lucide-react';
import { debounce } from 'lodash';

function SearchUsername() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Mock user data for demonstration
  const mockUsers = [
    { id: 1, username: 'kuldhar', fullName: 'Kuldhar Singh', email: 'kuldhar@example.com' },
    { id: 2, username: 'kulkarni', fullName: 'Priya Kulkarni', email: 'priya@example.com' },
    { id: 3, username: 'kumar123', fullName: 'Rahul Kumar', email: 'rahul@example.com' },
    { id: 4, username: 'karishma', fullName: 'Karishma Patel', email: 'karishma@example.com' },
    { id: 5, username: 'kiran22', fullName: 'Kiran Reddy', email: 'kiran@example.com' }
  ];

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (!query) {
        setUsers([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      // In a real app, this would be an API call
      // fetch(`/api/users?search=${query}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     setUsers(data);
      //     setLoading(false);
      //   })
      //   .catch(err => {
      //     setError('Failed to fetch users');
      //     setLoading(false);
      //   });
      
      // For demo purposes, we'll filter mock data
      setTimeout(() => {
        const filteredUsers = mockUsers.filter(user => 
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.fullName.toLowerCase().includes(query.toLowerCase())
        );
        setUsers(filteredUsers);
        setLoading(false);
      }, 500);
    }, 500), // 500ms delay
    []
  );
  
  useEffect(() => {
    debouncedSearch(searchQuery);
    
    // Cleanup function to cancel pending debounced calls when component unmounts
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);
  
  const clearSearch = () => {
    setSearchQuery('');
    setUsers([]);
  };
  
  const goBack = () => {
    // In a real app, this would navigate back
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
        <div className="flex items-center">
          <button onClick={goBack} className="mr-3">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Search Username</h1>
        </div>
      </header>
      
      {/* Search Box */}
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
      
      {/* Search Results */}
      <div className="px-4 py-2">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            {error}
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-1">
            {users.map(user => (
              <div 
                key={user.id}
                className="p-3 rounded-lg border border-gray-100 shadow-sm bg-white flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <User size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.fullName}</p>
                  </div>
                </div>
                <button className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
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
      
      {/* Recent Searches - You could add this feature */}
      {!searchQuery && users.length === 0 && (
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Recent Searches</h3>
          <div className="space-y-1">
            {['kumar123', 'kulkarni'].map((username, index) => (
              <div 
                key={index}
                className="p-2 flex items-center justify-between bg-gray-50 rounded-lg"
                onClick={() => setSearchQuery(username)}
              >
                <div className="flex items-center">
                  <Search size={14} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">{username}</span>
                </div>
                <X size={14} className="text-gray-400" onClick={(e) => {
                  e.stopPropagation();
                  // Remove from recent searches
                }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchUsername;