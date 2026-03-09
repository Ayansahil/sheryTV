import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFavorites, toggleFavorite } from "../store/favoritesSlice";
import Topbar from "../components/Topbar";

const Favourites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchFavorites());
  }, [isAuthenticated]);

  if (!isAuthenticated)
    return (
      <div className="min-h-screen bg-[#1A1625] flex flex-col items-center justify-center text-white">
        <i className="ri-heart-line text-6xl text-purple-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Login to View Favorites</h2>
        <p className="text-gray-400 mb-6 text-center max-w-xs">
          Please log in to see your favorite movies and TV shows.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl transition cursor-pointer"
        >
          Login / Register
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#1A1625]">
      <Topbar />
      <div className="px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-white transition cursor-pointer">
            <i className="ri-arrow-left-line" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            My Favourites ({items.length})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <i className="ri-heart-line text-6xl text-purple-400/50 mb-4" />
            <p className="text-gray-400 text-lg">You have no favorites yet.</p>
            <p className="text-gray-500 text-sm mt-1">
              Press the heart icon on movies to add them.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl transition cursor-pointer"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4">
            {items.map((item) => (
              <div key={item.movieId} className="group relative cursor-pointer">
                <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
                  <img
                    src={
                      item.poster
                        ? `https://image.tmdb.org/t/p/w300${item.poster}`
                        : "/placeholder.jpg"
                    }
                    alt={item.title}
                    onClick={() =>
                      navigate(
                        `/movie/${item.media_type || "movie"}/${item.movieId}`,
                      )
                    }
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {/* Remove button */}
                  <button
                    onClick={() =>
                      dispatch(toggleFavorite({ movieId: item.movieId }))
                    }
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <i className="ri-heart-fill text-pink-400 text-sm" />
                  </button>
                </div>
                <p className="text-gray-300 text-sm mt-2 truncate">
                  {item.title}
                </p>
                <p className="text-gray-500 text-xs capitalize">
                  {item.media_type}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;
