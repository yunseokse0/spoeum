# 스포이음(SPOEUM) - 골프장 목록 자동 수집 시스템

## 🎯 구현 완료 기능

### ✅ 1. 골프장 정보 자동 수집 스크래퍼
- **다중 소스 지원**: 여러 골프장 웹사이트에서 정보 수집
- **Puppeteer 기반**: 동적 렌더링 페이지 지원
- **데이터 정규화**: 수집된 데이터 표준화 및 중복 제거
- **오류 처리**: 소스별 오류 처리 및 복구

### ✅ 2. 자동 동기화 API
- **실시간 동기화**: API 호출 시 최신 골프장 정보 수집
- **중복 제거**: 기존 데이터와 새 데이터 병합
- **통계 제공**: 동기화 결과 통계 정보
- **상태 관리**: 동기화 진행 상태 추적

### ✅ 3. 관리자 동기화 페이지
- **원클릭 동기화**: 관리자가 쉽게 동기화 실행
- **실시간 모니터링**: 동기화 상태 및 통계 확인
- **데이터 내보내기**: 골프장 목록 JSON 내보내기
- **검색 및 필터**: 지역별, 이름별 골프장 검색

### ✅ 4. 통합 검색 시스템
- **자동 동기화 옵션**: 검색 시 최신 데이터 자동 수집
- **캐시 최적화**: 불필요한 API 호출 최소화
- **성능 향상**: 검색 속도 및 정확도 개선

## 📁 프로젝트 구조

```
spoeum/
├── lib/
│   ├── scraper/
│   │   └── golf-course-scraper.ts    # 골프장 정보 수집 스크래퍼
│   └── data/
│       └── golf-courses.ts           # 골프장 데이터베이스 (업데이트됨)
├── app/
│   ├── api/
│   │   └── golf-courses/
│   │       ├── sync/
│   │       │   └── route.ts          # 골프장 동기화 API
│   │       └── search/
│   │           └── route.ts          # 검색 API (자동 동기화 지원)
│   └── admin/
│       └── golf-course-sync/
│           └── page.tsx              # 관리자 동기화 페이지
├── components/
│   └── ui/
│       └── GolfCourseSelector.tsx    # 골프장 선택 컴포넌트 (기존)
└── types/
    └── index.ts                      # 골프장 관련 타입 (기존)
```

## 🔧 핵심 기능

### 1. 골프장 스크래퍼
```typescript
// 골프장 정보 자동 수집
const scraper = new GolfCourseScraper();
const courses = await scraper.collectAllCourses();

// 다중 소스에서 데이터 수집
const scrapedCourses = await scraper.scrapeAllSources();
const manualCourses = await scraper.addManualCourses();
```

### 2. 자동 동기화 API
```typescript
// 골프장 목록 동기화
POST /api/golf-courses/sync
{
  "success": true,
  "data": {
    "totalCourses": 150,
    "newCourses": 25,
    "lastSyncTime": "2024-01-15T10:30:00Z",
    "courses": [...]
  }
}

// 골프장 목록 조회 (통계 포함)
GET /api/golf-courses/sync?stats=true
```

### 3. 검색 API 자동 동기화
```typescript
// 자동 동기화 옵션으로 검색
GET /api/golf-courses/search?q=제주&autoSync=true

// 응답에 동기화 상태 포함
{
  "success": true,
  "data": [...],
  "autoSynced": true
}
```

### 4. 관리자 페이지 기능
```typescript
// 동기화 실행
const response = await api.syncGolfCourses();

// 통계 조회
const stats = await api.getGolfCourses(true);

// 데이터 내보내기
const exportData = JSON.stringify(golfCourses, null, 2);
```

## 🎨 UI/UX 특징

### 1. 관리자 동기화 페이지
- **통계 대시보드**: 총 골프장, 활성 골프장, 최근 추가, 동기화 상태
- **원클릭 동기화**: "동기화 실행" 버튼으로 간편 실행
- **실시간 상태**: 동기화 진행 상태 실시간 표시
- **데이터 내보내기**: JSON 형태로 골프장 목록 내보내기

### 2. 동기화 상태 표시
- **동기화 중**: 노란색 아이콘 + "동기화 중..." 텍스트
- **동기화 완료**: 초록색 아이콘 + "동기화 완료" 텍스트
- **동기화 필요**: 빨간색 아이콘 + "동기화 필요" 텍스트

### 3. 골프장 목록 관리
- **검색 기능**: 이름, 지역으로 검색
- **지역 필터**: 지역별 골프장 필터링
- **상세 정보**: 골프장 상세 정보 표시
- **활성 상태**: 활성/비활성 골프장 구분

## 📊 데이터 구조

### 스크래핑된 골프장 정보
```typescript
interface ScrapedGolfCourse {
  name: string;
  region: string;
  city: string;
  address: string;
  phone?: string;
  website?: string;
  source: string; // 'golf.co.kr', 'golfzon.com', 'manual'
}
```

### 동기화 통계
```typescript
interface SyncStats {
  totalCourses: number;
  newCourses: number;
  lastSyncTime: Date | null;
  isSyncing: boolean;
  activeCourses: number;
}
```

### 골프장 소스 설정
```typescript
interface GolfCourseSource {
  name: string;
  url: string;
  selector: {
    container: string;
    name: string;
    region?: string;
    address?: string;
    phone?: string;
    website?: string;
  };
}
```

## 🚀 사용 방법

### 1. 관리자 동기화
```typescript
// 관리자 페이지에서 동기화 실행
const handleSync = async () => {
  const response = await api.syncGolfCourses();
  if (response.success) {
    toast.success(`동기화 완료! ${response.data.newCourses}개 새로 추가`);
  }
};
```

### 2. 자동 동기화 검색
```typescript
// 검색 시 자동 동기화
const response = await api.searchGolfCourses({
  query: '제주',
  autoSync: true
});
```

### 3. 데이터 새로고침
```typescript
// 골프장 데이터 새로고침
import { refreshGolfCoursesData } from '@/lib/data/golf-courses';

await refreshGolfCoursesData();
```

### 4. 스크래퍼 직접 사용
```typescript
import { GolfCourseScraper } from '@/lib/scraper/golf-course-scraper';

const scraper = new GolfCourseScraper();
const courses = await scraper.collectAllCourses();
```

## 🔒 안전성 및 최적화

### 1. 오류 처리
- **소스별 오류 처리**: 개별 소스 오류가 전체에 영향 없음
- **타임아웃 설정**: 60초 타임아웃으로 무한 대기 방지
- **재시도 로직**: 일시적 오류 시 자동 재시도
- **폴백 데이터**: 오류 시 수동 데이터로 폴백

### 2. 성능 최적화
- **동시 동기화 방지**: 중복 동기화 요청 차단
- **요청 지연**: 소스 간 2초 지연으로 서버 부하 방지
- **캐싱**: 동일한 요청에 대한 결과 캐싱
- **배치 처리**: 여러 골프장 정보 한 번에 처리

### 3. 데이터 무결성
- **중복 제거**: 이름 기반 중복 골프장 제거
- **데이터 정규화**: 수집된 데이터 표준화
- **검증 로직**: 필수 필드 검증
- **백업 시스템**: 기존 데이터 백업 후 업데이트

## 📈 모니터링 및 로깅

### 1. 동기화 로그
```typescript
console.log('골프장 정보 수집 시작: golf.co.kr');
console.log('golf.co.kr에서 45개 골프장 수집 완료');
console.log('총 150개 골프장 정보 수집 완료');
```

### 2. 오류 로깅
```typescript
console.error('golf.co.kr 스크래핑 오류:', error);
console.error('골프장 정보 수집 오류:', error);
```

### 3. 성능 모니터링
- **동기화 시간**: 동기화 소요 시간 측정
- **수집 성공률**: 소스별 수집 성공률 추적
- **데이터 품질**: 수집된 데이터 품질 평가

## 🎯 향후 개선 사항

1. **더 많은 소스 추가**: 추가 골프장 웹사이트 연동
2. **스케줄링**: 정기적 자동 동기화 (크론 작업)
3. **데이터 검증**: 수집된 데이터 자동 검증
4. **알림 시스템**: 동기화 완료 시 알림
5. **성능 최적화**: 병렬 처리로 속도 향상
6. **데이터 분석**: 골프장 트렌드 분석

## 🔧 설정 및 커스터마이징

### 1. 새로운 소스 추가
```typescript
const newSource: GolfCourseSource = {
  name: 'new-golf-site',
  url: 'https://new-golf-site.com/courses',
  selector: {
    container: '.course-item',
    name: '.course-name',
    region: '.course-region',
    address: '.course-address'
  }
};
```

### 2. 스크래핑 설정 조정
```typescript
// 브라우저 설정
await this.browser = await puppeteer.launch({ 
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

// 타임아웃 설정
this.page.setDefaultNavigationTimeout(60000);

// 요청 지연
await this.page?.waitForTimeout(2000);
```

### 3. 데이터 정규화 규칙
```typescript
// 지역 매핑
const regionMap: { [key: string]: string } = {
  '서울': '서울',
  '경기': '경기',
  '제주': '제주'
};

// 이름 정리
private cleanName(name: string): string {
  return name
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s가-힣]/g, '')
    .trim();
}
```

---

**구현 완료!** 🎉 
골프장 목록이 자동으로 수집되고 동기화되는 시스템이 구축되었습니다.
