import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Contract, MatchingRequest, MatchingProposal, MatchingFilter } from '@/types';
import api from '@/lib/api';

interface ContractState {
  contracts: Contract[];
  matchingRequests: MatchingRequest[];
  matchingProposals: MatchingProposal[];
  currentContract: Contract | null;
  filters: MatchingFilter;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ContractState = {
  contracts: [],
  matchingRequests: [],
  matchingProposals: [],
  currentContract: null,
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
export const fetchContracts = createAsyncThunk(
  'contract/fetchContracts',
  async (params: { page?: number; limit?: number; filters?: MatchingFilter }, { rejectWithValue }) => {
    try {
      const response = await api.getContracts(params);
      
      if (response.success && response.data) {
        return {
          contracts: response.data,
          pagination: response.pagination,
        };
      } else {
        return rejectWithValue(response.message || '계약 목록을 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '계약 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

export const fetchMatchingRequests = createAsyncThunk(
  'contract/fetchMatchingRequests',
  async (params: { page?: number; limit?: number; filters?: MatchingFilter }, { rejectWithValue }) => {
    try {
      const response = await api.getMatchingRequests(params);
      
      if (response.success && response.data) {
        return {
          requests: response.data,
          pagination: response.pagination,
        };
      } else {
        return rejectWithValue(response.message || '매칭 요청 목록을 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '매칭 요청 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

export const createMatchingRequest = createAsyncThunk(
  'contract/createMatchingRequest',
  async (requestData: any, { rejectWithValue }) => {
    try {
      const response = await api.createMatchingRequest(requestData);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '매칭 요청 생성에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '매칭 요청 생성 중 오류가 발생했습니다.');
    }
  }
);

export const fetchMatchingProposals = createAsyncThunk(
  'contract/fetchMatchingProposals',
  async (params: { page?: number; limit?: number; requestId?: string }, { rejectWithValue }) => {
    try {
      const response = await api.getProposals(params);
      
      if (response.success && response.data) {
        return {
          proposals: response.data,
          pagination: response.pagination,
        };
      } else {
        return rejectWithValue(response.message || '제안 목록을 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '제안 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

export const createProposal = createAsyncThunk(
  'contract/createProposal',
  async (proposalData: any, { rejectWithValue }) => {
    try {
      const response = await api.createProposal(proposalData);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '제안 생성에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '제안 생성 중 오류가 발생했습니다.');
    }
  }
);

export const updateProposal = createAsyncThunk(
  'contract/updateProposal',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.updateProposal(id, data);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '제안 업데이트에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '제안 업데이트 중 오류가 발생했습니다.');
    }
  }
);

export const createContract = createAsyncThunk(
  'contract/createContract',
  async (contractData: any, { rejectWithValue }) => {
    try {
      const response = await api.createContract(contractData);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '계약 생성에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '계약 생성 중 오류가 발생했습니다.');
    }
  }
);

export const cancelContract = createAsyncThunk(
  'contract/cancelContract',
  async ({ id, reason }: { id: string; reason: string }, { rejectWithValue }) => {
    try {
      const response = await api.cancelContract(id, reason);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '계약 취소에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '계약 취소 중 오류가 발생했습니다.');
    }
  }
);

// Contract slice
const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<MatchingFilter>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentContract: (state, action: PayloadAction<Contract>) => {
      state.currentContract = action.payload;
    },
    clearCurrentContract: (state) => {
      state.currentContract = null;
    },
    setPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
      state.pagination.page = action.payload.page;
      state.pagination.limit = action.payload.limit;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Contracts
      .addCase(fetchContracts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts = action.payload.contracts;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Matching Requests
      .addCase(fetchMatchingRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatchingRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matchingRequests = action.payload.requests;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchMatchingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Matching Request
      .addCase(createMatchingRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMatchingRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matchingRequests.unshift(action.payload);
        state.error = null;
      })
      .addCase(createMatchingRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Matching Proposals
      .addCase(fetchMatchingProposals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatchingProposals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matchingProposals = action.payload.proposals;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchMatchingProposals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Proposal
      .addCase(createProposal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProposal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matchingProposals.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProposal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Proposal
      .addCase(updateProposal.fulfilled, (state, action) => {
        const index = state.matchingProposals.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.matchingProposals[index] = action.payload;
        }
      })
      
      // Create Contract
      .addCase(createContract.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts.unshift(action.payload);
        state.error = null;
      })
      .addCase(createContract.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Cancel Contract
      .addCase(cancelContract.fulfilled, (state, action) => {
        const index = state.contracts.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
        if (state.currentContract?.id === action.payload.id) {
          state.currentContract = action.payload;
        }
      });
  },
});

export const { 
  clearError, 
  setFilters, 
  clearFilters, 
  setCurrentContract, 
  clearCurrentContract,
  setPagination 
} = contractSlice.actions;

export default contractSlice.reducer;

// Selectors
export const selectContracts = (state: { contract: ContractState }) => state.contract.contracts;
export const selectMatchingRequests = (state: { contract: ContractState }) => state.contract.matchingRequests;
export const selectMatchingProposals = (state: { contract: ContractState }) => state.contract.matchingProposals;
export const selectCurrentContract = (state: { contract: ContractState }) => state.contract.currentContract;
export const selectContractFilters = (state: { contract: ContractState }) => state.contract.filters;
export const selectContractLoading = (state: { contract: ContractState }) => state.contract.isLoading;
export const selectContractError = (state: { contract: ContractState }) => state.contract.error;
export const selectContractPagination = (state: { contract: ContractState }) => state.contract.pagination;
