import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector(state => state.auth);
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (isLogin) {
            if (!form.email || !form.password) {
                setLocalError("Please fill in all fields");
                return;
            }
            const result = await dispatch(login({ email: form.email, password: form.password }));
            if (result.meta.requestStatus === 'fulfilled') navigate('/');
        } else {
            if (!form.username || !form.email || !form.password) {
                setLocalError("Please fill in all fields");
                return;
            }
            if (form.password.length < 6) {
                setLocalError("Password must be at least 6 characters");
                return;
            }
            const result = await dispatch(register(form));
            if (result.meta.requestStatus === 'fulfilled') navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#1A1625] flex items-center justify-center px-4">
            {/* Background blur circles */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <i className="ri-tv-2-line text-purple-400 text-3xl" />
                        <span className="text-white text-2xl font-bold">Shery Tv</span>
                    </div>
                    <p className="text-gray-400 text-sm">Your personal movie universe</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
                    {/* Toggle */}
                    <div className="flex bg-white/5 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                                isLogin ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                                !isLogin ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Fields */}
                    <div className="flex flex-col gap-4">
                        {!isLogin && (
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Username</label>
                                <input
                                    type="text"
                                    placeholder="johndoe"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                            />
                        </div>

                        {/* Error */}
                        {(error || localError) && (
                            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                                {localError || error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={status === 'loading'}
                            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {status === 'loading' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                isLogin ? 'Login' : 'Create Account'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;