import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrending } from "../store/movieSlice";

const HeroSection = () => {
  const dispatch = useDispatch();
  const { trending } = useSelector((state) => state.movie);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    dispatch(fetchTrending());
  }, []);

  // Auto-rotate har 5 seconds
  useEffect(() => {
    if (trending.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.min(trending.length, 5));
    }, 5000);
    return () => clearInterval(timer);
  }, [trending]);

  const movie = trending[current];

  if (!movie) return (
    <div className="h-127 mx-8 my-2 rounded-xl bg-white/5 animate-pulse" />
  );

  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://wallpapercave.com/wp/wp1890607.jpg";

  return (
    <div className="relative h-127 mx-8 my-2 rounded-xl border border-white/20 overflow-hidden">
      <img
        key={movie.id}
        src={imageUrl}
        alt={movie.title || movie.name}
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent"></div>

      <div className="relative z-10 h-full flex flex-col justify-between p-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-1 mb-2">
            <i className="ri-fire-fill text-orange-500"></i>
            <span className="text-white text-sm font-medium">Now Trending</span>
          </div>

          <div className="flex gap-2 mb-6">
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
              {movie.media_type === "tv" ? "TV Show" : "Movie"}
            </span>
            {movie.vote_average && (
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          <h1 className="text-5xl font-normal text-white mb-2 mt-18 max-w-xl">
            {movie.title || movie.name}
          </h1>

          <p className="text-gray-300 text-base max-w-lg leading-relaxed mb-12 line-clamp-3">
            {movie.overview || "No description available."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#9e72e0] hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-medium transition cursor-pointer">
            <i className="ri-play-fill text-lg"></i>
            Watch Now
          </button>
          <button className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition border border-white/20 cursor-pointer">
            <i className="ri-download-line text-white text-lg"></i>
          </button>
          <button className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition border border-white/20 cursor-pointer">
            <i className="ri-more-fill text-white text-lg"></i>
          </button>
        </div>

        {/* Dots - click karke switch karo */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          {trending.slice(0, 5).map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                i === current ? "bg-white w-4" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;