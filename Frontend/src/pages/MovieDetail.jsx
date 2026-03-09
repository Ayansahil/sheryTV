import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../components/axios";
import { saveToHistory } from "../store/historySlice";
import { toast } from 'react-toastify';
import { toggleFavorite, fetchFavorites } from "../store/favoritesSlice";

const MovieDetail = () => {
  const { id, type } = useParams(); // /movie/:type/:id
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: favorites } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);

  const isFav = favorites?.find((f) => f.movieId === String(id));

  useEffect(() => {
    if (type === 'person') {
      navigate(`/people/${id}`, { replace: true });
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [detailRes, videoRes, similarRes, creditsRes] = await Promise.all([
          axios.get(`${type}/${id}?language=en-US`),
          axios.get(`${type}/${id}/videos?language=en-US`),
          axios.get(`${type}/${id}/similar?language=en-US&page=1`),
          axios.get(`${type}/${id}/credits?language=en-US`),
        ]);

        setMovie(detailRes.data);
        setSimilar(similarRes.data.results?.slice(0, 10) || []);
        setCast(creditsRes.data.cast?.slice(0, 10) || []);

        const trailerVideo = videoRes.data.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube",
        );
        setTrailer(trailerVideo || null);

        // Save to history automatically
        if (isAuthenticated) {
          dispatch(
            saveToHistory({
              movieId: String(detailRes.data.id),
              title: detailRes.data.title || detailRes.data.name,
              poster: detailRes.data.poster_path,
              releaseYear: (
                detailRes.data.release_date || detailRes.data.first_air_date
              )?.split("-")[0],
              genre: detailRes.data.genres?.[0]?.name || "",
              rating: detailRes.data.vote_average,
              media_type: type,
            }),
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    if (isAuthenticated) dispatch(fetchFavorites());
  }, [id, type, isAuthenticated, navigate]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#1A1625] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div className="min-h-screen bg-[#1A1625] text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-8 z-50 flex items-center gap-2 bg-black/50 backdrop-blur px-4 py-2 rounded-lg hover:bg-black/70 transition cursor-pointer"
      >
        <i className="ri-arrow-left-line" /> Back
      </button>

      {/* Hero Backdrop */}
      <div className="relative h-[60vh]">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1625] via-[#1A1625]/60 to-transparent" />

        {/* Movie Info Overlay */}_
        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 flex gap-6 items-end">
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-32 rounded-xl shadow-2xl hidden md:block"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              {movie.title || movie.name}
            </h1>
            <div className="flex gap-3 flex-wrap mb-3">
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                {(movie.release_date || movie.first_air_date)?.split("-")[0]}
              </span>
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="bg-purple-500/30 border border-purple-500/40 px-3 py-1 rounded-full text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <p className="text-gray-300 max-w-2xl line-clamp-2 text-sm md:text-base">
              {movie.overview}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 md:px-8 py-6 flex gap-3 flex-wrap">
        {/* Trailer Button */}
        <button
          onClick={() => (trailer ? setShowTrailer(true) : null)}
          className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium transition cursor-pointer ${
            trailer
              ? "bg-purple-600 hover:bg-purple-500"
              : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          <i className="ri-play-fill" />
          {trailer ? "Watch Trailer" : "Trailer Unavailable"}
        </button>

        {/* Favorite Button */}
        {isAuthenticated && (
          <button
            onClick={() => {
                if (!isFav) {
                    toast.success(`Added "${movie.title || movie.name}" to favorites!`);
                }
                dispatch(
                    toggleFavorite({
                        movieId: String(movie.id),
                        title: movie.title || movie.name,
                        poster: movie.poster_path,
                        releaseYear: (
                            movie.release_date || movie.first_air_date
                        )?.split("-")[0],
                        genre: movie.genres?.[0]?.name || "",
                        rating: movie.vote_average,
                        media_type: type,
                    })
                )}
            }
            className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium transition border cursor-pointer ${
              isFav
                ? "bg-pink-500/20 border-pink-500/50 text-pink-400"
                : "bg-white/10 border-white/20 hover:bg-white/20"
            }`}
          >
            <i className={isFav ? "ri-heart-fill" : "ri-heart-line"} />
            {isFav ? "Saved" : "Add to Favorites"}
          </button>
        )}
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <div className="px-4 md:px-8 pb-8">
          <h2 className="text-xl font-medium mb-4">Cast</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {cast.map((person) => (
              <div
                key={person.id}
                onClick={() => navigate(`/people/${person.id}`)}
                className="shrink-0 w-32 cursor-pointer group"
              >
                <div className="relative rounded-full overflow-hidden w-24 h-24 mx-auto mb-2 border-2 border-transparent group-hover:border-purple-500 transition-colors">
                  <img
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                        : `https://ui-avatars.com/api/?name=${person.name}&background=random`
                    }
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <p className="text-sm text-center font-medium truncate text-white group-hover:text-purple-400 transition-colors">
                  {person.name}
                </p>
                <p className="text-xs text-center text-gray-400 truncate">
                  {person.character}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies */}
      {similar.length > 0 && (
        <div className="px-4 md:px-8 pb-8">
          <h2 className="text-xl font-medium mb-4">Similar</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {similar.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/movie/${type}/${item.id}`)}
                className="shrink-0 w-40 cursor-pointer group"
              >
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                      : "/placeholder.jpg"
                  }
                  alt={item.title}
                  className="w-full h-56 object-cover rounded-xl group-hover:ring-2 ring-purple-500 transition"
                />
                <p className="text-sm mt-2 truncate text-gray-300">
                  {item.title || item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-purple-400 cursor-pointer"
            >
              <i className="ri-close-line" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full rounded-xl"
              allowFullScreen
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
