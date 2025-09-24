# 백엔드 설정 가이드

## 🗄️ 데이터베이스 설정

### 1. MySQL 설치 및 설정

#### Windows
```bash
# MySQL 8.0+ 설치
# https://dev.mysql.com/downloads/mysql/ 에서 다운로드

# 또는 Chocolatey 사용
choco install mysql
```

#### macOS
```bash
# Homebrew 사용
brew install mysql
brew services start mysql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. 데이터베이스 생성

```sql
-- MySQL에 접속
mysql -u root -p

-- 데이터베이스 생성
CREATE DATABASE spoeum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 (선택사항)
CREATE USER 'spoeum_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON spoeum.* TO 'spoeum_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 스키마 생성

```bash
# 스키마 파일 실행
mysql -u root -p spoeum < database/schema.sql
```

## 🔧 환경 변수 설정

### 1. 환경 변수 파일 생성

```bash
# .env.local 파일 생성
cp env.example .env.local
```

### 2. 환경 변수 설정

```env
# .env.local 파일 편집
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=spoeum

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

## 📊 데이터 가져오기

### 1. 골프장 데이터 가져오기

```bash
# CSV 데이터를 데이터베이스에 삽입
npm run import-golf-courses
```

### 2. 데이터베이스 연결 테스트

```bash
# 데이터베이스 연결 확인
npm run db:test
```

## 🚀 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev
```

## 📁 백엔드 구조

```
lib/
├── database/
│   └── connection.ts          # MySQL 연결 설정
├── models/
│   ├── User.ts               # 사용자 모델
│   ├── Contract.ts           # 계약 모델
│   └── GolfCourse.ts         # 골프장 모델
└── utils/
    └── csv-parser.ts         # CSV 파서

app/api/
├── contracts/
│   ├── route.ts              # 계약 목록/생성 API
│   └── [id]/route.ts         # 계약 상세/수정/삭제 API
├── golf-courses/
│   ├── route.ts              # 골프장 목록/생성 API
│   └── search/route.ts       # 골프장 검색 API
└── users/
    └── route.ts              # 사용자 API

database/
└── schema.sql                # 데이터베이스 스키마

scripts/
└── import-golf-courses.ts    # 골프장 데이터 가져오기 스크립트
```

## 🔍 API 엔드포인트

### 계약 관련
- `GET /api/contracts` - 계약 목록 조회
- `POST /api/contracts` - 계약 생성
- `GET /api/contracts/[id]` - 계약 상세 조회
- `PUT /api/contracts/[id]` - 계약 수정
- `DELETE /api/contracts/[id]` - 계약 삭제

### 골프장 관련
- `GET /api/golf-courses` - 골프장 목록 조회
- `POST /api/golf-courses` - 골프장 생성
- `GET /api/golf-courses/search` - 골프장 검색
- `POST /api/golf-courses/search` - 골프장 통계 조회

## 🛠️ 문제 해결

### 1. 데이터베이스 연결 실패
```bash
# MySQL 서비스 상태 확인
# Windows
net start mysql

# macOS/Linux
sudo systemctl status mysql
```

### 2. 포트 충돌
```bash
# 3306 포트 사용 중인 프로세스 확인
netstat -ano | findstr :3306

# 프로세스 종료
taskkill /PID [PID번호] /F
```

### 3. 권한 오류
```sql
-- MySQL에서 권한 확인 및 수정
SHOW GRANTS FOR 'root'@'localhost';
GRANT ALL PRIVILEGES ON spoeum.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## 📈 성능 최적화

### 1. 인덱스 최적화
```sql
-- 자주 사용되는 컬럼에 인덱스 추가
CREATE INDEX idx_contracts_user_id ON contracts(tour_pro_id, caddy_id, amateur_id, sponsor_id);
CREATE INDEX idx_golf_courses_region ON golf_courses(region, city);
```

### 2. 연결 풀 설정
```typescript
// lib/database/connection.ts에서 설정 조정
const dbConfig = {
  connectionLimit: 20,  // 연결 풀 크기 증가
  acquireTimeout: 60000,
  timeout: 60000,
};
```

## 🔒 보안 설정

### 1. 데이터베이스 보안
```sql
-- 강력한 비밀번호 설정
ALTER USER 'root'@'localhost' IDENTIFIED BY 'strong_password';

-- 불필요한 사용자 제거
DROP USER IF EXISTS ''@'localhost';
```

### 2. 환경 변수 보안
- `.env.local` 파일을 `.gitignore`에 추가
- 프로덕션에서는 환경 변수를 안전하게 관리
- JWT 시크릿 키를 강력하게 설정

## 📝 로그 및 모니터링

### 1. 데이터베이스 로그 확인
```bash
# MySQL 에러 로그 확인
# Windows: C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err
# macOS: /usr/local/var/mysql/*.err
# Linux: /var/log/mysql/error.log
```

### 2. 애플리케이션 로그
```bash
# 개발 서버 로그 확인
npm run dev

# 프로덕션 로그 확인
npm run start
```

## 🚀 배포 가이드

### 1. 프로덕션 데이터베이스 설정
- MySQL 서버 설정 최적화
- 백업 전략 수립
- 모니터링 도구 설정

### 2. 환경 변수 설정
- 프로덕션 환경 변수 설정
- 보안 키 관리
- 데이터베이스 연결 정보 설정

### 3. 성능 모니터링
- 데이터베이스 성능 모니터링
- API 응답 시간 측정
- 에러 로그 수집 및 분석
