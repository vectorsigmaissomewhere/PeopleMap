import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    companyChart: {
        labels: [],
        data: [],
        total_with_company: 0,
        no_company_count: 0
    },
    tagChart: {
        labels: [],
        data: [],
        colors: [],
        total_with_tag: 0,
        no_tag_count: 0
    },
    summary: {
        total_contacts: 0,
        total_companies: 0,
        total_tags: 0
    },
    isLoading: false,
    error: null
};

// Fetch analytics data
export const fetchAnalytics = createAsyncThunk(
    'analytics/fetchAnalytics',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth?.token?.access || localStorage.getItem('accessToken');
            
            const response = await axios.get('/api/people/analytics/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to fetch analytics' });
        }
    }
);

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        clearAnalyticsError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalytics.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.companyChart = action.payload.company_chart;
                state.tagChart = action.payload.tag_chart;
                state.summary = action.payload.summary;
            })
            .addCase(fetchAnalytics.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.msg || 'Failed to fetch analytics';
            });
    }
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;