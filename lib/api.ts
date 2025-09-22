import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse, Tournament, TournamentFilter, Sponsor, SponsorshipProposal, SponsorshipProposalForm, SponsorshipFilter, PlayerInfo, PlayerSearchResponse, GolfAssociation, GolfCourse, GolfCourseSearchRequest, GolfCourseSearchResponse, GolfCourseApprovalRequest, ContractCancellationRequest, ContractCancellationResponse, Contract } from '@/types';

// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // 현재 페이지 정보를 로그인 페이지로 전달
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

// API 클래스
class ApiClient {
  // 일반 HTTP 메서드
  async get(url: string, config?: AxiosRequestConfig): Promise<any> {
    const response = await apiClient.get(url, config);
    return response.data;
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    const response = await apiClient.post(url, data, config);
    return response.data;
  }

  async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    const response = await apiClient.put(url, data, config);
    return response.data;
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<any> {
    const response = await apiClient.delete(url, config);
    return response.data;
  }

  // 인증 관련 API
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  }

  async signup(userData: any): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  }

  // 사용자 관련 API
  async getProfile(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/users/profile');
    return response.data;
  }

  async updateProfile(userData: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put('/users/profile', userData);
    return response.data;
  }

  async getUsers(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/users', { params });
    return response.data;
  }

  // 매칭 관련 API
  async getMatchingRequests(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/matching/requests', { params });
    return response.data;
  }

  async createMatchingRequest(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/matching/requests', data);
    return response.data;
  }

  async getMatchingRequest(id: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/matching/requests/${id}`);
    return response.data;
  }

  async updateMatchingRequest(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`/matching/requests/${id}`, data);
    return response.data;
  }

  async deleteMatchingRequest(id: string): Promise<ApiResponse> {
    const response = await apiClient.delete(`/matching/requests/${id}`);
    return response.data;
  }

  // 제안 관련 API
  async getProposals(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/matching/proposals', { params });
    return response.data;
  }

  async createProposal(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/matching/proposals', data);
    return response.data;
  }

  async updateProposal(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`/matching/proposals/${id}`, data);
    return response.data;
  }

  // 계약 관련 API
  async getContracts(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/contracts', { params });
    return response.data;
  }

  async createContract(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/contracts', data);
    return response.data;
  }

  async getContract(id: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/contracts/${id}`);
    return response.data;
  }

  async updateContract(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`/contracts/${id}`, data);
    return response.data;
  }

  async cancelContract(id: string, reason: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/contracts/${id}/cancel`, { reason });
    return response.data;
  }

  // 결제 관련 API
  async getPayments(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/payments', { params });
    return response.data;
  }

  async createPayment(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/payments', data);
    return response.data;
  }

  async processPayment(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/payments/${id}/process`, data);
    return response.data;
  }

  // 포인트 관련 API
  async getPointTransactions(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/points/transactions', { params });
    return response.data;
  }

  async chargePoints(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/points/charge', data);
    return response.data;
  }

  async getPointBalance(): Promise<ApiResponse<{ balance: number }>> {
    const response = await apiClient.get('/points/balance');
    return response.data;
  }

  // 알림 관련 API
  async getNotifications(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse> {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse> {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  }

  // 스폰서십 관련 API
  async getSponsorships(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/sponsorships', { params });
    return response.data;
  }

  async createSponsorshipInquiry(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/sponsorships/inquiries', data);
    return response.data;
  }

  // 게시판 관련 API
  async getBoardPosts(boardType: string, params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(`/boards/${boardType}`, { params });
    return response.data;
  }

  async getBoardPost(boardType: string, id: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/boards/${boardType}/${id}`);
    return response.data;
  }

  async createBoardPost(boardType: string, data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/boards/${boardType}`, data);
    return response.data;
  }

  async updateBoardPost(boardType: string, id: string, data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`/boards/${boardType}/${id}`, data);
    return response.data;
  }

  async deleteBoardPost(boardType: string, id: string): Promise<ApiResponse> {
    const response = await apiClient.delete(`/boards/${boardType}/${id}`);
    return response.data;
  }

  // 관리자 관련 API
  async getDashboardStats(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  }

  async getAdminUsers(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  }

  async updateUserStatus(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`/admin/users/${id}/status`, data);
    return response.data;
  }

  // 대회 관련 API
  async getTournaments(params?: TournamentFilter & { page?: number; limit?: number }): Promise<PaginatedResponse<Tournament>> {
    const response = await apiClient.get('/tournaments', { params });
    return response.data;
  }

  async getTournament(id: string): Promise<ApiResponse<Tournament>> {
    const response = await apiClient.get(`/tournaments/${id}`);
    return response.data;
  }

  // 스폰서 관련 API
  async getSponsors(params?: { page?: number; limit?: number; industry?: string; companySize?: string; isVerified?: boolean }): Promise<PaginatedResponse<Sponsor>> {
    const response = await apiClient.get('/sponsors', { params });
    return response.data;
  }

  async createSponsor(data: any): Promise<ApiResponse<Sponsor>> {
    const response = await apiClient.post('/sponsors', data);
    return response.data;
  }

  // 스폰서십 관련 API
  async getSponsorshipProposals(params?: SponsorshipFilter & { page?: number; limit?: number; sponsorId?: string; playerId?: string }): Promise<PaginatedResponse<SponsorshipProposal>> {
    const response = await apiClient.get('/sponsorship/proposals', { params });
    return response.data;
  }

  async createSponsorshipProposal(data: SponsorshipProposalForm): Promise<ApiResponse<SponsorshipProposal>> {
    const response = await apiClient.post('/sponsorship/proposals', data);
    return response.data;
  }

  async respondToSponsorshipProposal(id: string, action: 'accept' | 'reject' | 'counter_propose', counterAmount?: number, counterMessage?: string): Promise<ApiResponse<SponsorshipProposal>> {
    const response = await apiClient.post(`/sponsorship/proposals/${id}/response`, {
      action,
      counterAmount,
      counterMessage,
    });
    return response.data;
  }

  // 파일 업로드
  async uploadFile(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // 선수 정보 조회
  async searchPlayer(memberId: string, association: GolfAssociation): Promise<PlayerSearchResponse> {
    const { data } = await apiClient.get(`/player/${association}/${memberId}`);
    return data;
  }

  // 골프장 검색
  async searchGolfCourses(request: GolfCourseSearchRequest): Promise<GolfCourseSearchResponse> {
    const params = new URLSearchParams({
      q: request.query,
      ...(request.region && { region: request.region }),
      ...(request.limit && { limit: request.limit.toString() })
    });
    
    const { data } = await apiClient.get(`/golf-courses/search?${params}`);
    return data;
  }

  // 골프장 승인 요청
  async requestGolfCourseApproval(approvalRequest: Omit<GolfCourseApprovalRequest, 'status' | 'approvedAt'>): Promise<ApiResponse<GolfCourseApprovalRequest>> {
    const { data } = await apiClient.post('/golf-courses/approval', approvalRequest);
    return data;
  }

  // 관리자: 승인 요청 목록 조회
  async getApprovalRequests(status?: string): Promise<ApiResponse<GolfCourseApprovalRequest[]>> {
    const params = status ? `?status=${status}` : '';
    const { data } = await apiClient.get(`/golf-courses/approval${params}`);
    return data;
  }

  // 골프장 목록 동기화
  async syncGolfCourses(): Promise<ApiResponse<any>> {
    const { data } = await apiClient.post('/golf-courses/sync');
    return data;
  }

  // 골프장 목록 조회 (통계 포함)
  async getGolfCourses(includeStats?: boolean): Promise<ApiResponse<GolfCourse[]>> {
    const params = includeStats ? '?stats=true' : '';
    const { data } = await apiClient.get(`/golf-courses/sync${params}`);
    return data;
  }

  // 계약 파기

  // 계약 조회

}

// API 클라이언트 인스턴스 생성 및 내보내기
const api = new ApiClient();
export default api;

// 개별 메서드도 내보내기
export {
  apiClient,
  ApiClient,
};
