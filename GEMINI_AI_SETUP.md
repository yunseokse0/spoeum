# Gemini AI 대회 관리 시스템

## 🎯 개요

관리자 페이지에서 Gemini AI를 활용하여 골프 대회를 관리하는 통합 시스템입니다.
- **지난 대회 결과 자동 입력**: Gemini AI로 대회 결과를 파싱하여 DB 저장
- **예정된 대회 조회**: KPGA/KLPGA 예정 대회 목록 확인

## 📋 주요 기능

### 1. 지난 대회 결과 자동 입력
- **텍스트 기반 대회 결과 파싱**
  - 순위, 선수명, 스코어, 상금 정보를 자동 추출
  - Gemini AI가 자연어로 작성된 대회 결과를 구조화된 데이터로 변환

- **자동 데이터베이스 저장**
  - 대회 정보 자동 생성
  - 선수 정보 자동 매칭 또는 생성
  - 대회 결과 저장

- **대회 데이터 자동 가져오기**
  - 년도 및 협회(KPGA/KLPGA) 선택
  - 해당 년도의 대회 목록 자동 조회
  - 선택한 대회의 결과 데이터 자동 로드

### 2. 예정된 대회 조회
- **대회 검색**
  - 년도별 예정 대회 조회
  - KPGA/KLPGA 협회별 필터링
  
- **상세 정보 표시**
  - 대회명, 일정, 장소
  - 상금 규모, 참가 인원
  - 등록 마감일, 대회 설명

### 3. 관리자 전용 UI
- 탭 기반 인터페이스 (지난 대회 / 예정 대회)
- 직관적인 입력 폼
- 실시간 파싱 결과 미리보기
- 샘플 데이터로 테스트 가능

## 🔧 설정 방법

### 1. Gemini API 키 발급

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에 접속
2. "Create API Key" 클릭
3. API 키 복사

### 2. 환경 변수 설정

`.env.local` 파일에 다음 내용 추가:

```env
# Gemini API Key
geminiAPI=your_gemini_api_key_here
```

**중요:** `geminiAPI`로 정확히 입력해야 합니다 (대소문자 구분)

### 3. Vercel 배포 시 환경 변수 설정

Vercel 대시보드에서:
1. Project Settings > Environment Variables
2. Name: `geminiAPI`
3. Value: (발급받은 API 키)
4. Environment: Production, Preview, Development 모두 선택

## 📱 사용 방법

### 1. 관리자 페이지 접속

```
https://your-domain.com/admin/gemini-tournament
```

또는 관리자 사이드바에서 **"AI 대회결과"** 메뉴 클릭

### 2. 탭 선택
- **지난 대회 결과 입력**: 대회 결과를 Gemini AI로 파싱하여 저장
- **예정된 대회 조회**: 향후 예정된 대회 일정 확인

---

## 🏆 지난 대회 결과 입력

### 1. 대회 데이터 자동 가져오기

#### 옵션 A: 년도/협회 선택으로 자동 가져오기
1. **년도 선택** (2020년 ~ 현재)
2. **협회 선택** (KLPGA 여자 / KPGA 남자)
3. **"대회 검색"** 버튼 클릭
4. 대회 목록에서 원하는 대회 선택
5. 대회 결과 데이터 자동 로드

#### 옵션 B: 수동 입력

#### 방법 1: 샘플 데이터로 테스트
1. "샘플 데이터" 버튼 클릭
2. 자동으로 예시 데이터가 입력됨
3. "Gemini AI로 파싱하기" 버튼 클릭

#### 방법 2: 실제 데이터 입력
1. **대회명 입력**
   ```
   예: 2024 KLPGA 챔피언십
   ```

2. **대회 결과 데이터 입력** (다양한 형식 지원)
   ```
   1위 김효주 - 14언더파 (상금 2억원)
   2위 박민지 - 12언더파 (상금 1억2천만원)
   3위 이정은 - 10언더파 (상금 8천만원)
   ...
   ```
   
   또는
   
   ```
   순위 | 선수명 | 스코어 | 상금
   1    | 김효주 | -14   | 200,000,000
   2    | 박민지 | -12   | 120,000,000
   ...
   ```

3. **AI 파싱**
   - "Gemini AI로 파싱하기" 클릭
   - 약 3-5초 대기
   - 파싱 결과 확인

4. **데이터베이스 저장**
   - 파싱 결과가 정확한지 확인
   - "데이터베이스에 저장" 버튼 클릭
   - 저장 완료 메시지 확인

### 3. 저장 완료

저장된 데이터는 다음 API로 조회 가능:
```
GET /api/admin/tournaments/results
GET /api/admin/tournaments/results?tournamentId=<대회ID>
```

---

## 📅 예정된 대회 조회

### 1. 대회 검색
1. **년도 선택** (현재 년도 또는 내년)
2. **협회 선택** (KLPGA 여자 / KPGA 남자)
3. **"예정된 대회 검색"** 버튼 클릭

### 2. 대회 목록 확인
각 대회 카드에 다음 정보가 표시됩니다:
- 대회명
- 협회 (KPGA/KLPGA)
- 일정 (시작일 ~ 종료일)
- 개최 장소
- 상금 규모
- 대회 설명
- 상태 (예정/진행중)

## 🎨 UI 구성

### 입력 폼
- 대회명 입력 필드
- 대회 결과 텍스트 영역 (여러 줄)
- 샘플 데이터 로드 버튼
- AI 파싱 실행 버튼

### 파싱 결과 테이블
- 순위별 정렬
- 선수명, 스코어, 상금 표시
- 1~3위 특별 뱃지
- 총 선수 수 표시

### 상태 알림
- 성공 메시지 (초록색)
- 오류 메시지 (빨간색)
- 로딩 상태 표시

## 🔌 API 엔드포인트

### 1. 대회 목록 조회 (지난 대회)
```typescript
GET /api/admin/tournaments/list?year=2024&association=KLPGA

Response:
{
  "success": true,
  "data": [
    {
      "id": "2024-klpga-001",
      "name": "2024 KLPGA 챔피언십",
      "date": "2024-10-15",
      "location": "여주",
      "prize": "10억원"
    }
  ]
}
```

### 2. 대회 결과 데이터 가져오기
```typescript
GET /api/admin/tournaments/fetch-results?tournamentId=2024-klpga-001&association=KLPGA

Response:
{
  "success": true,
  "tournament_name": "2024 KLPGA 챔피언십",
  "raw_data": "1위 김효주 - 14언더파..."
}
```

### 3. 예정된 대회 조회
```typescript
GET /api/admin/tournaments/upcoming?year=2024&association=KLPGA

Response:
{
  "success": true,
  "data": [
    {
      "id": "2024-klpga-upcoming-001",
      "name": "2024 KLPGA 시즌 개막전",
      "start_date": "2024-11-15",
      "end_date": "2024-11-18",
      "location": "제주 핀크스",
      "prize_money": 1000000000,
      "status": "upcoming"
    }
  ]
}
```

### 4. Gemini 파싱 API
```typescript
POST /api/gemini/tournament-results

Request:
{
  "tournamentName": "2024 KLPGA 챔피언십",
  "rawResults": "1위 김효주 - 14언더파 (상금 2억원)..."
}

Response:
{
  "success": true,
  "tournament_name": "2024 KLPGA 챔피언십",
  "results": [
    {
      "player_name": "김효주",
      "rank": 1,
      "score": -14,
      "prize_amount": 200000000
    }
  ]
}
```

### 5. 대회 결과 저장 API
```typescript
POST /api/admin/tournaments/results

Request:
{
  "tournament_name": "2024 KLPGA 챔피언십",
  "results": [...]
}

Response:
{
  "success": true,
  "tournament_id": "uuid",
  "saved_count": 10,
  "total_count": 10
}
```

### 6. 대회 결과 조회 API
```typescript
GET /api/admin/tournaments/results

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "2024 KLPGA 챔피언십",
      "results_count": 10
    }
  ]
}
```

## 🗄️ 데이터베이스 스키마

### tournaments 테이블
```sql
CREATE TABLE tournaments (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    association ENUM('KPGA', 'KLPGA', 'PGA', 'LPGA', '기타'),
    start_date DATE,
    end_date DATE,
    location VARCHAR(200),
    prize_money DECIMAL(15, 2),
    max_participants INT,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
    created_at TIMESTAMP
);
```

### tournament_results 테이블
```sql
CREATE TABLE tournament_results (
    id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    player_name VARCHAR(100) NOT NULL,
    player_id VARCHAR(36),
    rank INT NOT NULL,
    score INT,
    prize_amount DECIMAL(15, 2),
    created_at TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
);
```

## ⚠️ 주의사항

1. **API 키 보안**
   - API 키를 절대 코드에 하드코딩하지 마세요
   - .env 파일을 .gitignore에 추가
   - Vercel 환경 변수로 안전하게 관리

2. **API 할당량**
   - Gemini API는 무료 티어 제한이 있음
   - 하루 60 요청 제한 (무료 티어)
   - 필요시 유료 플랜 고려

3. **데이터 검증**
   - AI 파싱 결과를 반드시 확인 후 저장
   - 잘못된 데이터는 수동 수정 필요

4. **중복 저장 방지**
   - 같은 대회를 여러 번 저장하지 않도록 주의
   - 대회 이름으로 중복 확인 권장

## 🐛 문제 해결

### 1. "Gemini API 키가 설정되지 않았습니다"
- `.env.local` 파일에 `geminiAPI` 변수 확인
- 환경 변수명이 정확한지 확인 (대소문자 구분)
- 개발 서버 재시작 (`npm run dev`)

### 2. "Gemini API 호출 실패"
- API 키가 유효한지 확인
- 인터넷 연결 확인
- API 할당량 초과 여부 확인

### 3. "데이터베이스 저장 실패"
- 데이터베이스 연결 확인
- 테이블이 존재하는지 확인
- 데이터베이스 권한 확인

### 4. 파싱 결과가 부정확한 경우
- 입력 데이터 형식을 더 명확하게 작성
- 샘플 데이터 형식 참고
- 필요시 수동으로 데이터 수정

## 📊 성능 최적화

1. **배치 처리**
   - 한 번에 여러 대회 결과를 처리하지 마세요
   - 대회별로 순차 처리 권장

2. **캐싱**
   - 파싱 결과를 로컬에 임시 저장
   - 불필요한 재파싱 방지

3. **에러 핸들링**
   - 일부 선수 저장 실패 시 나머지는 계속 진행
   - 에러 로그 확인

## 🎨 UI 특징

### 탭 기반 인터페이스
- **지난 대회 결과 입력** (파란색 탭)
  - 년도/협회 선택 → 대회 자동 검색
  - 수동 입력 또는 자동 로드
  - Gemini AI 파싱
  - DB 저장

- **예정된 대회 조회** (초록색 탭)
  - 년도/협회 선택
  - 예정 대회 목록 표시
  - 상세 정보 카드뷰

### 반응형 디자인
- 모바일/태블릿/데스크탑 모두 지원
- 다크모드 지원
- 직관적인 사용자 경험

## 🚀 향후 개선 사항

- [ ] 실제 KPGA/KLPGA 웹 크롤링 구현
- [ ] 엑셀/CSV 파일 업로드 지원
- [ ] 대회 결과 수정 기능
- [ ] 대회 결과 삭제 기능
- [ ] 선수 정보 자동 매칭 개선
- [ ] 다국어 지원 (영문 대회 결과)
- [ ] 대회 결과 통계 차트
- [ ] 대회 등록/수정 기능 (관리자)
- [ ] 푸시 알림 (예정된 대회 리마인더)

## 🔗 관련 문서

- **대회 결과 조회**: [TOURNAMENT_RESULTS_GUIDE.md](./TOURNAMENT_RESULTS_GUIDE.md)
  - 저장된 대회 결과를 조회하는 방법
  - 순위별 상금 확인
  - 30위까지 결과 표시

## 📞 문의

문제가 있거나 개선 사항이 있으면 관리자에게 문의해주세요.

---

**마지막 업데이트:** 2025년 10월 14일  
**버전:** 1.0.0

