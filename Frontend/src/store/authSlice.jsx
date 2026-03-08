import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser } from '../services/api';

export const login = createAsyncThunk('auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await loginUser(credentials);
            return data.user; // token backend cookie mein set karega
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk('auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await registerUser(credentials);
            return data.user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Register failed');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    await logoutUser();
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export default authSlice.reducer;