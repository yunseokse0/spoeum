// 사용자 타입 정의
export type UserType = 'tour_pro' | 'amateur' | 'agency' | 'caddy' | 'sponsor' | 'admin' | 'superadmin';

// 사용자 역할 정의
export type UserRole = 'user' | 'admin' | 'superadmin';

// 계약 타입 정의
export type ContractType = 'tournament' | 'sponsorship' | 'training' | 'annual';

// 폼 데이터 타입
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  userType: UserType;
  companyName?: string;
  businessLicense?: string;
  representative?: string;
  address?: string;
  industry?: string;
  companySize?: 'small' | 'medium' | 'large' | 'enterprise';
}

export interface MatchingRequestFormData {
  title: string;
  description: string;
  location: string;
  date: Date;
  budget: number;
  targetType: UserType;
  tournamentId?: string;
}

// 골프 협회 타입
export type GolfAssociation = 'KLPGA' | 'KPGA';

// 선수 경력 정보
export interface PlayerCareer {
  year: number;
  title: string;
  result: string;
  prize?: number;
  ranking?: number;
}

// 선수 랭킹 정보
export interface PlayerRanking {
  [year: string]: number;
}

// 선수 정보 (크롤링 결과)
export interface PlayerInfo {
  memberId: string;
  name: string;
  association: GolfAssociation;
  birth: string;
  career: PlayerCareer[];
  ranking: PlayerRanking;
  currentRanking?: number;
  totalPrize?: number;
  profileImage?: string;
  isActive?: boolean;
}

// 선수 정보 조회 요청
export interface PlayerSearchRequest {
  memberId: string;
  association: GolfAssociation;
}

// 선수 정보 조회 응답
export interface PlayerSearchResponse {
  success: boolean;
  data?: PlayerInfo;
  error?: string;
  cached?: boolean;
}

// 골프장 정보
export interface GolfCourse {
  id: string;
  name: string;
  region: string;
  city: string;
  code: string;
  logo?: string;
  address: string;
  phone?: string;
  website?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 골프장 검색 요청
export interface GolfCourseSearchRequest {
  query: string;
  region?: string;
  limit?: number;
}

// 골프장 검색 응답
export interface GolfCourseSearchResponse {
  success: boolean;
  data?: GolfCourse[];
  error?: string;
  autoSynced?: boolean;
}

// 캐디 골프장 소속 정보
export interface CaddyGolfCourseMembership {
  caddyId: string;
  mainClub: string;
  additionalClubs: string[];
  freelancer: boolean;
  pendingClub?: string;
  pendingStatus?: 'pending' | 'approved' | 'rejected';
}

// 골프장 승인 요청
export interface GolfCourseApprovalRequest {
  name: string;
  region: string;
  city: string;
  address: string;
  phone?: string;
  website?: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}

// 성별 타입
export type Gender = 'male' | 'female';

// 회원 상태 타입
export type MemberStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// 투어프로 정보
export interface TourProInfo {
  association: GolfAssociation;
  memberNumber?: string;
  gender: Gender; // KLPGA=female, KPGA=male
  career?: PlayerCareer[];
  ranking?: Record<string, number>;
  totalPrize?: number;
}

// 아마추어 정보
export interface AmateurInfo {
  gender?: Gender;
  handicap?: number;
  preferredRegions?: string[];
}

// 캐디 정보
export interface CaddyInfo {
  gender: Gender;
  mainClub?: string;
  additionalClubs?: string[];
  freelancer: boolean;
  licenseNumber?: string;
  career?: number;
  specializations?: string[];
  rating?: number;
  totalContracts?: number;
  hourlyRate?: number;
  availableRegions?: string[];
}

// 스폰서 정보
export interface SponsorInfo {
  companyName: string;
  businessLicense: string;
  representative: string;
  address: string;
  website?: string;
  industry: string;
  companySize: 'small' | 'medium' | 'large' | 'enterprise';
  budget?: number;
  businessLicenseVerified: boolean;
}

// 에이전시 정보
export interface AgencyInfo {
  businessLicense: string;
  companyName: string;
  address: string;
  representative: string;
  businessLicenseVerified: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  userType: UserType;
  role: UserRole;
  profileImage?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // 확장 정보 (userType에 따라 선택적)
  gender?: Gender;
  status: MemberStatus;
  
  // 투어프로 정보
  tourProInfo?: TourProInfo;
  
  // 아마추어 정보
  amateurInfo?: AmateurInfo;
  
  // 캐디 정보
  caddyInfo?: CaddyInfo;
  
  // 스폰서 정보
  sponsorInfo?: SponsorInfo;
  
  // 에이전시 정보
  agencyInfo?: AgencyInfo;
}

// 관리자 로그인 데이터
export interface AdminLoginData {
  email: string;
  password: string;
}

// 관리자 활동 로그
export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

// 관리자 통계
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalContracts: number;
  activeContracts: number;
  totalPayments: number;
  monthlyRevenue: number;
  totalSponsorships: number;
  activeSponsorships: number;
  totalTournaments: number;
  upcomingTournaments: number;
}

// 투어프로 정보
export interface TourPro {
  id: string;
  userId: string;
  licenseNumber: string;
  career: number;
  specializations: string[];
  achievements: string[];
  isActive: boolean;
}

// 아마추어 정보
export interface Amateur {
  id: string;
  userId: string;
  handicap: number;
  preferredRegions: string[];
  budget: number;
  experience: number;
}

// 에이전시 정보
export interface Agency {
  id: string;
  userId: string;
  businessLicense: string;
  companyName: string;
  address: string;
  representative: string;
  isVerified: boolean;
}

// 캐디 정보
export interface Caddy {
  id: string;
  userId: string;
  licenseNumber: string;
  career: number;
  specializations: string[];
  rating: number;
  totalContracts: number;
  isActive: boolean;
  availableRegions: string[];
  hourlyRate: number;
}

// 스폰서 정보
export interface Sponsor {
  id: string;
  userId: string;
  companyName: string;
  businessLicense: string;
  representative: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  industry: string;
  companySize: 'small' | 'medium' | 'large' | 'enterprise';
  budget: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 대회 관련 타입
export interface Tournament {
  id: string;
  name: string;
  description: string;
  location: string;
  course: string;
  startDate: Date;
  endDate: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  type: 'pga' | 'kpga' | 'amateur' | 'corporate' | 'charity';
  category: 'men' | 'women' | 'senior' | 'junior' | 'mixed';
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  organizer: string;
  contactInfo: string;
  website?: string;
  imageUrl?: string;
  isActive: boolean;
  isRegistrationOpen: boolean;
  requirements: string[];
  rules: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TournamentRegistration {
  id: string;
  tournamentId: string;
  userId: string;
  userType: UserType;
  registrationDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'completed' | 'refunded';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 매칭 관련 타입
export interface MatchingRequest {
  id: string;
  requesterId: string;
  requesterType: UserType;
  targetType: UserType;
  title: string;
  description: string;
  location: string;
  date: Date;
  budget: number;
  tournamentId?: string; // 대회 연결
  status: 'pending' | 'matched' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchingProposal {
  id: string;
  requestId: string;
  proposerId: string;
  message: string;
  proposedRate: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

// 계약 파기 정보
export interface ContractCancellation {
  whoCancelled: 'golfer' | 'caddy' | 'sponsor';
  reason: string;
  penaltyPercent: number; // 위약금 비율 (0-100)
  penaltyAmount: number; // 위약금 금액
  beneficiary: 'golfer' | 'caddy' | 'sponsor'; // 위약금 수령자
  date: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentId?: string; // 결제 ID
  notes?: string; // 추가 메모
}

// 계약 파기 요청
export interface ContractCancellationRequest {
  contractId: string;
  whoCancelled: 'golfer' | 'caddy' | 'sponsor';
  reason: string;
  penaltyPercent?: number; // 기본값 20%
}

// 계약 파기 응답
export interface ContractCancellationResponse {
  success: boolean;
  data?: {
    contractId: string;
    cancellation: ContractCancellation;
    newStatus: 'pending' | 'active' | 'completed' | 'cancelled';
  };
  error?: string;
}

// 계약 관련 타입
export interface Contract {
  id: string;
  tourProId?: string;
  caddyId?: string;
  amateurId?: string;
  sponsorId?: string;
  tournamentId?: string;
  type: ContractType;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  terms: any; // ContractTerms 객체
  startDate: Date;
  endDate: Date;
  cancellation?: ContractCancellation; // 계약 파기 정보
  penaltyRate?: number; // 계약 시 설정된 위약금 비율 (기본 20%)
  contractDetails?: any; // 계약서 상세 내용
  createdAt: Date;
  updatedAt: Date;
}

// 결제 관련 타입
export interface Payment {
  id: string;
  contractId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  type: 'weekly' | 'incentive' | 'house_caddy_fee' | 'annual_fee' | 'penalty';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'bank_transfer' | 'point';
  description: string;
  processedAt?: Date;
  createdAt: Date;
}

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'charge' | 'deduct' | 'refund' | 'reward';
  description: string;
  balance: number;
  createdAt: Date;
}

// 알림 관련 타입
export interface Notification {
  id: string;
  userId: string;
  type: 'contract_completed' | 'contract_cancelled' | 'payment_received' | 'proposal_accepted' | 'proposal_rejected' | 'general';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

// 스폰서십 관련 타입
export interface Sponsorship {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  contactInfo: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SponsorshipInquiry {
  id: string;
  sponsorshipId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

// 스폰서십 매칭 관련 타입
export type ExposureItem = 'golf_bag' | 'hat' | 'shirt' | 'pants';
export type SponsorshipStatus = 'proposed' | 'accepted' | 'rejected' | 'counter_proposed' | 'active' | 'completed' | 'cancelled';

export interface SponsorshipProposal {
  id: string;
  sponsorId: string;
  playerId: string;
  exposureItems: ExposureItem[];
  startDate: Date;
  endDate: Date;
  amount: number;
  isTournamentBased: boolean;
  tournamentId?: string;
  message: string;
  status: SponsorshipStatus;
  counterAmount?: number;
  counterMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SponsorshipContract {
  id: string;
  proposalId: string;
  sponsorId: string;
  playerId: string;
  exposureItems: ExposureItem[];
  startDate: Date;
  endDate: Date;
  amount: number;
  isTournamentBased: boolean;
  tournamentId?: string;
  terms: string;
  status: 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

// 게시판 관련 타입
export interface BoardPost {
  id: string;
  boardType: 'notice' | 'faq' | 'inquiry' | 'review';
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 폼 타입
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  userType: UserType;
  // 스폰서 전용 필드
  companyName?: string;
  businessLicense?: string;
  representative?: string;
  address?: string;
  industry?: string;
  companySize?: 'small' | 'medium' | 'large' | 'enterprise';
}

export interface MatchingRequestForm {
  title: string;
  description: string;
  location: string;
  date: Date;
  budget: number;
  targetType: UserType;
}

export interface ContractForm {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  baseRate: number;
  terms: string;
}

export interface SponsorshipProposalForm {
  playerId: string;
  exposureItems: ExposureItem[];
  startDate: Date;
  endDate: Date;
  amount: number;
  isTournamentBased: boolean;
  tournamentId?: string;
  message: string;
}

// 필터 및 검색 타입
export interface UserFilter {
  userType?: UserType;
  region?: string;
  minRating?: number;
  maxRate?: number;
  isActive?: boolean;
}

export interface MatchingFilter {
  status?: string;
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
  budgetMin?: number;
  budgetMax?: number;
  tournamentId?: string;
}

export interface TournamentFilter {
  type?: string;
  category?: string;
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
  isRegistrationOpen?: boolean;
  isActive?: boolean;
}

export interface SponsorshipFilter {
  status?: SponsorshipStatus;
  exposureItem?: ExposureItem;
  amountMin?: number;
  amountMax?: number;
  isTournamentBased?: boolean;
}

// 통계 타입
export interface DashboardStats {
  totalUsers: number;
  activeContracts: number;
  monthlyRevenue: number;
  pendingRequests: number;
}

export interface UserStats {
  totalContracts: number;
  completedContracts: number;
  averageRating: number;
  totalEarnings: number;
}
