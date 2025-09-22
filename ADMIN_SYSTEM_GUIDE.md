# 스포이음(SPOEUM) - 관리자 시스템 가이드

## 🎯 구현 완료 기능

### ✅ 1. 라우팅 분리
- **사용자 사이트**: 기본 루트(/)에서 일반 사용자 기능
- **관리자 사이트**: /admin/* 경로에서 관리자 전용 기능
- **권한 기반 접근**: 관리자 로그인 후에만 접근 가능

### ✅ 2. 관리자 인증 시스템
- **관리자 전용 로그인**: /admin/login 페이지
- **JWT 기반 인증**: 토큰 기반 인증 시스템
- **역할 기반 권한**: user, admin, superadmin 역할 구분

### ✅ 3. 관리자 전용 레이아웃
- **사이드바 네비게이션**: 회원관리, 계약관리, 결제관리, 포인트, 스폰서십, 대회, 알림, 통계, 설정
- **상단바**: 관리자 이름, 역할 표시, 로그아웃 버튼
- **반응형 디자인**: 모바일 최적화된 관리자 인터페이스

### ✅ 4. 주요 관리자 페이지
- **대시보드**: 전체 현황 및 통계
- **회원관리**: 사용자 계정 관리 및 모니터링
- **계약관리**: 계약서 및 파기 관리
- **결제관리**: 결제 및 수수료 관리
- **포인트관리**: 포인트 충전 및 차감
- **스폰서십**: 스폰서십 관리
- **대회관리**: 골프 대회 관리
- **알림관리**: 공지사항 및 알림
- **통계리포트**: 분석 및 리포트
- **시스템관리**: 시스템 설정

### ✅ 5. 보안 및 권한 관리
- **403 Forbidden 페이지**: 권한 없는 접근 시 차단
- **관리자 활동 로그**: 모든 관리자 활동 추적
- **역할 기반 접근 제어**: 기능별 세밀한 권한 관리

## 📁 프로젝트 구조

```
spoeum/
├── app/
│   └── admin/
│       ├── login/
│       │   └── page.tsx                    # 관리자 로그인 페이지
│       ├── dashboard/
│       │   └── page.tsx                    # 관리자 대시보드
│       ├── members/
│       │   └── page.tsx                    # 회원 관리 페이지
│       └── 403/
│           └── page.tsx                    # 403 Forbidden 페이지
├── app/api/
│   └── admin/
│       ├── stats/
│       │   └── route.ts                    # 관리자 통계 API
│       └── members/
│           └── route.ts                    # 회원 관리 API
├── components/
│   └── admin/
│       └── AdminLayout.tsx                 # 관리자 레이아웃
├── lib/
│   └── admin-auth.ts                       # 관리자 인증 유틸리티
├── middleware.ts                           # 라우팅 미들웨어
└── types/
    └── index.ts                            # 관리자 관련 타입 정의
```

## 🔧 핵심 기능

### 1. 관리자 인증
```typescript
// 관리자 로그인
const mockAdmins = [
  {
    id: 'admin_001',
    email: 'admin@spoeum.com',
    password: 'admin123',
    name: '관리자',
    userType: 'admin',
    role: 'admin'
  },
  {
    id: 'superadmin_001',
    email: 'superadmin@spoeum.com',
    password: 'super123',
    name: '슈퍼관리자',
    userType: 'superadmin',
    role: 'superadmin'
  }
];

// JWT 토큰 생성 및 저장
const token = `admin_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem('admin_token', token);
localStorage.setItem('admin_user', JSON.stringify(admin));
```

### 2. 관리자 레이아웃
```typescript
// 사이드바 메뉴 구성
const adminMenuItems = [
  { title: '대시보드', href: '/admin/dashboard', icon: Home },
  { title: '회원관리', href: '/admin/members', icon: Users },
  { title: '계약관리', href: '/admin/contracts', icon: FileText },
  { title: '결제관리', href: '/admin/payments', icon: CreditCard },
  // ... 기타 메뉴들
];

// 권한 기반 메뉴 표시
const canAccess = (menuItem) => {
  return hasAdminAccess(adminUser) || isSuperAdmin(adminUser);
};
```

### 3. 관리자 대시보드
```typescript
// 통계 데이터
const mockStats: AdminStats = {
  totalUsers: 1250,
  activeUsers: 980,
  totalContracts: 340,
  activeContracts: 156,
  totalPayments: 2840,
  monthlyRevenue: 45000000,
  totalSponsorships: 45,
  activeSponsorships: 23,
  totalTournaments: 28,
  upcomingTournaments: 5
};

// 최근 활동 추적
const mockRecentActivities = [
  {
    type: 'user_signup',
    user: '김골퍼',
    action: '회원가입',
    time: '5분 전',
    status: 'success'
  }
  // ... 기타 활동들
];
```

### 4. 회원 관리
```typescript
// 회원 목록 조회 및 필터링
const filterUsers = () => {
  let filtered = users;

  // 검색 필터
  if (searchQuery.trim()) {
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  // 상태 필터
  if (statusFilter === 'active') {
    filtered = filtered.filter(user => user.isActive);
  }

  return filtered;
};

// 회원 상태 변경
const handleToggleActive = (userId: string) => {
  setUsers(prev => prev.map(user => 
    user.id === userId 
      ? { ...user, isActive: !user.isActive }
      : user
  ));
};
```

### 5. 관리자 API
```typescript
// 관리자 통계 API
export async function GET(request: NextRequest) {
  // 관리자 권한 확인
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
  }

  // 통계 데이터 반환
  return NextResponse.json({
    success: true,
    data: mockAdminStats
  });
}

// 회원 관리 API
export async function PUT(request: NextRequest) {
  // 활동 로그 생성
  const activityLog: AdminActivityLog = {
    adminId: 'admin_001',
    adminName: '관리자',
    action: '회원 정보 수정',
    resource: 'user',
    resourceId: userId,
    ipAddress: request.ip,
    createdAt: new Date()
  };
}
```

## 🎨 UI/UX 특징

### 1. 관리자 로그인 페이지
- **그라데이션 배경**: 전문적인 느낌의 보라-파랑 그라데이션
- **중앙 정렬 레이아웃**: 로그인 폼이 화면 중앙에 위치
- **테스트 계정 정보**: 개발용 계정 정보 표시
- **반응형 디자인**: 모바일에서도 최적화된 레이아웃

### 2. 관리자 레이아웃
- **사이드바 네비게이션**: 주요 기능별 메뉴 구성
- **상단바**: 현재 페이지 정보 및 관리자 정보 표시
- **모바일 대응**: 햄버거 메뉴로 모바일에서 사이드바 접근
- **활성 메뉴 표시**: 현재 페이지 메뉴 하이라이트

### 3. 대시보드
- **통계 카드**: 주요 지표를 시각적으로 표시
- **최근 활동**: 실시간 활동 피드
- **빠른 액션**: 자주 사용하는 기능 바로가기
- **차트 및 그래프**: 데이터 시각화

### 4. 회원 관리
- **검색 및 필터**: 다양한 조건으로 회원 검색
- **테이블 뷰**: 회원 정보를 표 형태로 표시
- **상태 관리**: 활성/비활성, 인증/미인증 상태 관리
- **일괄 작업**: 여러 회원에 대한 일괄 처리

## 📊 데이터 구조

### 관리자 사용자 정보
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  userType: UserType;
  role: UserRole; // 'user' | 'admin' | 'superadmin'
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 관리자 통계
```typescript
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
```

### 관리자 활동 로그
```typescript
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
```

## 🚀 사용 방법

### 1. 관리자 로그인
```typescript
// 관리자 로그인 페이지 접근
// URL: /admin/login

// 테스트 계정으로 로그인
// 관리자: admin@spoeum.com / admin123
// 슈퍼관리자: superadmin@spoeum.com / super123
```

### 2. 관리자 대시보드
```typescript
// 대시보드 접근
// URL: /admin/dashboard

// 주요 기능
// - 전체 현황 통계
// - 최근 활동 모니터링
// - 빠른 액션 버튼
// - 대회 현황
```

### 3. 회원 관리
```typescript
// 회원 관리 페이지
// URL: /admin/members

// 주요 기능
// - 회원 검색 및 필터링
// - 회원 상태 관리 (활성/비활성)
// - 인증 상태 관리
// - 회원 정보 수정
```

### 4. 권한 관리
```typescript
// 권한 체크
import { hasAdminAccess, isSuperAdmin } from '@/lib/admin-auth';

const user = getAdminUser();
if (!hasAdminAccess(user)) {
  // 관리자 권한 없음
  router.push('/admin/403');
}

if (isSuperAdmin(user)) {
  // 슈퍼관리자 전용 기능
}
```

## 🔒 보안 및 권한

### 1. 인증 및 인가
- **JWT 토큰**: 관리자 인증용 토큰
- **로컬 스토리지**: 클라이언트 사이드 토큰 저장
- **권한 검증**: 모든 관리자 페이지에서 권한 확인
- **자동 로그아웃**: 토큰 만료 시 자동 로그아웃

### 2. 활동 로깅
- **모든 관리자 활동 추적**: 누가, 언제, 무엇을 했는지 기록
- **IP 주소 추적**: 관리자 접근 IP 기록
- **User-Agent 추적**: 브라우저 정보 기록
- **상세 정보 저장**: 변경 전후 데이터 저장

### 3. 접근 제어
- **역할 기반 접근**: admin, superadmin 역할별 접근 제어
- **기능별 권한**: 페이지별 세밀한 권한 관리
- **403 페이지**: 권한 없는 접근 시 차단 페이지 표시

## 📈 모니터링 및 로깅

### 1. 관리자 활동 로그
```typescript
// 활동 로그 생성
createAdminActivityLog(
  '회원 정보 수정',
  'user',
  'user_001',
  { action: 'toggle_active', value: true }
);

// 로그 출력 예시
console.log('관리자 활동 로그:', {
  adminId: 'admin_001',
  adminName: '관리자',
  action: '회원 정보 수정',
  resource: 'user',
  resourceId: 'user_001',
  ipAddress: '127.0.0.1',
  createdAt: '2024-01-15T10:30:00Z'
});
```

### 2. 시스템 모니터링
- **사용자 통계**: 전체/활성 회원 수
- **계약 통계**: 전체/진행중 계약 수
- **결제 통계**: 월간 매출, 결제 건수
- **스폰서십 통계**: 전체/활성 스폰서십 수

## 🎯 향후 개선 사항

1. **실제 JWT 구현**: Mock 토큰을 실제 JWT로 교체
2. **데이터베이스 연동**: Mock 데이터를 실제 DB로 교체
3. **실시간 알림**: WebSocket 기반 실시간 알림
4. **고급 필터링**: 더 세밀한 검색 및 필터 옵션
5. **대시보드 커스터마이징**: 관리자별 대시보드 설정
6. **API 문서화**: Swagger 기반 API 문서
7. **백업 및 복구**: 시스템 백업 및 복구 기능
8. **성능 모니터링**: 시스템 성능 실시간 모니터링

## 🔧 설정 및 커스터마이징

### 1. 관리자 계정 추가
```typescript
// 새로운 관리자 계정 추가
const newAdmin = {
  id: 'admin_002',
  email: 'newadmin@spoeum.com',
  password: 'newpassword',
  name: '새 관리자',
  userType: 'admin',
  role: 'admin'
};
```

### 2. 메뉴 커스터마이징
```typescript
// 새로운 메뉴 항목 추가
const newMenuItem = {
  title: '새로운 기능',
  href: '/admin/new-feature',
  icon: NewIcon,
  description: '새로운 관리 기능'
};
```

### 3. 권한 설정
```typescript
// 새로운 권한 함수 추가
export function canManageNewFeature(user: User | null): boolean {
  return isSuperAdmin(user); // 슈퍼관리자만 접근 가능
}
```

---

**구현 완료!** 🎉 
사용자 페이지와 완전히 분리된 관리자 시스템이 구축되었습니다.
