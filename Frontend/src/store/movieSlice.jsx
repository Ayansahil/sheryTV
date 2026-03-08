import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../components/axios";

export const fetchTrending = createAsyncThunk(
  "movie/fetchTrending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("trending/all/day?language=en-US");
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchPopular = createAsyncThunk(
  "movie/fetchPopular",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("movie/popular?language=en-US&page=1");
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const searchMulti = createAsyncThunk(
  "movie/searchMulti",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `search/multi?query=${query}&include_adult=false&language=en-US&page=1`,
      );
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const movieSlice = createSlice({
  name: "movie",
  initialState: {
    searchResults: [],
    trending: [],     
    popular: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMulti.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchMulti.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchMulti.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload;
      })
      .addCase(fetchPopular.fulfilled, (state, action) => {
        state.popular = action.payload;
      });
  },
});

export const { clearSearch } = movieSlice.actions;
export default movieSlice.reducer;
