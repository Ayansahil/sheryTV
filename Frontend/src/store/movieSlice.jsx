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

export const fetchTopRated = createAsyncThunk(
  "movie/fetchTopRated",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("movie/top_rated?language=en-US&page=1");
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchRecentlyAdded = createAsyncThunk(
  "movie/fetchRecentlyAdded",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "movie/now_playing?language=en-US&page=1",
      );
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

export const fetchNowPlaying = createAsyncThunk(
  "movie/fetchNowPlaying",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "movie/now_playing?language=en-US&page=1",
      );
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchExplore = createAsyncThunk(
  "movie/fetchExplore",
  async (page, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `discover/movie?sort_by=popularity.desc&language=en-US&page=${page}`
      );
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const movieSlice = createSlice({
  name: "movie",
  initialState: {
    searchResults: [],
    trending: [],
    popular: [],
    topRated: [],
    recentlyAdded: [],
    nowPlaying: [],
    explore: [],
    explorePage: 1,
    exploreHasMore: true,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
      state.status = "idle";
    },
    resetExplore: (state) => {
      state.explore = [];
      state.explorePage = 1;
      state.exploreHasMore = true;
    }
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
      })
      .addCase(fetchTopRated.fulfilled, (state, action) => {
        state.topRated = action.payload;
      })
      .addCase(fetchRecentlyAdded.fulfilled, (state, action) => {
        state.recentlyAdded = action.payload;
      })
      .addCase(fetchNowPlaying.fulfilled, (state, action) => {
        state.nowPlaying = action.payload;
      })
      .addCase(fetchExplore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExplore.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.length === 0) {
          state.exploreHasMore = false;
        } else {
          const newItems = action.payload.filter(
            (item) => !state.explore.some((existing) => existing.id === item.id)
          );
          state.explore = [...state.explore, ...newItems];
          state.explorePage += 1;
        }
      });
  },
});

export const { clearSearch, resetExplore } = movieSlice.actions;
export default movieSlice.reducer;
