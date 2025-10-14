# Vercel 배포 가이드

## 1. 환경변수 설정

Vercel 대시보드에서 다음 환경변수들을 설정해야 합니다:

### 필수 환경변수

```bash
# 데이터베이스 설정 (MySQL)
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=spoeum

# Gemini AI API 키
geminiAPI=your_gemini_api_key_here

# NextAuth 설정
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 2. Vercel에서 환경변수 설정 방법

1. Vercel 대시보드에 로그인
2. 프로젝트 선택
3. Settings → Environment Variables 이동
4. 각 환경변수 추가:
   - Name: `DB_HOST`
   - Value: `your_mysql_host`
   - Environment: `Production`, `Preview`, `Development` 모두 선택
   - Add 버튼 클릭

## 3. 데이터베이스 설정

### MySQL 호스팅 옵션
- **PlanetScale** (추천): 무료 MySQL 호스팅
- **Railway**: MySQL 데이터베이스 호스팅
- **Supabase**: PostgreSQL (스키마 수정 필요)
- **AWS RDS**: MySQL 인스턴스

### PlanetScale 설정 (추천)
1. [PlanetScale](https://planetscale.com) 회원가입
2. 새 데이터베이스 생성
3. `database/schema.sql` 파일의 내용을 복사하여 실행
4. 연결 정보를 환경변수에 설정

## 4. Gemini API 키 설정

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. API 키 생성
3. 환경변수 `geminiAPI`에 설정

## 5. 배포 후 확인사항

### 데이터베이스 연결 테스트
```bash
# API 엔드포인트 테스트
GET /api/test-db
```

### Gemini AI 연결 테스트
```bash
# API 엔드포인트 테스트
GET /api/test-gemini
```

### 대회 데이터 입력 테스트
1. `/admin/gemini-tournament` 페이지 접속
2. 년도 및 협회 선택
3. 대회 검색 및 데이터 입력 테스트

## 6. 문제 해결

### 데이터베이스 연결 오류
- 환경변수 `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` 확인
- MySQL 서버가 외부 연결을 허용하는지 확인
- 방화벽 설정 확인

### Gemini API 오류
- API 키가 올바른지 확인
- API 할당량 확인
- 환경변수 `geminiAPI` 설정 확인

### 빌드 오류
- TypeScript 컴파일 오류 확인
- 의존성 패키지 설치 확인
- 환경변수 누락 확인

## 7. 모니터링

### Vercel Analytics
- 배포 상태 모니터링
- 에러 로그 확인
- 성능 메트릭 확인

### 데이터베이스 모니터링
- 연결 상태 확인
- 쿼리 성능 모니터링
- 에러 로그 확인
