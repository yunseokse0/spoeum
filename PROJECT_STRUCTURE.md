# 스포이음(SPOEUM) 프로젝트 구조

## 📁 프로젝트 폴더 구조

```
spoeum-mobile-app/
├── 📁 app/                           # Next.js App Router
│   ├── 📁 (auth)/                   # 인증 관련 페이지 그룹
│   │   ├── 📄 login/page.tsx        # 로그인 페이지
│   │   └── 📄 signup/page.tsx       # 회원가입 페이지
│   ├── 📁 (dashboard)/              # 대시보드 페이지 그룹
│   │   ├── 📄 dashboard/page.tsx    # 메인 대시보드
│   │   ├── 📄 matching/page.tsx     # 매칭 서비스
│   │   ├── 📄 contracts/page.tsx    # 계약 관리
│   │   ├── 📄 payments/page.tsx     # 결제 관리
│   │   └── 📄 profile/page.tsx      # 프로필 관리
│   ├── 📁 admin/                    # 관리자 페이지
│   │   └── 📄 page.tsx              # 관리자 대시보드
│   ├── 📁 api/                      # API 라우트
│   │   ├── 📁 auth/                 # 인증 API
│   │   │   ├── 📄 login/route.ts    # 로그인 API
│   │   │   └── 📄 signup/route.ts   # 회원가입 API
│   │   ├── 📁 users/                # 사용자 API
│   │   │   └── 📄 profile/route.ts  # 프로필 API
│   │   └── 📁 matching/             # 매칭 API
│   │       └── 📄 requests/route.ts # 매칭 요청 API
│   ├── 📄 globals.css               # 전역 스타일
│   ├── 📄 layout.tsx                # 루트 레이아웃
│   └── 📄 page.tsx                  # 메인 페이지
├── 📁 components/                   # 재사용 컴포넌트
│   ├── 📁 ui/                       # 기본 UI 컴포넌트
│   │   ├── 📄 Button.tsx            # 버튼 컴포넌트
│   │   ├── 📄 Input.tsx             # 입력 컴포넌트
│   │   ├── 📄 Card.tsx              # 카드 컴포넌트
│   │   └── 📄 Badge.tsx             # 배지 컴포넌트
│   ├── 📁 layout/                   # 레이아웃 컴포넌트
│   │   ├── 📄 Header.tsx            # 헤더 컴포넌트
│   │   └── 📄 BottomNavigation.tsx  # 하단 네비게이션
│   └── 📁 providers/                # 프로바이더 컴포넌트
│       ├── 📄 Providers.tsx         # 메인 프로바이더
│       └── 📄 ThemeProvider.tsx     # 테마 프로바이더
├── 📁 lib/                          # 유틸리티 및 설정
│   ├── 📄 auth.ts                   # 인증 관련 함수
│   ├── 📄 api.ts                    # API 클라이언트
│   ├── 📄 utils.ts                  # 공통 유틸리티
│   └── 📄 validations.ts            # 폼 검증 스키마
├── 📁 store/                        # 상태 관리
│   ├── 📄 index.ts                  # Redux store 설정
│   ├── 📄 authSlice.ts              # 인증 상태 관리
│   ├── 📄 userSlice.ts              # 사용자 상태 관리
│   ├── 📄 contractSlice.ts          # 계약 상태 관리
│   ├── 📄 useAuthStore.ts           # Zustand 인증 스토어
│   └── 📄 useNotificationStore.ts   # Zustand 알림 스토어
├── 📁 types/                        # TypeScript 타입 정의
│   └── 📄 index.ts                  # 모든 타입 정의
├── 📁 public/                       # 정적 파일
│   ├── 📄 manifest.json             # PWA 매니페스트
│   ├── 📄 sw.js                     # Service Worker
│   ├── 📄 offline.html              # 오프라인 페이지
│   └── 📁 icons/                    # 앱 아이콘들
├── 📄 package.json                  # 프로젝트 의존성
├── 📄 next.config.js                # Next.js 설정
├── 📄 tailwind.config.js            # Tailwind CSS 설정
├── 📄 tsconfig.json                 # TypeScript 설정
├── 📄 postcss.config.js             # PostCSS 설정
├── 📄 env.example                   # 환경 변수 예시
├── 📄 README.md                     # 프로젝트 문서
└── 📄 PROJECT_STRUCTURE.md          # 프로젝트 구조 문서
```

## 🏗️ 아키텍처 구조

### 1. 프론트엔드 구조
```
┌─────────────────────────────────────────┐
│                 Next.js 14              │
│              (App Router)               │
├─────────────────────────────────────────┤
│  React 18 + TypeScript + Tailwind CSS   │
├─────────────────────────────────────────┤
│           상태 관리 (Redux + Zustand)    │
├─────────────────────────────────────────┤
│        API 통신 (Axios + React Query)   │
├─────────────────────────────────────────┤
│           PWA (Service Worker)          │
└─────────────────────────────────────────┘
```

### 2. 컴포넌트 구조
```
components/
├── ui/                    # 기본 UI 컴포넌트
│   ├── Button.tsx         # 버튼 (variant, size, loading)
│   ├── Input.tsx          # 입력 필드 (label, error, icon)
│   ├── Card.tsx           # 카드 (header, body, footer)
│   └── Badge.tsx          # 배지 (variant, size)
├── layout/                # 레이아웃 컴포넌트
│   ├── Header.tsx         # 헤더 (title, actions, user menu)
│   └── BottomNavigation.tsx # 하단 탭 네비게이션
└── providers/             # 프로바이더 컴포넌트
    ├── Providers.tsx      # Redux, React Query, Toast
    └── ThemeProvider.tsx  # 다크모드 지원
```

### 3. 상태 관리 구조
```
store/
├── Redux Toolkit (전역 상태)
│   ├── authSlice.ts       # 인증 상태 (로그인/로그아웃)
│   ├── userSlice.ts       # 사용자 관리 상태
│   └── contractSlice.ts   # 계약/매칭 상태
└── Zustand (로컬 상태)
    ├── useAuthStore.ts    # 인증 토큰 관리
    └── useNotificationStore.ts # 알림 상태
```

### 4. API 구조
```
api/
├── auth/                  # 인증 관련
│   ├── login/route.ts     # POST /api/auth/login
│   └── signup/route.ts    # POST /api/auth/signup
├── users/                 # 사용자 관련
│   └── profile/route.ts   # GET/PUT /api/users/profile
└── matching/              # 매칭 관련
    └── requests/route.ts  # GET/POST /api/matching/requests
```

## 📱 페이지 구조

### 1. 인증 페이지 (Auth)
- **로그인** (`/login`): 이메일/비밀번호 로그인, 소셜 로그인
- **회원가입** (`/signup`): 사용자 타입별 회원가입 (캐디/투어프로/아마추어/에이전시)

### 2. 대시보드 페이지 (Dashboard)
- **메인 대시보드** (`/dashboard`): 통계, 최근 계약, 알림
- **매칭 서비스** (`/matching`): 매칭 요청 목록, 검색, 필터
- **계약 관리** (`/contracts`): 계약 목록, 생성, 수정, 취소
- **결제 관리** (`/payments`): 결제 내역, 수수료, 포인트
- **프로필** (`/profile`): 사용자 정보, 설정, 통계

### 3. 관리자 페이지 (Admin)
- **관리자 대시보드** (`/admin`): 전체 통계, 최근 활동
- **회원 관리** (`/admin/users`): 사용자 목록, 상태 관리
- **결제 관리** (`/admin/payments`): 결제 내역, 정산
- **알림 관리** (`/admin/notifications`): 알림 발송, 관리

## 🔧 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **UI Components**: Custom Components
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend (API Routes)
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **Database**: PostgreSQL (준비됨)

### PWA Features
- **Service Worker**: 오프라인 지원
- **Manifest**: 앱 설치 지원
- **Push Notifications**: 알림 지원
- **Background Sync**: 오프라인 동기화

## 🎨 디자인 시스템

### 색상 팔레트
```css
Primary: #0ea5e9 (파란색)
Success: #22c55e (초록색)
Warning: #f59e0b (노란색)
Error: #ef4444 (빨간색)
Secondary: #6b7280 (회색)
```

### 반응형 브레이크포인트
```css
sm: 640px   (모바일)
md: 768px   (태블릿)
lg: 1024px  (데스크톱)
xl: 1280px  (큰 데스크톱)
```

### 컴포넌트 변형
- **Button**: primary, secondary, success, warning, error, outline, ghost
- **Badge**: primary, secondary, success, warning, error, outline
- **Card**: 기본 카드, 헤더/바디/푸터 분리

## 📊 데이터 흐름

### 1. 인증 흐름
```
사용자 로그인 → JWT 토큰 생성 → localStorage 저장 → API 요청 시 자동 헤더 추가
```

### 2. 매칭 흐름
```
매칭 요청 생성 → 제안 수신 → 제안 수락/거절 → 계약 생성 → 결제 처리 → 완료
```

### 3. 상태 관리 흐름
```
API 호출 → Redux/Zustand 업데이트 → 컴포넌트 리렌더링 → UI 업데이트
```

## 🔒 보안 고려사항

### 1. 인증 보안
- JWT 토큰 기반 인증
- 토큰 만료 시간 설정 (7일)
- 비밀번호 bcrypt 해싱 (salt rounds: 12)

### 2. API 보안
- 요청 헤더에 Authorization 토큰 검증
- 입력 데이터 Zod 검증
- CORS 설정

### 3. 클라이언트 보안
- XSS 방지 (React 기본 보호)
- CSRF 방지 (SameSite 쿠키)
- HTTPS 강제 (프로덕션)

## 🚀 배포 준비사항

### 1. 환경 변수
```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://...
PG_API_KEY=your-pg-api-key
```

### 2. 데이터베이스 설정
- PostgreSQL 데이터베이스 연결
- 사용자, 매칭, 계약, 결제 테이블 생성
- 인덱스 최적화

### 3. PWA 설정
- Service Worker 등록
- 매니페스트 파일 설정
- 오프라인 페이지 준비

## 📈 성능 최적화

### 1. 코드 최적화
- Next.js Image 컴포넌트 사용
- 동적 import로 코드 분할
- React.memo로 불필요한 리렌더링 방지

### 2. 네트워크 최적화
- API 응답 캐싱 (React Query)
- 정적 자산 CDN 배포
- Service Worker 오프라인 캐싱

### 3. 번들 최적화
- Tree shaking으로 불필요한 코드 제거
- 압축 및 최적화된 빌드
- 번들 분석으로 크기 최적화
