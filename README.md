# 스포이음(SPOEUM) 모바일 앱

골프 캐디 매칭 및 관리 플랫폼

## 🚀 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit, Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **UI Components**: Custom Components with Tailwind
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📱 주요 기능

### 사용자 기능
- **회원가입/로그인**: 투어프로, 아마추어, 에이전시, 캐디 구분
- **매칭 서비스**: 구인 공고, 캐디 검색, 제안 관리
- **계약 관리**: 대회 계약, 연간 계약, 계약 취소
- **결제 관리**: 주급, 인센티브, 수수료, 포인트
- **알림**: 계약 완료, 결제 알림, 제안 수락/거절
- **스폰서십**: 소개 페이지, 문의 접수
- **게시판**: 공지사항, FAQ, 1:1 문의, 근무 후기

### 관리자 기능
- **회원 관리**: 사용자 정보, 권한 관리
- **결제 관리**: 결제 내역, 수수료 정산
- **포인트 관리**: 포인트 충전/차감, 내역 관리
- **게시판 관리**: 스폰서십, 공지사항 관리

## 🏗️ 프로젝트 구조

```
spoeum-mobile-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (dashboard)/       # 대시보드 페이지
│   ├── admin/             # 관리자 페이지
│   ├── api/               # API 라우트
│   └── globals.css        # 전역 스타일
├── components/            # 재사용 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── forms/            # 폼 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   └── features/         # 기능별 컴포넌트
├── lib/                  # 유틸리티 및 설정
│   ├── auth.ts          # 인증 관련
│   ├── api.ts           # API 클라이언트
│   ├── utils.ts         # 공통 유틸리티
│   └── validations.ts   # 폼 검증
├── store/               # 상태 관리
│   ├── authSlice.ts     # 인증 상태
│   ├── userSlice.ts     # 사용자 상태
│   └── contractSlice.ts # 계약 상태
├── types/               # TypeScript 타입 정의
├── hooks/               # 커스텀 훅
└── public/              # 정적 파일
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://localhost:5432/spoeum
PG_API_KEY=your-pg-api-key
PG_API_SECRET=your-pg-api-secret
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📱 모바일 최적화

- 반응형 디자인 (모바일 우선)
- 터치 친화적 UI/UX
- 하단 탭 네비게이션
- 다크모드 지원
- 무한 스크롤 구현
- 스와이프 제스처 지원

## 🔐 보안

- JWT 기반 인증
- HTTPS 통신
- 입력 데이터 검증
- XSS/CSRF 방지
- API 레이트 리미팅

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
