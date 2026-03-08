import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { searchMulti, clearSearch } from '../store/movieSlice';

const Topbar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { searchResults, status } = useSelector((state) => state.movie);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        dispatch(searchMulti(query));
      } else {
        dispatch(clearSearch());
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  return (
    <div className="flex items-center justify-between w-full px-8 py-4 bg-[#1A1625] relative z-50">
      {/* Search Bar */}
      <div className="relative flex items-center gap-3 bg-[#2A2238] rounded-2xl border border-white/20 px-5 py-3 w-125">
        <i className="ri-search-line text-gray-400 text-lg"></i>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for films, directors, or actors..."
          className="bg-transparent text-gray-300 text-sm outline-none w-full placeholder:text-gray-500"
        />

        {/* Search Results Dropdown */}
        {query && (
          <div className="absolute top-full left-0 w-full mt-2 bg-[#2A2238] rounded-xl border border-white/10 shadow-xl max-h-96 overflow-y-auto z-50">
            {status === 'loading' && <div className="p-4 text-gray-400 text-center">Loading...</div>}
            
            {status === 'succeeded' && searchResults.length > 0 && (
              <ul>
                {searchResults.map((item) => (
                  <li key={item.id} className="hover:bg-white/5 transition border-b border-white/5 last:border-none">
                    <Link 
                      to={`/${item.media_type}/${item.id}`} 
                      className="flex items-center gap-3 p-3"
                      onClick={() => setQuery('')} // Close dropdown on click
                    >
                      <img 
                        src={item.poster_path || item.profile_path ? `https://image.tmdb.org/t/p/w92${item.poster_path || item.profile_path}` : 'https://via.placeholder.com/92x138?text=No+Image'} 
                        alt={item.title || item.name} 
                        className="w-10 h-14 object-cover rounded bg-gray-800"
                      />
                      <div>
                        <h4 className="text-white text-sm font-medium">{item.title || item.name}</h4>
                        <p className="text-gray-400 text-xs capitalize mt-1">
                          {item.media_type} {item.release_date ? `• ${item.release_date.split('-')[0]}` : ''}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {status === 'succeeded' && searchResults.length === 0 && (
              <div className="p-4 text-gray-400 text-center">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Right Side - Notification & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-white/5 rounded-full transition">
          <i className="ri-notification-3-line text-gray-300 text-xl"></i>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Picture */}
        <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400 ">
          <img
            src="https://plus.unsplash.com/premium_photo-1664015982598-283bcdc9cae8?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  );
};

export default Topbar