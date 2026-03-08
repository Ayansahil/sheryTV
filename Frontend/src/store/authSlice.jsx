import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser, updateUserProfile } from '../services/api';

// Helper to get user from local storage
const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};

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

export const updateProfile = createAsyncThunk('auth/updateProfile',
    async (data, { rejectWithValue }) => {
        try {
            const response = await updateUserProfile(data);
            return response.data.user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: getUserFromStorage(),
        isAuthenticated: !!getUserFromStorage(),
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
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.status = 'succeeded';
                state.error = null;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
            })
            .addCase(updateProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            });
    },
});

export default authSlice.reducer;