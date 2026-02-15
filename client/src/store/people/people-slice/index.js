import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    people: [],
    person: null,
    isLoading: false,
    error: null,
    message: null,
    success: false,
    credits: 0
};

// Fetch all people for a user
export const fetchPeople = createAsyncThunk(
    'people/fetchPeople',
    async (userId, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth?.token?.access || localStorage.getItem('accessToken');
            
            const response = await axios.get(`/api/people/people/user/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to fetch people' });
        }
    }
);

// Upload image to Cloudinary
export const uploadImage = createAsyncThunk(
    'people/uploadImage',
    async (imageFile, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth?.token?.access || localStorage.getItem('accessToken');
            
            const formData = new FormData();
            formData.append('image', imageFile);
            
            const response = await axios.post('/api/people/upload-image/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to upload image' });
        }
    }
);

// Create a new person
export const addNewPeople = createAsyncThunk(
    'people/addNewPeople',
    async (personData, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth?.token?.access || localStorage.getItem('accessToken');
            
            const response = await axios.post('/api/people/people/create/', personData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to create person' });
        }
    }
);

// Fetch a single person
export const fetchPersonById = createAsyncThunk(
    'people/fetchPersonById',
    async (personId, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth?.token?.access || localStorage.getItem('accessToken');
            
            const response = await axios.get(`/api/people/people/${personId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to fetch person' });
        }
    }
);

// Update a person
export const updatePerson = createAsyncThunk(
    'people/updatePerson',
    async ({ personId, personData }, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth?.token?.access || localStorage.getItem('accessToken');
            
            const response = await axios.put(`/api/people/people/${personId}/`, personData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to update person' });
        }
    }
);

// Delete a person
export const deletePerson = createAsyncThunk(
    'people/deletePerson',
    async (personId, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth?.token?.access || localStorage.getItem('accessToken');
            
            const response = await axios.delete(`/api/people/people/${personId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return { personId, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to delete person' });
        }
    }
);

// Check credits
export const checkCredits = createAsyncThunk(
    'people/checkCredits',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth?.token?.access || localStorage.getItem('accessToken');
            
            const response = await axios.get('/api/people/check-credits/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to check credits' });
        }
    }
);

const peopleSlice = createSlice({
    name: 'people',
    initialState,
    reducers: {
        clearPeopleState: (state) => {
            state.error = null;
            state.message = null;
            state.success = false;
        },
        clearCurrentPerson: (state) => {
            state.person = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch People
            .addCase(fetchPeople.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPeople.fulfilled, (state, action) => {
                state.isLoading = false;
                state.people = action.payload.people || [];
            })
            .addCase(fetchPeople.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.detail || action.payload?.msg || 'Failed to fetch people';
                state.people = [];
            })
            
            // Add Person
            .addCase(addNewPeople.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addNewPeople.fulfilled, (state, action) => {
                state.isLoading = false;
                state.people.push(action.payload.data);
                state.credits = action.payload.credits_remaining;
                state.message = action.payload.msg;
                state.success = true;
            })
            .addCase(addNewPeople.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.msg || action.payload?.message || 'Failed to create person';
                state.success = false;
            })
            
            // Check Credits
            .addCase(checkCredits.fulfilled, (state, action) => {
                state.credits = action.payload.credits;
            })
            
            // Delete Person
            .addCase(deletePerson.fulfilled, (state, action) => {
                state.isLoading = false;
                state.people = state.people.filter(person => person.people_id !== action.payload.personId);
                state.credits = action.payload.data.credits_remaining;
                state.message = action.payload.data.msg;
                state.success = true;
            });
    }
});

export const { clearPeopleState, clearCurrentPerson } = peopleSlice.actions;
export default peopleSlice.reducer;