import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';
import authReducer from './authSlice';
import historyReducer from './historySlice';
import favoritesReducer from './favoritesSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
    reducer: {
        movie: movieReducer,
        auth: authReducer,
        history: historyReducer,
        favorites: favoritesReducer,
        ui: uiReducer,
    },
});