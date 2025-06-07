import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Updated API endpoint for Next.js
export const performGlobalSearch = createAsyncThunk(
    'globalSearch/performSearch',
    async (searchTerm, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/search?q=${encodeURIComponent(searchTerm)}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);

const globalSearchSlice = createSlice({
    name: 'globalSearch',
    initialState: {
        searchResults: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(performGlobalSearch.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.searchResults = [];
            })
            .addCase(performGlobalSearch.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(performGlobalSearch.rejected, (state, action) => {
                state.loading = false;
                state.searchResults = [];
                state.error = action.payload || 'An error occurred';
            });
    },
});

export const { clearSearchResults } = globalSearchSlice.actions;
export default globalSearchSlice.reducer;