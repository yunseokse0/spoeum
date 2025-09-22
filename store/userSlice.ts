import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserFilter, UserStats } from '@/types';
import api from '@/lib/api';

interface UserState {
  users: User[];
  currentUser: User | null;
  userStats: UserStats | null;
  filters: UserFilter;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  userStats: null,
  filters: {},
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (params: { page?: number; limit?: number; filters?: UserFilter }, { rejectWithValue }) => {
    try {
      const response = await api.getUsers(params);
      
      if (response.success && response.data) {
        return {
          users: response.data,
          pagination: response.pagination,
        };
      } else {
        return rejectWithValue(response.message || '사용자 목록을 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '사용자 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'user/fetchUserStats',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}/stats`);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '사용자 통계를 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '사용자 통계를 불러오는 중 오류가 발생했습니다.');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'user/updateUserStatus',
  async ({ userId, status }: { userId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.updateUserStatus(userId, { status });
      
      if (response.success && response.data) {
        return { userId, user: response.data };
      } else {
        return rejectWithValue(response.message || '사용자 상태 업데이트에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '사용자 상태 업데이트 중 오류가 발생했습니다.');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<UserFilter>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
      state.pagination.page = action.payload.page;
      state.pagination.limit = action.payload.limit;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch User Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, user } = action.payload;
        const index = state.users.findIndex(u => u.id === userId);
        if (index !== -1) {
          state.users[index] = user;
        }
        if (state.currentUser?.id === userId) {
          state.currentUser = user;
        }
      });
  },
});

export const { 
  clearError, 
  setFilters, 
  clearFilters, 
  setCurrentUser, 
  clearCurrentUser,
  setPagination 
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUsers = (state: { user: UserState }) => state.user.users;
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectUserStats = (state: { user: UserState }) => state.user.userStats;
export const selectUserFilters = (state: { user: UserState }) => state.user.filters;
export const selectUserLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserPagination = (state: { user: UserState }) => state.user.pagination;
