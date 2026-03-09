import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, changePassword } from '../services/api';

const Settings = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const fileRef = useRef(null);

    const [activeTab, setActiveTab] = useState('profile');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [preview, setPreview] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [fileName, setFileName] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Password fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await getProfile();
            setName(data.user.name || '');
            setAvatar(data.user.avatar || '');
            setPreview(data.user.avatar || '');
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Max 2MB check
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image must be smaller than 2MB.' });
            return;
        }

        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            setImageBase64(reader.result); 
        };
        reader.readAsDataURL(file);
    };

    const handleProfileSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const payload = { name };
            if (imageBase64) {
                payload.imageBase64 = imageBase64;
                payload.fileName = fileName;
            }
            await updateProfile(payload);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setImageBase64('');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Something went wrong.' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
            return;
        }
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await changePassword({ currentPassword, newPassword });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Password change failed.' });
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', icon: 'ri-user-line', label: 'Profile' },
        { id: 'password', icon: 'ri-lock-line', label: 'Password' },
    ];

    return (
        <div className="min-h-screen bg-[#1A1625]">
            <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-white transition cursor-pointer"
                    >
                        <i className="ri-arrow-left-line" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                </div>

                {/* Tabs */}
                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setMessage({ type: '', text: '' }); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                                activeTab === tab.id
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <i className={tab.icon} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
                        message.type === 'success'
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                        <i className={message.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} />
                        {message.text}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/10">
                            <div className="relative">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Avatar"
                                        className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/50"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-400 text-2xl font-bold border-2 border-purple-500/50">
                                        {name?.[0]?.toUpperCase()}
                                    </div>
                                )}
                                <button
                                    onClick={() => fileRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center transition"
                                >
                                    <i className="ri-camera-line text-white text-xs" />
                                </button>
                            </div>
                            <div>
                                <p className="text-white font-medium">{name}</p>
                                <p className="text-gray-500 text-sm">{user?.email}</p>
                                <button
                                    onClick={() => fileRef.current?.click()}
                                    className="text-purple-400 text-xs hover:text-purple-300 mt-1 transition"
                                >
                                    Change photo
                                </button>
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        {/* Name Field */}
                        <div className="mb-4">
                            <label className="text-gray-400 text-sm mb-1.5 block">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                            />
                        </div>

                        {/* Email - readonly */}
                        <div className="mb-6">
                            <label className="text-gray-400 text-sm mb-1.5 block">Email</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <button
                            onClick={handleProfileSave}
                            disabled={saving}
                            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><i className="ri-save-line" /> Save Changes</>
                            )}
                        </button>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="space-y-4 mb-6">
                            {[
                                { label: 'Current Password', value: currentPassword, setter: setCurrentPassword },
                                { label: 'New Password', value: newPassword, setter: setNewPassword },
                                { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword },
                            ].map(field => (
                                <div key={field.label}>
                                    <label className="text-gray-400 text-sm mb-1.5 block">{field.label}</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={field.value}
                                        onChange={e => field.setter(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handlePasswordChange}
                            disabled={saving}
                            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><i className="ri-lock-line" /> Change Password</>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;