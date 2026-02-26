import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';


const initialState = {
    tags: [],
    tag: null,
    isLoading: false,
    error: null,
    message: null,
    success: false
};

// Fetch all tags for a user
export const fetchTags = createAsyncThunk(
    'tags/fetchTags',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/people/tags/user/${userId}/`);
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to fetch tags' });
        }
    }
);

// Create a new tag
export const createTag = createAsyncThunk(
    'tags/createTag',
    async (tagData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/people/tags/user/create/', tagData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to create tag' });
        }
    }
);

// Fetch a single tag by ID
export const fetchTagById = createAsyncThunk(
    'tags/fetchTagById',
    async (tagId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/people/tags/${tagId}/`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to fetch tag' });
        }
    }
);

// Update a tag (PUT - full update)
export const updateTag = createAsyncThunk(
    'tags/updateTag',
    async ({ tagId, tagData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/people/tags/${tagId}/`, tagData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to update tag' });
        }
    }
);

// Partially update a tag (PATCH)
export const partialUpdateTag = createAsyncThunk(
    'tags/partialUpdateTag',
    async ({ tagId, tagData }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`/api/people/tags/${tagId}/`, tagData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to update tag' });
        }
    }
);

// Delete a tag
export const deleteTag = createAsyncThunk(
    'tags/deleteTag',
    async (tagId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/people/tags/${tagId}/`);
            return { tagId, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || { msg: 'Failed to delete tag' });
        }
    }
);

const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        clearTagsState: (state) => {
            state.error = null;
            state.message = null;
            state.success = false;
        },
        clearCurrentTag: (state) => {
            state.tag = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tags
            .addCase(fetchTags.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tags = action.payload.tags || [];
                state.message = action.payload.detail;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.detail || action.payload?.msg || 'Failed to fetch tags';
                state.tags = [];
            })
            
            // Create Tag
            .addCase(createTag.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createTag.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tags.push(action.payload.data);
                state.message = action.payload.msg;
                state.success = true;
            })
            .addCase(createTag.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.msg || 'Failed to create tag';
                state.success = false;
            })
            
            // Fetch Tag By ID
            .addCase(fetchTagById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTagById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tag = action.payload;
            })
            .addCase(fetchTagById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.detail || action.payload?.msg || 'Failed to fetch tag';
            })
            
            // Update Tag (PUT)
            .addCase(updateTag.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateTag.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.tags.findIndex(tag => tag.tags_id === action.payload.data.tags_id);
                if (index !== -1) {
                    state.tags[index] = action.payload.data;
                }
                if (state.tag?.tags_id === action.payload.data.tags_id) {
                    state.tag = action.payload.data;
                }
                state.message = action.payload.msg;
                state.success = true;
            })
            .addCase(updateTag.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.msg || 'Failed to update tag';
                state.success = false;
            })
            
            // Partial Update Tag (PATCH)
            .addCase(partialUpdateTag.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(partialUpdateTag.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.tags.findIndex(tag => tag.tags_id === action.payload.data.tags_id);
                if (index !== -1) {
                    state.tags[index] = { ...state.tags[index], ...action.payload.data };
                }
                if (state.tag?.tags_id === action.payload.data.tags_id) {
                    state.tag = { ...state.tag, ...action.payload.data };
                }
                state.message = action.payload.msg;
                state.success = true;
            })
            .addCase(partialUpdateTag.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.msg || 'Failed to update tag';
                state.success = false;
            })
            
            // Delete Tag
            .addCase(deleteTag.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteTag.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tags = state.tags.filter(tag => tag.tags_id !== action.payload.tagId);
                if (state.tag?.tags_id === action.payload.tagId) {
                    state.tag = null;
                }
                state.message = action.payload.data?.msg || 'Tag deleted successfully';
                state.success = true;
            })
            .addCase(deleteTag.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.msg || 'Failed to delete tag';
                state.success = false;
            });
    }
});

export const { clearTagsState, clearCurrentTag } = tagsSlice.actions;
export default tagsSlice.reducer;

