import { z } from 'zod';

// 기본 검증 스키마
export const emailSchema = z.string().email('올바른 이메일 형식이 아닙니다.');
export const passwordSchema = z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.');
export const phoneSchema = z.string()
  .regex(/^(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/, '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678 또는 01012345678)')
  .transform((val) => {
    // 숫자만 남기기
    const numbersOnly = val.replace(/[^\d]/g, '');
    
    // 11자리인 경우 하이픈 추가
    if (numbersOnly.length === 11) {
      return numbersOnly.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
    }
    
    // 10자리인 경우 (일부 통신사)
    if (numbersOnly.length === 10) {
      return numbersOnly.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    }
    
    return val;
  });
export const nameSchema = z.string().min(2, '이름은 최소 2자 이상이어야 합니다.');

// 로그인 폼 검증
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// 회원가입 폼 검증
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
  name: nameSchema,
  phone: phoneSchema,
  userType: z.enum(['tour_pro', 'amateur', 'agency', 'caddy', 'sponsor'], {
    errorMap: () => ({ message: '올바른 사용자 타입을 선택해주세요.' }),
  }),
  // 스폰서 전용 필드
  companyName: z.string().optional(),
  businessLicense: z.string().optional(),
  representative: z.string().optional(),
  address: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.enum(['small', 'medium', 'large', 'enterprise']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

// 매칭 요청 폼 검증
export const matchingRequestSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  description: z.string().min(10, '설명은 최소 10자 이상이어야 합니다.'),
  location: z.string().min(1, '위치를 입력해주세요.'),
  date: z.date({
    required_error: '날짜를 선택해주세요.',
  }),
  budget: z.number().min(0, '예산은 0원 이상이어야 합니다.'),
  targetType: z.enum(['tour_pro', 'amateur', 'agency', 'caddy'], {
    errorMap: () => ({ message: '올바른 대상 타입을 선택해주세요.' }),
  }),
});

// 계약 폼 검증
export const contractSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  description: z.string().min(10, '설명은 최소 10자 이상이어야 합니다.'),
  startDate: z.date({
    required_error: '시작 날짜를 선택해주세요.',
  }),
  endDate: z.date({
    required_error: '종료 날짜를 선택해주세요.',
  }),
  location: z.string().min(1, '위치를 입력해주세요.'),
  baseRate: z.number().min(0, '기본 요금은 0원 이상이어야 합니다.'),
  terms: z.string().min(1, '계약 조건을 입력해주세요.'),
}).refine((data) => data.endDate > data.startDate, {
  message: '종료 날짜는 시작 날짜보다 늦어야 합니다.',
  path: ['endDate'],
});

// 투어프로 정보 검증
export const tourProSchema = z.object({
  licenseNumber: z.string().min(1, '라이센스 번호를 입력해주세요.'),
  career: z.number().min(0, '경력은 0년 이상이어야 합니다.'),
  specializations: z.array(z.string()).min(1, '최소 하나의 전문 분야를 선택해주세요.'),
  achievements: z.array(z.string()).optional(),
});

// 아마추어 정보 검증
export const amateurSchema = z.object({
  handicap: z.number().min(0).max(54, '핸디캡은 0-54 사이여야 합니다.'),
  preferredRegions: z.array(z.string()).min(1, '최소 하나의 선호 지역을 선택해주세요.'),
  budget: z.number().min(0, '예산은 0원 이상이어야 합니다.'),
  experience: z.number().min(0, '경험은 0년 이상이어야 합니다.'),
});

// 에이전시 정보 검증
export const agencySchema = z.object({
  businessLicense: z.string().min(1, '사업자 등록번호를 입력해주세요.'),
  companyName: z.string().min(1, '회사명을 입력해주세요.'),
  address: z.string().min(1, '주소를 입력해주세요.'),
  representative: z.string().min(1, '대표자명을 입력해주세요.'),
});

// 캐디 정보 검증
export const caddySchema = z.object({
  licenseNumber: z.string().min(1, '라이센스 번호를 입력해주세요.'),
  career: z.number().min(0, '경력은 0년 이상이어야 합니다.'),
  specializations: z.array(z.string()).min(1, '최소 하나의 전문 분야를 선택해주세요.'),
  availableRegions: z.array(z.string()).min(1, '최소 하나의 가능 지역을 선택해주세요.'),
  hourlyRate: z.number().min(0, '시간당 요금은 0원 이상이어야 합니다.'),
});

// 결제 정보 검증
export const paymentSchema = z.object({
  amount: z.number().min(0, '금액은 0원 이상이어야 합니다.'),
  method: z.enum(['card', 'bank_transfer', 'point'], {
    errorMap: () => ({ message: '올바른 결제 방법을 선택해주세요.' }),
  }),
  description: z.string().min(1, '결제 설명을 입력해주세요.'),
});

// 포인트 충전 검증
export const pointChargeSchema = z.object({
  amount: z.number().min(1000, '최소 충전 금액은 1,000원입니다.').max(1000000, '최대 충전 금액은 1,000,000원입니다.'),
  method: z.enum(['card', 'bank_transfer'], {
    errorMap: () => ({ message: '올바른 결제 방법을 선택해주세요.' }),
  }),
});

// 스폰서십 문의 검증
export const sponsorshipInquirySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  message: z.string().min(10, '문의 내용은 최소 10자 이상이어야 합니다.'),
});

// 스폰서십 제안 검증
export const sponsorshipProposalSchema = z.object({
  playerId: z.string().min(1, '선수 ID는 필수입니다.'),
  exposureItems: z.array(z.enum(['golf_bag', 'hat', 'shirt', 'pants'])).min(1, '최소 하나의 노출 부위를 선택해주세요.'),
  startDate: z.date({
    required_error: '시작 날짜를 선택해주세요.',
  }),
  endDate: z.date({
    required_error: '종료 날짜를 선택해주세요.',
  }),
  amount: z.number().min(0, '금액은 0원 이상이어야 합니다.'),
  isTournamentBased: z.boolean().optional(),
  tournamentId: z.string().optional(),
  message: z.string().min(10, '제안 메시지는 최소 10자 이상이어야 합니다.'),
}).refine((data) => data.endDate > data.startDate, {
  message: '종료 날짜는 시작 날짜보다 늦어야 합니다.',
  path: ['endDate'],
});

// 게시판 글 검증
export const boardPostSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(100, '제목은 100자 이하여야 합니다.'),
  content: z.string().min(10, '내용은 최소 10자 이상이어야 합니다.').max(5000, '내용은 5000자 이하여야 합니다.'),
  isPublic: z.boolean().optional(),
});

// 댓글 검증
export const commentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해주세요.').max(500, '댓글은 500자 이하여야 합니다.'),
});

// 사용자 프로필 업데이트 검증
export const profileUpdateSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  profileImage: z.string().optional(),
});

// 비밀번호 변경 검증
export const passwordChangeSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '새 비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: '새 비밀번호는 현재 비밀번호와 달라야 합니다.',
  path: ['newPassword'],
});

// 검색 필터 검증
export const searchFilterSchema = z.object({
  query: z.string().optional(),
  userType: z.enum(['tour_pro', 'amateur', 'agency', 'caddy']).optional(),
  region: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
  maxRate: z.number().min(0).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
});

// 파일 업로드 검증
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, '파일 크기는 5MB 이하여야 합니다.')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'JPEG, PNG, WebP 파일만 업로드 가능합니다.'
    ),
});

// 타입 내보내기
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type MatchingRequestFormData = z.infer<typeof matchingRequestSchema>;
export type ContractFormData = z.infer<typeof contractSchema>;
export type TourProFormData = z.infer<typeof tourProSchema>;
export type AmateurFormData = z.infer<typeof amateurSchema>;
export type AgencyFormData = z.infer<typeof agencySchema>;
export type CaddyFormData = z.infer<typeof caddySchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type PointChargeFormData = z.infer<typeof pointChargeSchema>;
export type SponsorshipInquiryFormData = z.infer<typeof sponsorshipInquirySchema>;
export type SponsorshipProposalFormData = z.infer<typeof sponsorshipProposalSchema>;
export type BoardPostFormData = z.infer<typeof boardPostSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type SearchFilterFormData = z.infer<typeof searchFilterSchema>;
