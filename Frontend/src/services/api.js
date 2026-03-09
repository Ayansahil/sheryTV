import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/signup', data);
export const logoutUser = () => API.post('/auth/logout');
export const updateUserProfile = (data) => API.put('/user/profile', data);

// History
export const addToHistory = (movieData) => API.post('/history', movieData);
export const getHistory = () => API.get('/history');
export const deleteFromHistory = (movieId) => API.delete(`/history/${movieId}`);

// Favorites
export const addFavorite = (movieData) => API.post('/favorites', movieData);
export const getFavorites = () => API.get('/favorites');
export const removeFavorite = (movieId) => API.delete(`/favorites/${movieId}`);

// Admin APIs
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const banAdminUser = (id) => API.patch(`/admin/users/${id}/ban`);
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);

export const getProfile = () => API.get('/user/profile');
export const updateProfile = (data) => API.put('/user/profile', data);
export const changePassword = (data) => API.put('/user/change-password', data);