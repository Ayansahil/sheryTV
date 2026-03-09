import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../components/axios';
import Topbar from '../components/Topbar';

const GENRE_ICONS = {
    28: 'ri-sword-line',
    12: 'ri-map-2-line',
    16: 'ri-bear-smile-line',
    35: 'ri-emotion-laugh-line',
    80: 'ri-police-car-line',
    99: 'ri-camera-lens-line',
    18: 'ri-heart-line',
    10751: 'ri-home-heart-line',
    14: 'ri-magic-line',
    36: 'ri-time-line',
    27: 'ri-skull-line',
    10402: 'ri-music-line',
    9648: 'ri-eye-line',
    10749: 'ri-heart-2-line',
    878: 'ri-rocket-line',
    10770: 'ri-tv-line',
    53: 'ri-knife-line',
    10752: 'ri-shield-line',
    37: 'ri-riding-line',
};

const GENRE_COLORS = [
    'from-purple-600/40 to-purple-900/40 border-purple-500/30',
    'from-blue-600/40 to-blue-900/40 border-blue-500/30',
    'from-pink-600/40 to-pink-900/40 border-pink-500/30',
    'from-orange-600/40 to-orange-900/40 border-orange-500/30',
    'from-green-600/40 to-green-900/40 border-green-500/30',
    'from-red-600/40 to-red-900/40 border-red-500/30',
    'from-yellow-600/40 to-yellow-900/40 border-yellow-500/30',
    'from-cyan-600/40 to-cyan-900/40 border-cyan-500/30',
];

const Genres = () => {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('movie');
    const loaderRef = useRef(null);
    const isFetchingRef = useRef(false);

    // Fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const [movieRes, tvRes] = await Promise.all([
                    axios.get('genre/movie/list?language=en-US'),
                    axios.get('genre/tv/list?language=en-US'),
                ]);
                const combined = [...movieRes.data.genres];
                tvRes.data.genres.forEach(g => {
                    if (!combined.find(m => m.id === g.id)) combined.push(g);
                });
                setGenres(combined);
            } catch (err) { console.error(err); }
        };
        fetchGenres();
    }, []);

    const fetchByGenre = useCallback(async (pageNum, reset = false) => {
        if (isFetchingRef.current || !selectedGenre) return;
        isFetchingRef.current = true;
        setLoading(true);
        try {
            const { data } = await axios.get(
                `discover/${type}?with_genres=${selectedGenre.id}&language=en-US&sort_by=popularity.desc&page=${pageNum}`
            );
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            setMovies(prev => reset ? data.results : [...prev, ...data.results]);
        } catch (err) { console.error(err); }
        finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [selectedGenre, type]);

    useEffect(() => {
        if (selectedGenre) {
            setMovies([]);
            setPage(1);
            fetchByGenre(1, true);
        }
    }, [selectedGenre, type]);

    useEffect(() => {
        if (page > 1) fetchByGenre(page);
    }, [page]);

    // Infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingRef.current && page < totalPages) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [page, totalPages]);

    return (
        <div className="min-h-screen bg-[#1A1625]">
            <Topbar />
            <div className="px-4 sm:px-8 py-6">
                <h1 className="text-2xl font-bold text-white mb-6">Genres</h1>

                {/* Genre Grid */}
                {!selectedGenre && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3">
                        {genres.map((genre, i) => (
                            <button
                                key={genre.id}
                                onClick={() => setSelectedGenre(genre)}
                                className={`relative bg-gradient-to-br ${GENRE_COLORS[i % GENRE_COLORS.length]} border rounded-2xl p-4 sm:p-5 text-left hover:scale-105 transition-transform duration-200 group`}
                            >
                                <i className={`${GENRE_ICONS[genre.id] || 'ri-film-line'} text-2xl text-white/70 mb-3 block`} />
                                <p className="text-white font-medium text-sm sm:text-base">{genre.name}</p>
                                <i className="ri-arrow-right-line absolute bottom-4 right-4 text-white/40 group-hover:text-white/80 transition-colors" />
                            </button>
                        ))}

                        {genres.length === 0 && Array(12).fill(0).map((_, i) => (
                            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Selected Genre Movies */}
                {selectedGenre && (
                    <div>
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => { setSelectedGenre(null); setMovies([]); }}
                                    className="w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-white transition"
                                >
                                    <i className="ri-arrow-left-line" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedGenre.name}</h2>
                                    {movies.length > 0 && (
                                        <p className="text-gray-500 text-xs">{movies.length} titles loaded</p>
                                    )}
                                </div>
                            </div>

                            {/* Movie / TV Toggle */}
                            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1 w-fit">
                                {['movie', 'tv'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                                            type === t ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {t === 'movie' ? 'Movies' : 'TV Shows'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Movies Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                            {movies.map((item, index) => (
                                <div
                                    key={`${item.id}-${index}`}
                                    onClick={() => navigate(`/movie/${type}/${item.id}`)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
                                        <img
                                            src={item.poster_path
                                                ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title || item.name)}&background=2d1b69&color=fff&size=300`}
                                            alt={item.title || item.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-10 h-10 bg-purple-500/90 rounded-full flex items-center justify-center">
                                                <i className="ri-play-fill text-white" />
                                            </div>
                                        </div>
                                        {item.vote_average > 0 && (
                                            <div className="absolute top-2 left-2 bg-black/70 text-yellow-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <i className="ri-star-fill text-xs" />
                                                {item.vote_average.toFixed(1)}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-300 text-sm mt-2 truncate">{item.title || item.name}</p>
                                    <p className="text-gray-500 text-xs">
                                        {(item.release_date || item.first_air_date)?.split('-')[0]}
                                    </p>
                                </div>
                            ))}

                            {loading && Array(12).fill(0).map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="w-full aspect-[2/3] bg-white/5 rounded-xl mb-2" />
                                    <div className="h-3 bg-white/5 rounded w-3/4 mb-1" />
                                    <div className="h-3 bg-white/5 rounded w-1/2" />
                                </div>
                            ))}
                        </div>

                        <div ref={loaderRef} className="h-10 mt-4" />

                        {page >= totalPages && movies.length > 0 && (
                            <p className="text-center text-gray-500 text-sm py-6">You've reached the end! 🎬</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Genres;