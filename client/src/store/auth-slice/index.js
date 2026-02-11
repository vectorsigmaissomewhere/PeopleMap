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
    isLoading: false,
    user: null,
    isVerified: false,
    message: "",
    email: null,
    error: null,
    accessToken: null,
    refreshToken: null,
};


export const registerUser = createAsyncThunk('/auth/register',
    async (formData) => {
        console.log(formData);
        const response = await axios.post('http://127.0.0.1:8000/api/user/register/', formData, {
            withCredentials: true
        }
        );
        return { data: response.data, formData };
    }
);

export const loginUser = createAsyncThunk('/auth/login',
    async (formData) => {
        console.log(formData);
        const response = await axios.post('http://127.0.0.1:8000/api/user/login/', formData, {
            withCredentials: true
        }
        );
        return response.data;
    }
);


export const logoutUser = createAsyncThunk(
    "/auth/logout",
    async (_, { getState }) => {
        const { refreshToken } = getState().auth;
        await axios.post("/api/user/logout/", { refresh: refreshToken });
        return response.data;
    }
);

export const checkAuth = createAsyncThunk('/auth/checkauth',
    async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/user/check-auth/', {
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            }
        }
        );
        return response.data;
    }
);

// Send verification code email
export const sendVerificationEmail = createAsyncThunk(
  "email/sendVerificationEmail",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/resend-verification-email/",
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { msg: "Server error" });
    }
  }
);

// Verify code
export const verifyEmail = createAsyncThunk(
  "email/verifyEmail",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/verify-email/",
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { msg: "Verification failed" });
    }
  }
);



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => { },
        setEmail: (state, action) => {
            state.email = action.payload;
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
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data;
            state.isAuthenticated = false;
             // Store tokens from registration response
            if (action.payload.data?.token) {
                state.accessToken = action.payload.data.token.access;
                state.refreshToken = action.payload.data.token.refresh;
                localStorage.setItem('accessToken', action.payload.data.token.access);
                localStorage.setItem('refreshToken', action.payload.data.token.refresh);
            }
            if (action.payload.formData?.email) {
                state.email = action.payload.formData.email;
            }
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.verified) {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.isVerified = true;
                // Store tokens from login response
                if (action.payload.token) {
                    state.accessToken = action.payload.token.access;
                    state.refreshToken = action.payload.token.refresh;
                    localStorage.setItem('accessToken', action.payload.token.access);
                    localStorage.setItem('refreshToken', action.payload.token.refresh);
                }
                } else {
                // Email not verified case
                state.isAuthenticated = false;
                state.email = action.payload.email;
            }
        }).addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        builder.addCase(checkAuth.pending, (state) => {
            state.isLoading = true;
        }).addCase(checkAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.success ? action.payload.user : null;
            state.isAuthenticated = action.payload.success;
        }).addCase(checkAuth.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            // Clear tokens if check auth fails
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            state.accessToken = null;
            state.refreshToken = null;
        }).addCase(logoutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        })
        builder
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
            
            // Store tokens from verification response
            if (action.payload.token) {
                state.accessToken = action.payload.token.access;
                state.refreshToken = action.payload.token.refresh;
                localStorage.setItem('accessToken', action.payload.token.access);
                localStorage.setItem('refreshToken', action.payload.token.refresh);
            }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isVerified = false;
        state.error = action.payload || "Verification failed";
      });
    }
});

export const { setUser, resetVerificationState, setEmail } = authSlice.actions;
export default authSlice.reducer;