import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopular, fetchTopRated } from "../store/movieSlice";
import { fetchHistory } from "../store/historySlice";
import { useNavigate } from 'react-router-dom';

const ContinueRow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { popular, topRated } = useSelector((state) => state.movie);
  const { items: history } = useSelector((state) => state.history);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPopular());
    dispatch(fetchTopRated());
    if (isAuthenticated) dispatch(fetchHistory());
  }, [dispatch, isAuthenticated]);

  // Skeleton loader
  if (popular.length === 0 && topRated.length === 0) {
    return (
      <div className="w-full px-4 md:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-medium">Popular Movies</h2>
        </div>
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="shrink-0 w-78 h-42 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-4">
      {/* Popular Movies */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-medium">Popular Movies</h2>
        <button onClick={() => navigate('/view-all/popular')} className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded transition border border-white/10 cursor-pointer">
          See All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide mb-8">
        {popular.slice(0, 10).map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/movie/movie/${item.id}`)}
            className="relative shrink-0 w-78 h-42 rounded-xl overflow-hidden group cursor-pointer"
          >
            <img
              src={
                item.backdrop_path
                  ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
                  : `https://image.tmdb.org/t/p/w500${item.poster_path}`
              }
              alt={item.title}
              className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-medium text-base mb-1 truncate">
                {item.title}
              </h3>
              <div className="flex items-center justify-between text-gray-300 text-xs mb-2">
                <span>{item.release_date?.split("-")[0]}</span>
                <span>⭐ {item.vote_average?.toFixed(1)}</span>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 bg-purple-400/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                <i className="ri-play-fill text-white text-2xl"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Rated (Replaced Recently Added) */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-medium">Top Rated</h2>
        <button onClick={() => navigate('/view-all/top-rated')} className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded transition border border-white/10 cursor-pointer">
          See All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {topRated.slice(0, 10).map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/movie/movie/${item.id}`)}
            className="relative shrink-0 w-48 h-72 rounded-xl overflow-hidden group cursor-pointer"
          >
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : "https://via.placeholder.com/500x750"
              }
              alt={item.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-white font-medium text-sm mb-1 truncate">
                {item.title}
              </h3>
              <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                ⭐ {item.vote_average?.toFixed(1)}
              </span>
            </div>
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 bg-purple-400/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                <i className="ri-play-fill text-white text-xl"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueRow;