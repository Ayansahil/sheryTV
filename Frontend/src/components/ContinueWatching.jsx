import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchHistory, removeFromHistory } from "../store/historySlice";

const ContinueWatching = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { items } = useSelector((state) => state.history);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchHistory());
  }, [isAuthenticated]);

  // Login nahi hai toh hide karo
  if (!isAuthenticated || items.length === 0) return null;

  return (
    <div className="w-full px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        {isHomePage ? (
            <h2 className="text-white text-xl font-medium">Continue Watching</h2>
        ) : (
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-white transition cursor-pointer">
                    <i className="ri-arrow-left-line" />
                </button>
                <h2 className="text-white text-xl font-medium">Continue Watching</h2>
            </div>
        )}
        {isHomePage && (
            <button 
            onClick={() => navigate('/continue-watching')}
            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded transition border border-white/10 cursor-pointer">
            See All
            </button>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {items.slice(0, 10).map((item) => (
          <div
            key={item.movieId}
            onClick={() =>
              navigate(`/movie/${item.media_type || "movie"}/${item.movieId}`)
            }
            className="relative shrink-0 w-48 h-72 rounded-xl overflow-hidden group cursor-pointer"
          >
            <img
              src={
                item.poster
                  ? `https://image.tmdb.org/t/p/w500${item.poster}`
                  : "/placeholder.jpg"
              }
              alt={item.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {/* Remove Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeFromHistory(item.movieId));
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
            >
                <i className="ri-close-line text-white text-lg" />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white font-medium text-sm truncate">
                {item.title}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                {new Date(item.watchedAt).toLocaleDateString()}
              </p>
              {/* Progress bar */}
              <div className="w-full h-1 bg-white/20 rounded-full mt-2">
                <div className="h-full bg-purple-500 rounded-full w-1/2" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 bg-purple-500/90 rounded-full flex items-center justify-center">
                <i className="ri-play-fill text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
