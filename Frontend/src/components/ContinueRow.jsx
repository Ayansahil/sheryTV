import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopular } from "../store/movieSlice";

const ContinueRow = () => {
  const dispatch = useDispatch();
  const { popular } = useSelector((state) => state.movie);

  useEffect(() => {
    dispatch(fetchPopular());
  }, []);

  // Skeleton loader
  if (popular.length === 0) {
    return (
      <div className="w-full px-8 py-4">
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
    <div className="w-full px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-medium">Popular Movies</h2>
        <button className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded transition border border-white/10">
          See All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {popular.slice(0, 10).map((item) => (
          <div
            key={item.id}
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

              {/* Progress bar - random for now, backend se aayega baad mein */}
              <div className="w-full h-1 bg-white/20 rounded-xl overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.floor(Math.random() * 80) + 10}%` }}
                />
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
    </div>
  );
};

export default ContinueRow;