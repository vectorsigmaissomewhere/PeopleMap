import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    stats: {
        total_contacts: 0,
        contacts_this_week: 0,
        total_tags: 0,
        recent_contacts: []
    },
    isLoading: false,
    error: null
};

export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth?.token?.access || localStorage.getItem('accessToken');
            
            const response = await axios.get('/api/people/dashboard-stats/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to fetch dashboard stats' });
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.msg || 'Failed to fetch dashboard stats';
            });
    }
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;