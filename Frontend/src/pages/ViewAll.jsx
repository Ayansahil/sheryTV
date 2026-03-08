import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/favoritesSlice';
import axios from '../components/axios';
import Topbar from '../components/Topbar';

const CATEGORY_CONFIG = {
    trending: { title: 'Trending', endpoint: (page) => `trending/all/day?language=en-US&page=${page}` },
    popular: { title: 'Popular Movies', endpoint: (page) => `movie/popular?language=en-US&page=${page}` },
    'recently-added': { title: 'Recently Added', endpoint: (page) => `movie/now_playing?language=en-US&page=${page}` },
    'top-rated': { title: 'Top Rated', endpoint: (page) => `movie/top_rated?language=en-US&page=${page}` },
    'tv-shows': { title: 'TV Shows', endpoint: (page) => `tv/popular?language=en-US&page=${page}` },
};

const ViewAll = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: favorites } = useSelector(state => state.favorites);
    const { isAuthenticated } = useSelector(state => state.auth);

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);
    const observerRef = useRef(null);
    const isFetchingRef = useRef(false);

    const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['popular'];

    const fetchMovies = useCallback(async (pageNum) => {
        if (isFetchingRef.current || pageNum > totalPages) return;
        isFetchingRef.current = true;
        setLoading(true);
        try {
            const { data } = await axios.get(config.endpoint(pageNum));
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            setMovies(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [category, totalPages]);

    // Initial load
    useEffect(() => {
        setMovies([]);
        setPage(1);
        setTotalPages(1);
        fetchMovies(1);
    }, [category]);

    // Page change pe fetch
    useEffect(() => {
        if (page > 1) fetchMovies(page);
    }, [page]);

    // Intersection Observer
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingRef.current && page < totalPages) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );
        if (loaderRef.current) observerRef.current.observe(loaderRef.current);
        return () => observerRef.current?.disconnect();
    }, [page, totalPages]);

    const isFav = (id) => favorites?.find(f => f.movieId === String(id));

    const getMediaType = (item) => item.media_type || (category === 'tv-shows' ? 'tv' : 'movie');

    const SkeletonCard = () => (
        <div className="animate-pulse">
            <div className="w-full aspect-[2/3] bg-white/5 rounded-xl mb-2" />
            <div className="h-3 bg-white/5 rounded w-3/4 mb-1" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#1A1625]">
            <Topbar />
            <div className="px-8 py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-white transition cursor-pointer"
                    >
                        <i className="ri-arrow-left-line" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{config.title}</h1>
                        {movies.length > 0 && (
                            <p className="text-gray-500 text-sm mt-0.5">{movies.length} titles loaded</p>
                        )}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movies.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="group relative cursor-pointer">
                            <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
                                <img
                                    src={item.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                        : '/placeholder.jpg'}
                                    alt={item.title || item.name}
                                    onClick={() => navigate(`/movie/${getMediaType(item)}/${item.id}`)}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Hover overlay */}
                                <div
                                    onClick={() => navigate(`/movie/${getMediaType(item)}/${item.id}`)}
                                    className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                    <div className="w-10 h-10 bg-purple-500/90 rounded-full flex items-center justify-center">
                                        <i className="ri-play-fill text-white" />
                                    </div>
                                </div>

                                {/* Rating */}
                                {item.vote_average > 0 && (
                                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur text-yellow-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <i className="ri-star-fill text-xs" />
                                        {item.vote_average.toFixed(1)}
                                    </div>
                                )}

                                {/* Favorite */}
                                {isAuthenticated && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(toggleFavorite({
                                                movieId: String(item.id),
                                                title: item.title || item.name,
                                                poster: item.poster_path,
                                                releaseYear: (item.release_date || item.first_air_date)?.split('-')[0],
                                                genre: '',
                                                rating: item.vote_average,
                                                media_type: getMediaType(item),
                                            }));
                                        }}
                                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                    >
                                        <i className={`${isFav(item.id) ? 'ri-heart-fill text-pink-500' : 'ri-heart-line text-white'} text-sm`} />
                                    </button>
                                )}
                            </div>

                            <p className="text-gray-300 text-sm mt-2 truncate">{item.title || item.name}</p>
                            <p className="text-gray-500 text-xs">
                                {(item.release_date || item.first_air_date)?.split('-')[0]}
                            </p>
                        </div>
                    ))}

                    {loading && Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>

                {/* Infinite scroll trigger */}
                <div ref={loaderRef} className="h-10 mt-4" />

                {page >= totalPages && movies.length > 0 && (
                    <p className="text-center text-gray-500 text-sm py-6">Sab content load ho gaya! 🎬</p>
                )}
            </div>
        </div>
    );
};

export default ViewAll;