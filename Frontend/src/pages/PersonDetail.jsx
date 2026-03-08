import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../components/axios';

const PersonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const [personRes, creditsRes] = await Promise.all([
                    axios.get(`person/${id}?language=en-US`),
                    axios.get(`person/${id}/combined_credits?language=en-US`),
                ]);
                setPerson(personRes.data);
                // Sort by popularity
                const sorted = creditsRes.data.cast
                    ?.sort((a, b) => b.popularity - a.popularity)
                    ?.slice(0, 20) || [];
                setCredits(sorted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#1A1625] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!person) return null;

    return (
        <div className="min-h-screen bg-[#1A1625] text-white">
            <button
                onClick={() => navigate(-1)}
                className="fixed top-8 right-8 z-50 flex items-center gap-2 bg-black/50 backdrop-blur px-4 py-2 rounded-lg hover:bg-black/70 transition cursor-pointer"
            >
                <i className="ri-arrow-left-line" /> Back
            </button>

            <div className="max-w-5xl mx-auto px-8 py-16">
                {/* Profile Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-10">
                    <img
                        src={person.profile_path
                            ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                            : `https://ui-avatars.com/api/?name=${person.name}&background=9e72e0&color=fff&size=300`}
                        alt={person.name}
                        className="w-48 h-64 object-cover rounded-2xl shrink-0"
                    />
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2">{person.name}</h1>
                        <div className="flex gap-3 flex-wrap mb-4">
                            {person.known_for_department && (
                                <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm px-3 py-1 rounded-full">
                                    {person.known_for_department}
                                </span>
                            )}
                            {person.birthday && (
                                <span className="bg-white/5 text-gray-300 text-sm px-3 py-1 rounded-full">
                                    🎂 {person.birthday}
                                </span>
                            )}
                            {person.place_of_birth && (
                                <span className="bg-white/5 text-gray-300 text-sm px-3 py-1 rounded-full">
                                    📍 {person.place_of_birth}
                                </span>
                            )}
                        </div>
                        {person.biography && (
                            <p className="text-gray-300 leading-relaxed line-clamp-6">{person.biography}</p>
                        )}
                    </div>
                </div>

                {/* Known For */}
                {credits.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Known For</h2>
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                            {credits.map(item => (
                                <div
                                    key={`${item.id}-${item.credit_id}`}
                                    onClick={() => navigate(`/movie/${item.media_type}/${item.id}`)}
                                    className="shrink-0 w-32 cursor-pointer group"
                                >
                                    <div className="relative rounded-xl overflow-hidden">
                                        <img
                                            src={item.poster_path
                                                ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                                                : '/placeholder.jpg'}
                                            alt={item.title || item.name}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                            <i className="ri-play-fill text-white" />
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-xs mt-2 truncate">{item.title || item.name}</p>
                                    <p className="text-gray-500 text-xs capitalize">{item.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonDetail;