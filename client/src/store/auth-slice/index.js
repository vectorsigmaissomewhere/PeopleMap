import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';

// Set axios default to include credentials and authorization header
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';

// Add interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const initialState = {
    isAuthenticated: false,
    isLoading: true, // Start with true
    user: null,
    isVerified: false,
    message: "",
    email: null,
    error: null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
};

export const registerUser = createAsyncThunk('/auth/register',
    async (formData) => {
        const response = await axios.post('/api/user/register/', formData);
        console.log(response.data);
        return { data: response.data, formData };
    }
);

export const loginUser = createAsyncThunk('/auth/login',
    async (formData) => {
        const response = await axios.post('/api/user/login/', formData);
        return response.data;
    }
);

export const logoutUser = createAsyncThunk(
    "/auth/logout",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { refreshToken } = getState().auth;
            await axios.post("/api/user/logout/", { refresh: refreshToken });
            return { success: true };
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const checkAuth = createAsyncThunk('/auth/checkauth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/user/check-auth/');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Network error' });
        }
    }
);

// Send verification code email
export const sendVerificationEmail = createAsyncThunk(
  "email/sendVerificationEmail",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/user/resend-verification-email/",
        formData,
        {
          headers: {
            'Authorization': null,
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { msg: "Server error" });
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "email/verifyEmail",
  async (formData, { rejectWithValue }) => {
    try {
        console.log('Sending verification with data:', formData);
        
        const response = await axios.post(
          "/api/user/verify-email/",
          formData,
          {
            headers: {
              'Authorization': null,
              'Content-Type': 'application/json',
            }
          }
        );
        
        console.log('Verification response:', response);
        return response.data;
    } catch (error) {
      console.error('Verification error:', error.response || error);
      return rejectWithValue(error.response?.data || { msg: "Verification failed" });
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        resetVerificationState: (state) => {
            state.isLoading = false;
            state.isVerified = false;
            state.message = "";
            state.error = null;
            state.email = null;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isLoading = false; // Ensure loading is set to false
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            delete axios.defaults.headers.common['Authorization'];
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data.user || null;
            state.isAuthenticated = false;
            
            if (action.payload.data?.token) {
                state.accessToken = action.payload.data.token.access;
                state.refreshToken = action.payload.data.token.refresh;
                localStorage.setItem('accessToken', action.payload.data.token.access);
                localStorage.setItem('refreshToken', action.payload.data.token.refresh);
            }
            if (action.payload.formData?.email) {
                state.email = action.payload.formData.email;
            }
        })
        .addCase(registerUser.rejected, (state) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.verified) {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.isVerified = true;
                
                if (action.payload.token) {
                    state.accessToken = action.payload.token.access;
                    state.refreshToken = action.payload.token.refresh;
                    localStorage.setItem('accessToken', action.payload.token.access);
                    localStorage.setItem('refreshToken', action.payload.token.refresh);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token.access}`;
                }
            } else {
                state.isAuthenticated = false;
                state.email = action.payload.email;
            }
        })
        .addCase(loginUser.rejected, (state) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        
        .addCase(checkAuth.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.success) {
                state.user = action.payload.user;
                state.isAuthenticated = true;
            }
        })
        .addCase(checkAuth.rejected, (state) => {
            state.isLoading = false; 
            state.user = null;
            state.isAuthenticated = false;
        })
        
        .addCase(logoutUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            delete axios.defaults.headers.common['Authorization'];
        })
        .addCase(logoutUser.rejected, (state) => {
            state.isLoading = false;
        })
        
        .addCase(sendVerificationEmail.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(sendVerificationEmail.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.msg;
            state.email = action.payload.email || state.email;
        })
        .addCase(sendVerificationEmail.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Failed to send verification email";
        })
        
        .addCase(verifyEmail.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(verifyEmail.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isVerified = true;
            state.message = action.payload.msg;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            
            if (action.payload.token) {
                state.accessToken = action.payload.token.access;
                state.refreshToken = action.payload.token.refresh;
                localStorage.setItem('accessToken', action.payload.token.access);
                localStorage.setItem('refreshToken', action.payload.token.refresh);
                axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token.access}`;
            }
        })
        .addCase(verifyEmail.rejected, (state, action) => {
            state.isLoading = false;
            state.isVerified = false;
            state.error = action.payload || "Verification failed";
        });
    }
});

export const { setEmail, setLoading, resetVerificationState, logout } = authSlice.actions;
export default authSlice.reducer;