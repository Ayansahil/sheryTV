import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addToHistory, getHistory } from '../services/api';

export const fetchHistory = createAsyncThunk('history/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await getHistory();
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const saveToHistory = createAsyncThunk('history/save',
    async (movieData, { rejectWithValue }) => {
        try {
            const { data } = await addToHistory(movieData);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const historySlice = createSlice({
    name: 'history',
    initialState: { items: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(saveToHistory.fulfilled, (state, action) => {
                const exists = state.items.find(i => i.movieId === action.payload.movieId);
                if (!exists) state.items.unshift(action.payload);
            });
    },
});

export default historySlice.reducer;