import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const logoutUser = () => API.post('/auth/logout');

// History
export const addToHistory = (movieData) => API.post('/history', movieData);
export const getHistory = () => API.get('/history');

// Favorites
export const addFavorite = (movieData) => API.post('/favorites', movieData);
export const getFavorites = () => API.get('/favorites');
export const removeFavorite = (movieId) => API.delete(`/favorites/${movieId}`);