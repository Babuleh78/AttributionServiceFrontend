import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  searchTerm: string;   // текущее значение в инпуте
  searchQuery: string;  // применённый фильтр
}

const initialState: SearchState = {
  searchTerm: '',
  searchQuery: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = '';
      state.searchQuery = '';
    },
  },
});

export const { setSearchTerm, setSearchQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;