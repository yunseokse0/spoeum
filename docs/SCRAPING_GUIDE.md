# KLPGA/KPGA 선수 정보 크롤링 가이드

## 📁 폴더 구조

```
lib/
├── scraper/
│   ├── base.ts          # 기본 스크래퍼 클래스 (puppeteer + cheerio 공통 기능)
│   ├── klpga.ts         # KLPGA 전용 스크래퍼
│   ├── kpga.ts          # KPGA 전용 스크래퍼
│   └── index.ts         # 스크래퍼 통합 관리자
app/
├── api/
│   └── player/
│       └── [association]/
│           └── [memberId]/
│               └── route.ts    # 선수 정보 조회 API
components/
├── ui/
│   ├── PlayerSearchForm.tsx    # 선수 검색 폼 컴포넌트
│   └── PlayerCareerCard.tsx    # 선수 경력 표시 컴포넌트
app/(auth)/
└── signup-with-player/
    └── page.tsx         # 선수 정보 조회가 포함된 회원가입 페이지
```

## 🔧 주요 기능

### 1. 크롤링 방식 선택
- **Puppeteer**: 동적 렌더링 페이지 (JavaScript로 데이터 로딩)
- **Cheerio**: 정적 HTML 페이지 (서버사이드 렌더링)

### 2. 데이터 구조
```typescript
interface PlayerInfo {
  memberId: string;
  name: string;
  association: 'KLPGA' | 'KPGA';
  birth: string;
  career: PlayerCareer[];
  ranking: PlayerRanking;
  currentRanking?: number;
  totalPrize?: number;
  profileImage?: string;
  isActive?: boolean;
}
```

### 3. 캐시 시스템
- 메모리 캐시 (1시간 유효)
- 동일 선수 재조회 시 API 호출 최소화

## 🚀 사용 예시

### API 호출
```typescript
// GET /api/player/KLPGA/KPGA12345
const response = await fetch('/api/player/KLPGA/KPGA12345');
const result = await response.json();

if (result.success) {
  console.log('선수 정보:', result.data);
}
```

### React 컴포넌트 사용
```tsx
import { PlayerSearchForm } from '@/components/ui/PlayerSearchForm';

function MyComponent() {
  const handlePlayerFound = (player: PlayerInfo) => {
    console.log('선수 정보:', player);
    // 폼에 자동으로 데이터 채우기
  };

  return (
    <PlayerSearchForm 
      onPlayerFound={handlePlayerFound}
      onClear={() => console.log('검색 초기화')}
    />
  );
}
```

## 🛠️ 설정 및 설치

### 의존성 설치
```bash
npm install puppeteer cheerio @types/cheerio
```

### 환경 설정
```typescript
// lib/scraper/base.ts
const defaultOptions: ScrapingOptions = {
  timeout: 30000,
  waitForSelector: '.player-info',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};
```

## 🔒 안전성 고려사항

### 1. 요청 제한
- 동시 요청 수 제한
- 요청 간격 조절 (delay)
- 타임아웃 설정

### 2. 에러 처리
```typescript
try {
  const playerInfo = await scraper.searchPlayer(memberId);
  return { success: true, data: playerInfo };
} catch (error) {
  console.error('크롤링 오류:', error);
  return { success: false, error: error.message };
}
```

### 3. Puppeteer 설정
```typescript
const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ]
});
```

## 📊 성능 최적화

### 1. 캐시 활용
- 메모리 캐시로 동일 요청 최소화
- 캐시 만료 시간 설정 (1시간)

### 2. 병렬 처리
- 여러 선수 정보 동시 조회
- 브라우저 인스턴스 재사용

### 3. 리소스 관리
- 브라우저 인스턴스 정리
- 메모리 누수 방지

## 🎯 확장 가능성

### 1. 추가 협회 지원
```typescript
// 새로운 협회 스크래퍼 추가
export class JLPGAscraper extends BaseScraper {
  // JLPGA 전용 구현
}
```

### 2. 데이터베이스 연동
```typescript
// 크롤링 결과 DB 저장
await db.players.upsert(playerInfo);
```

### 3. 스케줄링
```typescript
// 정기적인 선수 정보 업데이트
cron.schedule('0 2 * * *', async () => {
  await updatePlayerRankings();
});
```

## 🐛 문제 해결

### 1. 일반적인 오류
- **타임아웃**: `waitForSelector` 시간 증가
- **요소 없음**: CSS 셀렉터 확인
- **캡차**: User-Agent 변경 또는 프록시 사용

### 2. 디버깅
```typescript
// 디버그 모드로 실행
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.screenshot({ path: 'debug.png' });
```

### 3. 로깅
```typescript
console.log(`크롤링 시작: ${association} - ${memberId}`);
console.log(`결과: ${playerInfo ? '성공' : '실패'}`);
```

## 📈 모니터링

### 1. 성공률 추적
```typescript
const stats = {
  total: 0,
  success: 0,
  failed: 0
};
```

### 2. 응답 시간 측정
```typescript
const startTime = Date.now();
const result = await scraper.searchPlayer(memberId);
const duration = Date.now() - startTime;
```

### 3. 캐시 히트율
```typescript
const cacheStats = playerScraper.getCacheStats();
console.log(`캐시 크기: ${cacheStats.size}`);
```
