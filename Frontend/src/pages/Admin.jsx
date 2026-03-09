import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAdminUsers, banAdminUser, deleteAdminUser } from '../services/api';

const MobileAdminSidebar = ({ isOpen, onClose, activeTab, setActiveTab, onNavigate }) => {
    if (!isOpen) return null;

    const tabs = [
        { id: 'dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
        { id: 'users', icon: 'ri-group-line', label: 'Users' },
    ];

    return (
        <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
            {/* Content */}
            <div className="relative w-64 h-full bg-[#1A1625] border-r border-white/5 flex flex-col p-4">
                <div className="flex items-center justify-between gap-2 mb-8 px-2">
                    <div className="flex items-center gap-2">
                        <i className="ri-shield-fill text-purple-400 text-xl" />
                        <span className="text-white font-bold">Admin Panel</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <i className="ri-close-line text-2xl" />
                    </button>
                </div>

                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            onClose();
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition mb-1 cursor-pointer w-full ${
                            activeTab === tab.id
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <i className={tab.icon} />
                        {tab.label}
                    </button>
                ))}

                <div className="mt-auto">
                    <button
                        onClick={() => onNavigate('/')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition w-full cursor-pointer"
                    >
                        <i className="ri-arrow-left-line" />
                        Back to App
                    </button>
                </div>
            </div>
        </div>
    );
};

const Admin = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Admin check
    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            navigate('/');
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes] = await Promise.all([
                getAdminStats(),
                getAdminUsers(),
            ]);
            setStats(statsRes.data.stats);
            setUsers(usersRes.data.users);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (id) => {
        try {
            const { data } = await banAdminUser(id);
            setUsers(prev => prev.map(u => u._id === id ? { ...u, isBanned: data.user.isBanned } : u));
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await deleteAdminUser(id);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) { console.error(err); }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-[#0f0d1a] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f0d1a] flex">
            <MobileAdminSidebar
                isOpen={isMobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onNavigate={navigate}
            />

            {/* Admin Sidebar */}
            <div className="hidden md:flex flex-col min-h-screen md:w-20 lg:w-56 bg-[#1A1625] border-r border-white/5 p-4 transition-all duration-300">
                <div className="flex items-center gap-2 mb-8 px-2 md:justify-center lg:justify-start">
                    <i className="ri-shield-fill text-purple-400 text-xl shrink-0" />
                    <span className="text-white font-bold hidden lg:inline">Admin Panel</span>
                </div>

                {[
                    { id: 'dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
                    { id: 'users', icon: 'ri-group-line', label: 'Users' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition mb-1 cursor-pointer md:justify-center lg:justify-start ${
                            activeTab === tab.id
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <i className={`${tab.icon} text-lg`} />
                        <span className="hidden lg:inline">{tab.label}</span>
                    </button>
                ))}

                <div className="mt-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition w-full cursor-pointer md:justify-center lg:justify-start"
                    >
                        <i className="ri-arrow-left-line text-lg" />
                        <span className="hidden lg:inline">Back to App</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="md:ml-20 lg:ml-56 flex-1 p-4 sm:p-8 w-full min-w-0">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between mb-6">
                    <button onClick={() => setMobileSidebarOpen(true)} className="text-white text-2xl">
                        <i className="ri-menu-line" />
                    </button>
                    <h1 className="text-xl font-bold text-white capitalize">{activeTab}</h1>
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && stats && (
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-6 hidden md:block">Dashboard</h1>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Total Users', value: stats.totalUsers, icon: 'ri-group-line', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                { label: 'Banned Users', value: stats.bannedUsers, icon: 'ri-forbid-line', color: 'text-red-400', bg: 'bg-red-400/10' },
                                { label: 'Total Favorites', value: stats.totalFavorites, icon: 'ri-heart-line', color: 'text-pink-400', bg: 'bg-pink-400/10' },
                                { label: 'Watch History', value: stats.totalHistory, icon: 'ri-history-line', color: 'text-purple-400', bg: 'bg-purple-400/10' },
                            ].map(stat => (
                                <div key={stat.label} className="bg-[#1A1625] border border-white/5 rounded-2xl p-5">
                                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                                        <i className={`${stat.icon} ${stat.color} text-lg`} />
                                    </div>
                                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                                    <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Users */}
                        <div className="bg-[#1A1625] border border-white/5 rounded-2xl p-6">
                            <h2 className="text-white font-semibold mb-4">Recent Users</h2>
                            <div className="space-y-3">
                                {stats.recentUsers?.map(u => (
                                    <div key={u._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">
                                                {u.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm">{u.name}</p>
                                                <p className="text-gray-500 text-xs">{u.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {u.role === 'admin' && (
                                                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Admin</span>
                                            )}
                                            {u.isBanned && (
                                                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Banned</span>
                                            )}
                                            <span className="text-gray-500 text-xs">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-white hidden md:block">Users ({users.length})</h1>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 w-40 sm:w-64"
                            />
                        </div>

                        <div className="bg-[#1A1625] border border-white/5 rounded-2xl overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">User</th>
                                        <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Role</th>
                                        <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Status</th>
                                        <th className="text-left text-gray-400 text-sm font-medium px-6 py-4 hidden md:table-cell">Joined</th>
                                        <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u._id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition">
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex flex-col items-start text-left sm:flex-row sm:items-center gap-2 sm:gap-3">
                                                    <div className="w-9 h-9 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                                                        {u.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{u.name}</p>
                                                        <p className="text-gray-500 text-xs">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    u.role === 'admin'
                                                        ? 'bg-purple-500/20 text-purple-400'
                                                        : 'bg-white/5 text-gray-400'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    u.isBanned
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-green-500/20 text-green-400'
                                                }`}>
                                                    {u.isBanned ? 'Banned' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {u.role !== 'admin' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleBan(u._id)}
                                                                className={`text-xs px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                                                    u.isBanned
                                                                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                                        : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                                                }`}
                                                            >
                                                                {u.isBanned ? 'Unban' : 'Ban'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(u._id)}
                                                                className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition cursor-pointer"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredUsers.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <i className="ri-group-line text-4xl mb-2 block" />
                                    No users found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;