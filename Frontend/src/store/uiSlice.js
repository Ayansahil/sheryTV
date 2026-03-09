import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMobileSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    setMobileSidebarOpen: (state, action) => {
      state.isMobileSidebarOpen = action.payload;
    },
  },
});

export const { toggleMobileSidebar, setMobileSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;