import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../store/favoritesSlice';
import { fetchHistory } from '../store/historySlice';
import Topbar from '../components/Topbar';

const Collections = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: favorites } = useSelector(state => state.favorites);
    const { items: history } = useSelector(state => state.history);
    const { isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchFavorites());
            dispatch(fetchHistory());
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) return (
        <div className="min-h-screen bg-[#1A1625]">
            <Topbar />
            <div className="flex flex-col items-center justify-center h-96 text-white">
                <i className="ri-folder-3-line text-6xl text-purple-400/50 mb-4" />
                <h2 className="text-xl font-bold mb-2">Login Required</h2>
                <p className="text-gray-400 mb-6 text-sm">Please log in to see your collections.</p>
                <button onClick={() => navigate('/login')}
                    className="bg-purple-600 hover:bg-purple-500 px-6 py-2.5 rounded-xl transition text-sm">
                    Login / Register
                </button>
            </div>
        </div>
    );

    const Section = ({ title, icon, items, emptyMsg, type = 'movie' }) => (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <i className={`${icon} text-purple-400 text-lg`} />
                    <h2 className="text-white font-semibold text-lg">{title}</h2>
                    <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">
                        {items.length}
                    </span>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                    <p className="text-gray-500 text-sm">{emptyMsg}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                    {items.slice(0, 12).map(item => (
                        <div
                            key={item.movieId}
                            onClick={() => navigate(`/movie/${item.media_type || type}/${item.movieId}`)}
                            className="group cursor-pointer"
                        >
                            <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
                                <img
                                    src={item.poster
                                        ? `https://image.tmdb.org/t/p/w300${item.poster}`
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=2d1b69&color=fff&size=300`}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-9 h-9 bg-purple-500/90 rounded-full flex items-center justify-center">
                                        <i className="ri-play-fill text-white text-sm" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm mt-2 truncate">{item.title}</p>
                            <p className="text-gray-500 text-xs capitalize">{item.media_type || type}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#1A1625]">
            <Topbar />
            <div className="px-4 sm:px-8 py-6">
                <h1 className="text-2xl font-bold text-white mb-8">My Collections</h1>

                <Section
                    title="Favourites"
                    icon="ri-heart-fill"
                    items={favorites}
                    emptyMsg="No favorites yet — press the heart icon on movies!"
                />
                <Section
                    title="Watch History"
                    icon="ri-history-line"
                    items={history}
                    emptyMsg="No watch history yet — go watch some movies!"
                />
            </div>
        </div>
    );
};

export default Collections;