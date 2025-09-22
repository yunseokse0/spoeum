# 스포이음(SPOEUM) - KLPGA/KPGA 선수 정보 크롤링 시스템

## 🎯 구현 완료 기능

### ✅ 1. 크롤링 시스템
- **BaseScraper**: Puppeteer + Cheerio 공통 기능
- **KLPGAscraper**: KLPGA 전용 크롤링 로직
- **KPGAscraper**: KPGA 전용 크롤링 로직
- **PlayerScraper**: 통합 관리자 + 캐시 시스템

### ✅ 2. API 시스템
- **GET /api/player/[association]/[memberId]**: 선수 정보 조회
- 에러 처리 및 유효성 검사
- CORS 지원

### ✅ 3. UI 컴포넌트
- **PlayerSearchForm**: 선수 검색 폼
- **PlayerCareerCard**: 선수 경력 표시 카드
- **SignupWithPlayer**: 선수 정보 조회가 포함된 회원가입 페이지

### ✅ 4. 타입 시스템
- **PlayerInfo**: 선수 정보 타입
- **PlayerCareer**: 경력 정보 타입
- **GolfAssociation**: 협회 타입
- **PlayerSearchResponse**: API 응답 타입

## 📁 프로젝트 구조

```
spoeum/
├── lib/
│   ├── scraper/
│   │   ├── base.ts              # 기본 스크래퍼 클래스
│   │   ├── klpga.ts             # KLPGA 크롤링
│   │   ├── kpga.ts              # KPGA 크롤링
│   │   └── index.ts             # 통합 관리자
│   └── api.ts                   # API 클라이언트 (searchPlayer 메서드 추가)
├── app/
│   ├── api/
│   │   └── player/
│   │       └── [association]/
│   │           └── [memberId]/
│   │               └── route.ts # 선수 정보 조회 API
│   └── (auth)/
│       └── signup-with-player/
│           └── page.tsx         # 선수 정보 조회 회원가입
├── components/
│   └── ui/
│       ├── PlayerSearchForm.tsx # 선수 검색 컴포넌트
│       └── PlayerCareerCard.tsx # 선수 경력 카드
├── types/
│   └── index.ts                 # 선수 관련 타입 추가
└── docs/
    └── SCRAPING_GUIDE.md        # 크롤링 가이드 문서
```

## 🔧 핵심 기능

### 1. 크롤링 방식 선택
```typescript
// 동적 페이지: Puppeteer 사용
const page = await this.scrapeWithPuppeteer(url, {
  waitForSelector: '.player-info'
});

// 정적 페이지: Axios + Cheerio 사용
const $ = await this.scrapeWithAxios(url);
```

### 2. 데이터 추출
```typescript
// 기본 정보
const name = await page.$eval('.player-name', el => el.textContent?.trim());
const birth = this.parseDate(birthText);

// 경력 정보
const career = await this.extractCareer(page);

// 랭킹 정보
const ranking = await this.extractRanking(page);
```

### 3. 캐시 시스템
```typescript
// 캐시 확인
const cacheKey = `${association}_${memberId}`;
if (this.cache.has(cacheKey)) {
  return this.cache.get(cacheKey);
}

// 캐시 저장 (1시간 유효)
this.cache.set(cacheKey, playerInfo);
```

## 🎨 UI/UX 특징

### 1. 선수 검색 폼
- 협회 선택 (KLPGA/KPGA)
- 회원번호 입력
- 실시간 검색
- 로딩 상태 표시

### 2. 선수 정보 카드
- 프로필 이미지
- 기본 정보 (이름, 생년월일, 협회)
- 통계 (현재 랭킹, 총 상금)
- 경력 리스트

### 3. 경력 표시
- 연도별 아코디언 UI
- 우승/상위 성과 하이라이트
- 상금 정보 표시
- 랭킹 히스토리

## 🚀 사용 방법

### 1. API 호출
```typescript
import api from '@/lib/api';

const response = await api.searchPlayer('KPGA12345', 'KPGA');
if (response.success) {
  console.log('선수 정보:', response.data);
}
```

### 2. React 컴포넌트
```tsx
import { PlayerSearchForm } from '@/components/ui/PlayerSearchForm';

<PlayerSearchForm
  onPlayerFound={(player) => {
    // 선수 정보를 폼에 자동 채우기
    setFormData(player);
  }}
/>
```

### 3. 회원가입 통합
```tsx
// 선수 정보 조회 후 자동으로 폼 데이터 채우기
const handlePlayerFound = (player: PlayerInfo) => {
  setValue('name', player.name);
  // 추가 필드 자동 채우기
};
```

## 🔒 보안 및 안정성

### 1. 요청 제한
- 타임아웃 설정 (30초)
- 요청 간격 조절 (delay)
- User-Agent 설정

### 2. 에러 처리
- 크롤링 실패 시 대체 방법
- 상세한 에러 메시지
- 로깅 시스템

### 3. 리소스 관리
- 브라우저 인스턴스 정리
- 메모리 누수 방지
- 캐시 크기 제한

## 📊 성능 최적화

### 1. 캐시 활용
- 메모리 캐시로 동일 요청 최소화
- 1시간 캐시 유효 시간

### 2. 병렬 처리
- 여러 선수 정보 동시 조회 가능
- 브라우저 인스턴스 재사용

### 3. 데이터 최적화
- 필요한 정보만 추출
- 불필요한 리소스 로딩 방지

## 🔄 확장 가능성

### 1. 추가 협회 지원
- JLPGA, PGA 등 다른 협회 추가 가능
- 새로운 스크래퍼 클래스 생성

### 2. 데이터베이스 연동
- 크롤링 결과 DB 저장
- 선수 정보 업데이트 스케줄링

### 3. 고급 기능
- 선수 성과 분석
- 트렌드 분석
- 예측 모델링

## 📈 모니터링

### 1. 성능 지표
- 크롤링 성공률
- 평균 응답 시간
- 캐시 히트율

### 2. 에러 추적
- 크롤링 실패 원인 분석
- 자주 발생하는 오류 패턴

### 3. 사용 통계
- API 호출 빈도
- 인기 선수 정보
- 협회별 사용률

## 🎯 향후 개선 사항

1. **실시간 업데이트**: 선수 정보 변경 시 자동 알림
2. **AI 분석**: 선수 성과 패턴 분석
3. **모바일 최적화**: 모바일 환경에서의 크롤링 최적화
4. **국제화**: 해외 골프 협회 지원
5. **API 문서화**: Swagger/OpenAPI 문서 생성

---

**구현 완료!** 🎉 
스포이음 앱에 KLPGA/KPGA 선수 정보 크롤링 시스템이 성공적으로 통합되었습니다.
