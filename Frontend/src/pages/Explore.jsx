import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/favoritesSlice';
import axios from '../components/axios';
import Topbar from '../components/Topbar';

const Explore = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: favorites } = useSelector(state => state.favorites);
    const { isAuthenticated } = useSelector(state => state.auth);

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all'); // all | movie | tv
    const [sortBy, setSortBy] = useState('popularity.desc');
    const observerRef = useRef(null);
    const loaderRef = useRef(null);

    const fetchMovies = useCallback(async (pageNum, reset = false) => {
        if (loading || pageNum > totalPages) return;
        setLoading(true);
        try {
            let endpoint = '';
            if (filter === 'movie') {
                endpoint = `discover/movie?language=en-US&sort_by=${sortBy}&page=${pageNum}`;
            } else if (filter === 'tv') {
                endpoint = `discover/tv?language=en-US&sort_by=${sortBy}&page=${pageNum}`;
            } else {
                endpoint = `trending/all/week?language=en-US&page=${pageNum}`;
            }

            const { data } = await axios.get(endpoint);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            setMovies(prev => reset ? data.results : [...prev, ...data.results]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filter, sortBy, totalPages, loading]);

    // Filter/Sort change hone pe reset karo
    useEffect(() => {
        setMovies([]);
        setPage(1);
        setTotalPages(1);
        fetchMovies(1, true);
    }, [filter, sortBy]);

    // Infinite scroll - page change hone pe fetch karo
    useEffect(() => {
        if (page > 1) fetchMovies(page);
    }, [page]);

    // Intersection Observer setup
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) observerRef.current.observe(loaderRef.current);

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [loading]);

    const isFav = (id) => favorites?.find(f => f.movieId === String(id));

    // Skeleton Card
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-white">Explore</h1>

                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap">
                        {/* Type Filter */}
                        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                            {[
                                { label: 'All', value: 'all' },
                                { label: 'Movies', value: 'movie' },
                                { label: 'TV Shows', value: 'tv' },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setFilter(opt.value)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                                        filter === opt.value
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Sort Filter - sirf movie/tv pe show karo */}
                        {filter !== 'all' && (
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
                            >
                                <option value="popularity.desc">Most Popular</option>
                                <option value="vote_average.desc">Top Rated</option>
                                <option value="release_date.desc">Latest</option>
                                <option value="revenue.desc">Box Office</option>
                            </select>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                {movies.length > 0 && (
                    <p className="text-gray-500 text-sm mb-4">{movies.length} titles loaded</p>
                )}

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movies.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="group relative cursor-pointer"
                        >
                            <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
                                <img
                                    src={item.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                        : '/placeholder.jpg'}
                                    alt={item.title || item.name}
                                    onClick={() => navigate(`/movie/${item.media_type || (filter === 'tv' ? 'tv' : 'movie')}/${item.id}`)}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Hover Overlay */}
                                <div
                                    onClick={() => navigate(`/movie/${item.media_type || (filter === 'tv' ? 'tv' : 'movie')}/${item.id}`)}
                                    className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                    <div className="w-10 h-10 bg-purple-500/90 rounded-full flex items-center justify-center">
                                        <i className="ri-play-fill text-white" />
                                    </div>
                                </div>

                                {/* Rating Badge */}
                                {item.vote_average > 0 && (
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
                                        <span className={`text-xs font-semibold ${
                                            item.vote_average >= 7 ? 'text-green-400' : 
                                            item.vote_average >= 5 ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
                                            {item.vote_average.toFixed(1)}
                                        </span>
                                    </div>
                                )}

                                {/* Favorite Button */}
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
                                                media_type: item.media_type || (filter === 'tv' ? 'tv' : 'movie'),
                                            }));
                                        }}
                                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                    >
                                        <i className={`${isFav(item.id) ? 'ri-heart-fill text-pink-500' : 'ri-heart-line text-white'} text-sm`} />
                                    </button>
                                )}

                                {/* Media Type Badge */}
                                <div className="absolute bottom-2 right-2 bg-black/60 text-gray-300 text-xs px-2 py-0.5 rounded-full capitalize">
                                    {item.media_type || (filter === 'tv' ? 'TV' : 'Movie')}
                                </div>
                            </div>

                            <h3 className="text-white text-sm font-medium mt-2 truncate">{item.title || item.name}</h3>
                            <p className="text-gray-500 text-xs">
                                {(item.release_date || item.first_air_date)?.split('-')[0]}
                            </p>
                        </div>
                    ))}

                    {/* Skeleton loaders while loading */}
                    {loading && Array(12).fill(0).map((_, i) => (
                        <SkeletonCard key={`skeleton-${i}`} />
                    ))}
                </div>

                {/* Infinite Scroll Trigger */}
                <div ref={loaderRef} className="h-10 mt-4" />

                {/* End of results */}
                {page >= totalPages && movies.length > 0 && (
                    <p className="text-center text-gray-500 text-sm py-6">
                        Sab content load ho gaya! 🎬
                    </p>
                )}
            </div>
        </div>
    );
};

export default Explore;