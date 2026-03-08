import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../components/axios';
import Topbar from '../components/Topbar';

const People = () => {
    const navigate = useNavigate();
    const [people, setPeople] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);
    const isFetchingRef = useRef(false);

    const fetchPeople = useCallback(async (pageNum) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setLoading(true);
        try {
            const { data } = await axios.get(`person/popular?language=en-US&page=${pageNum}`);
            setTotalPages(data.total_pages > 100 ? 100 : data.total_pages);
            setPeople(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, []);

    useEffect(() => { fetchPeople(1); }, []);

    useEffect(() => {
        if (page > 1) fetchPeople(page);
    }, [page]);

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
            <div className="px-8 py-6">
                <h1 className="text-2xl font-bold text-white mb-6">Popular People</h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {people.map((person, i) => (
                        <div
                            key={`${person.id}-${i}`}
                            onClick={() => navigate(`/people/${person.id}`)}
                            className="group cursor-pointer text-center"
                        >
                            <div className="relative rounded-2xl overflow-hidden mb-3">
                                <img
                                    src={person.profile_path
                                        ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                                        : `https://ui-avatars.com/api/?name=${person.name}&background=9e72e0&color=fff&size=300`}
                                    alt={person.name}
                                    className="w-full h-64 object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-3 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full">View Profile</span>
                                </div>
                            </div>
                            <p className="text-white text-sm font-medium truncate">{person.name}</p>
                            <p className="text-gray-500 text-xs mt-0.5 truncate">{person.known_for_department}</p>
                        </div>
                    ))}

                    {loading && Array(12).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="w-full h-64 bg-white/5 rounded-2xl mb-3" />
                            <div className="h-3 bg-white/5 rounded w-3/4 mx-auto mb-1" />
                            <div className="h-3 bg-white/5 rounded w-1/2 mx-auto" />
                        </div>
                    ))}
                </div>

                <div ref={loaderRef} className="h-10 mt-4" />
            </div>
        </div>
    );
};

export default People;