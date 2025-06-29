import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

// User Authentication
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/register', userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Login failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/user/check');
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Auth check failed');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      // This is intentionally empty - the actual login happens via redirect
      return null;
    } catch (error) {
      return rejectWithValue('Google login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Logout failed');
    }
  }
);

// College Authentication
export const collegeRegister = createAsyncThunk(
  'auth/collegeRegister',
  async (collegeData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/collegeAuth/register', collegeData);
      return response.data.college;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'College registration failed');
    }
  }
);

export const collegeLogin = createAsyncThunk(
  'auth/collegeLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/collegeAuth/login', credentials);
      return response.data.college;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'College login failed');
    }
  }
);

export const checkCollegeAuth = createAsyncThunk(
  'auth/checkCollegeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/user/collegeAuth/checkAuth');
      return response.data.college;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'College auth check failed');
    }
  }
);

export const logoutCollege = createAsyncThunk(
  'auth/logoutCollege',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/collegeAuth/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'College logout failed');
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isUserAuthenticated: false,
    college: null,
    isCollegeAuthenticated: false,
    loading: false,
    error: null,
    userCheckComplete: false,
    collegeCheckComplete: false
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.isUserAuthenticated = false;
      state.college = null;
      state.isCollegeAuthenticated = false;
      state.error = null;
      state.userCheckComplete = false;
      state.collegeCheckComplete = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // User Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isUserAuthenticated = true;
        state.user = action.payload;
        state.college = null;
        state.isCollegeAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isUserAuthenticated = false;
        state.user = null;
      })
      
      // User Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isUserAuthenticated = true;
        state.user = action.payload;
        state.college = null;
        state.isCollegeAuthenticated = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isUserAuthenticated = false;
        state.user = null;
      })
      
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // User Auth Check
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.userCheckComplete = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isUserAuthenticated = !!action.payload;
        state.userCheckComplete = true;
        
        if (action.payload) {
          state.college = null;
          state.isCollegeAuthenticated = false;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isUserAuthenticated = false;
        state.user = null;
        state.userCheckComplete = true;
      })
      
      // User Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isUserAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // College Register
      .addCase(collegeRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(collegeRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.isCollegeAuthenticated = true;
        state.college = action.payload;
        state.user = null;
        state.isUserAuthenticated = false;
      })
      .addCase(collegeRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isCollegeAuthenticated = false;
        state.college = null;
      })
      
      // College Login
      .addCase(collegeLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(collegeLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isCollegeAuthenticated = true;
        state.college = action.payload;
        state.user = null;
        state.isUserAuthenticated = false;
      })
      .addCase(collegeLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isCollegeAuthenticated = false;
        state.college = null;
      })
      
      // College Auth Check
      .addCase(checkCollegeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.collegeCheckComplete = false;
      })
      .addCase(checkCollegeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.college = action.payload;
        state.isCollegeAuthenticated = !!action.payload;
        state.collegeCheckComplete = true;
        
        if (action.payload) {
          state.user = null;
          state.isUserAuthenticated = false;
        }
      })
      .addCase(checkCollegeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isCollegeAuthenticated = false;
        state.college = null;
        state.collegeCheckComplete = true;
      })
      
      // College Logout
      .addCase(logoutCollege.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutCollege.fulfilled, (state) => {
        state.loading = false;
        state.college = null;
        state.isCollegeAuthenticated = false;
      })
      .addCase(logoutCollege.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAuthError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;