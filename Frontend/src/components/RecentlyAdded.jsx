import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchNowPlaying } from '../store/movieSlice';

const RecentlyAdded = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const { nowPlaying } = useSelector(state => state.movie);

    useEffect(() => {
        dispatch(fetchNowPlaying());
    }, []);

    if (nowPlaying.length === 0) {
        return (
            <div className="w-full px-8 py-4">
                <h2 className="text-white text-xl font-medium mb-4">Recently Added</h2>
                <div className="flex gap-4">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="shrink-0 w-48 h-72 rounded-xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-8 py-4">
            <div className="flex items-center justify-between mb-4">
                {isHomePage ? (
                    <h2 className="text-white text-xl font-medium">Recently Added</h2>
                ) : (
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-white transition cursor-pointer">
                            <i className="ri-arrow-left-line" />
                        </button>
                        <h2 className="text-white text-xl font-medium">Recently Added</h2>
                    </div>
                )}
                {isHomePage && (
                    <button onClick={() => navigate('/view-all/recently-added')} className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded transition border border-white/10 cursor-pointer">
                        See All
                    </button>
                )}
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                {nowPlaying.slice(0, 12).map(item => (
                    <div
                        key={item.id}
                        onClick={() => navigate(`/movie/movie/${item.id}`)}
                        className="shrink-0 w-48 cursor-pointer group"
                    >
                        <div className="relative w-48 h-72 rounded-xl overflow-hidden">
                            <img
                                src={item.poster_path
                                    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                                    : '/placeholder.jpg'}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-10 h-10 bg-purple-500/90 rounded-full flex items-center justify-center">
                                    <i className="ri-play-fill text-white" />
                                </div>
                            </div>
                            {/* New Badge */}
                            <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                                New
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm mt-2 truncate">{item.title}</p>
                        <p className="text-gray-500 text-xs">{item.release_date?.split('-')[0]}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyAdded;