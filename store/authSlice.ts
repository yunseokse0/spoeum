import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserType, LoginFormData, SignupFormData } from '@/types';
import api from '@/lib/api';
import { generateToken, verifyToken } from '@/lib/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userType: UserType | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  userType: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await api.login(credentials.email, credentials.password);
      
      if (response.success && response.data) {
        // 토큰을 localStorage에 저장
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
        
        return response.data;
      } else {
        return rejectWithValue(response.message || '로그인에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData: SignupFormData, { rejectWithValue }) => {
    try {
      const response = await api.signup(userData);
      
      if (response.success && response.data) {
        // 토큰을 localStorage에 저장
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
        
        return response.data;
      } else {
        return rejectWithValue(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.logout();
      
      // localStorage에서 토큰 제거
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      
      return true;
    } catch (error: any) {
      // 에러가 발생해도 로컬 로그아웃은 수행
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      return true;
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  'auth/refreshUserToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.refreshToken();
      
      if (response.success && response.data) {
        // 새로운 토큰을 localStorage에 저장
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
        
        return response.data.token;
      } else {
        return rejectWithValue(response.message || '토큰 갱신에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '토큰 갱신 중 오류가 발생했습니다.');
    }
  }
);

export const loadUserProfile = createAsyncThunk(
  'auth/loadUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getProfile();
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '프로필 로드에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '프로필 로드 중 오류가 발생했습니다.');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await api.updateProfile(userData);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '프로필 업데이트에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.userType = action.payload.userType;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userType = null;
      state.error = null;
    },
    initializeAuth: (state) => {
      // 앱 시작 시 localStorage에서 토큰 확인
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const decoded = verifyToken(token);
          if (decoded) {
            state.token = token;
            state.userType = decoded.userType;
            state.isAuthenticated = true;
          } else {
            // 토큰이 유효하지 않으면 제거
            localStorage.removeItem('auth_token');
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.userType = action.payload.user.userType;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.userType = action.payload.user.userType;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.userType = null;
        state.error = null;
      })
      
      // Refresh Token
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      
      // Load Profile
      .addCase(loadUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.userType = action.payload.userType;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser, clearAuth, initializeAuth } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserType = (state: { auth: AuthState }) => state.auth.userType;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
