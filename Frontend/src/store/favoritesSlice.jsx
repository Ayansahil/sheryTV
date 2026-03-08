import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addFavorite, getFavorites, removeFavorite } from '../services/api';

export const fetchFavorites = createAsyncThunk('favorites/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await getFavorites();
            return data.favorites; 
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const toggleFavorite = createAsyncThunk('favorites/toggle',
    async (movieData, { getState, rejectWithValue }) => {
        try {
            const { items } = getState().favorites;
            const exists = items.find(i => i.movieId === movieData.movieId);
            if (exists) {
                await removeFavorite(movieData.movieId);
                return { removed: true, movieId: movieData.movieId };
            } else {
                const { data } = await addFavorite(movieData);
                return { removed: false, data: data.favorite }; // ← yeh fix karo
            }
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: { items: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                if (action.payload.removed) {
                    state.items = state.items.filter(i => i.movieId !== action.payload.movieId);
                } else {
                    state.items.unshift(action.payload.data);
                }
            });
    },
});

export default favoritesSlice.reducer;