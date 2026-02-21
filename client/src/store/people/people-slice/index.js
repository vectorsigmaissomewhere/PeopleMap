import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    people: [],
    person: null,
    isLoading: false,
    error: null,
    message: null,
    success: false,
    credits: 0,
    pagination: {
        count: 0,
        next: null,
        previous: null,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1
    },
    filters: {
        search: '',
        tag: '',
        company: '',
        city: ''
    }
};

// Fetch all people for a user
export const fetchPeople = createAsyncThunk(
    'people/fetchPeople',
    async ({ userId, page = 1, pageSize = 10, search = '', tag = '', company = '', city = '' }, { rejectWithValue, getState }) => {
        try {
            console.log("This is the fetch people api");
            const { auth } = getState();
            console.log(auth);
            const token = auth?.token?.access || localStorage.getItem('accessToken');
            
            let url = `/api/people/people/user/${userId}/?page=${page}&page_size=${pageSize}`;
            console.log(url);
            if (search) url += `&search=${encodeURIComponent(search)}`;
            if (tag) url += `&tag=${encodeURIComponent(tag)}`;
            if (company) url += `&company=${encodeURIComponent(company)}`;
            if (city) url += `&city=${encodeURIComponent(city)}`;
            
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
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
            console.log(response.data);
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
            state.isLoading = false;
        },
        clearCurrentPerson: (state) => {
            state.person = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                search: '',
                tag: '',
                company: '',
                city: ''
            };
        },
        setCurrentPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
        setPageSize: (state, action) => {
            state.pagination.pageSize = action.payload;
            state.pagination.currentPage = 1; 
        },
        resetPagination: (state) => {
            state.pagination = {
                ...initialState.pagination,
                currentPage: 1
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch People - FIXED HERE
            .addCase(fetchPeople.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPeople.fulfilled, (state, action) => {
                state.isLoading = false;
                
                // Based on your API response structure:
                // {
                //   count: 8,
                //   next: null,
                //   previous: null,
                //   results: {
                //     people: [...],
                //     filtered_count: 8,
                //     total_count: 8
                //   }
                // }
                
                // Extract people from the nested structure
                if (action.payload?.results?.people) {
                    state.people = action.payload.results.people;
                    state.pagination.count = action.payload.results.total_count || action.payload.count || state.people.length;
                } 
                // Fallback for other possible structures
                else if (action.payload?.people) {
                    state.people = action.payload.people;
                    state.pagination.count = action.payload.count || action.payload.total_count || state.people.length;
                } 
                else if (action.payload?.results) {
                    state.people = action.payload.results;
                    state.pagination.count = action.payload.count || state.people.length;
                } 
                else {
                    state.people = action.payload || [];
                    state.pagination.count = state.people.length;
                }
                
                // Update pagination info
                state.pagination = {
                    ...state.pagination,
                    count: state.pagination.count,
                    next: action.payload.next || null,
                    previous: action.payload.previous || null,
                    totalPages: Math.ceil(state.pagination.count / state.pagination.pageSize)
                };
            })
            .addCase(fetchPeople.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.detail || action.payload?.msg || 'Failed to fetch people';
                state.people = [];
                state.pagination.count = 0;
                state.pagination.totalPages = 1;
            })
            
            .addCase(addNewPeople.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addNewPeople.fulfilled, (state, action) => {
                state.isLoading = false;
                state.people.unshift(action.payload.data);
                state.credits = action.payload.credits_remaining;
                state.message = action.payload.msg;
                state.success = true;
                state.pagination.count += 1;
                state.pagination.totalPages = Math.ceil(state.pagination.count / state.pagination.pageSize);
            })
            .addCase(addNewPeople.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.msg || action.payload?.message || 'Failed to create person';
                state.success = false;
            })
            
            .addCase(checkCredits.fulfilled, (state, action) => {
                state.credits = action.payload.credits;
            })
            
            .addCase(deletePerson.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deletePerson.fulfilled, (state, action) => {
                state.isLoading = false;
                state.people = state.people.filter(person => person.people_id !== action.payload.personId);
                state.credits = action.payload.data.credits_remaining;
                state.message = action.payload.data.msg;
                state.success = true;
                
                state.pagination.count -= 1;
                state.pagination.totalPages = Math.ceil(state.pagination.count / state.pagination.pageSize);

                if (state.people.length === 0 && state.pagination.currentPage > 1) {
                    state.pagination.currentPage -= 1;
                }
            })
            .addCase(deletePerson.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.msg || 'Failed to delete person';
                state.success = false;
            })
            
            .addCase(fetchPersonById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPersonById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.person = action.payload;
            })
            .addCase(fetchPersonById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.detail || action.payload?.msg || 'Failed to fetch person';
                state.person = null;
            })
            
            .addCase(updatePerson.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updatePerson.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.people.findIndex(p => p.people_id === action.payload.data.people_id);
                if (index !== -1) {
                    state.people[index] = action.payload.data;
                }
                if (state.person?.people_id === action.payload.data.people_id) {
                    state.person = action.payload.data;
                }
                state.message = action.payload.msg;
                state.success = true;
            })
            .addCase(updatePerson.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.msg || 'Failed to update person';
                state.success = false;
            });
    }
});

export const { 
    clearPeopleState, 
    clearCurrentPerson,
    setFilters,
    clearFilters,
    setCurrentPage,
    setPageSize,
    resetPagination
} = peopleSlice.actions;

export default peopleSlice.reducer;