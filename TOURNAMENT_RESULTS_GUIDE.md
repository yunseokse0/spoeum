# 대회 결과 조회 시스템

## 🎯 개요

관리자 페이지에서 저장된 골프 대회 결과를 조회하고 순위별 상금을 확인할 수 있는 시스템입니다.

## 📋 주요 기능

### 1. 대회 목록 조회
- 저장된 모든 대회 목록 표시
- 대회명, 협회(KPGA/KLPGA), 일정, 장소 표시
- 결과가 저장된 대회만 필터링
- 실시간 검색 기능

### 2. 대회 결과 상세 조회
- **30위까지** 순위별 결과 표시
- 선수명, 순위, 스코어, 상금 정보
- 1~3위 메달 아이콘 표시
- 스코어별 색상 구분 (언더파/오버파)

### 3. 사용자 친화적 UI
- 2단 레이아웃 (대회 목록 / 결과 상세)
- 검색 기능 (대회명, 장소)
- 반응형 디자인 (모바일/태블릿/데스크탑)
- 다크모드 지원

## 📱 사용 방법

### 1. 페이지 접속

```
https://your-domain.com/admin/tournament-results
```

또는 관리자 사이드바에서 **"대회결과 조회"** 메뉴 클릭

### 2. 대회 검색
1. 왼쪽 검색창에 대회명 또는 장소 입력
2. 실시간으로 목록 필터링

### 3. 대회 선택
1. 왼쪽 목록에서 원하는 대회 클릭
2. 오른쪽에 대회 상세 정보 표시
3. 순위별 결과 테이블 표시

### 4. 결과 확인
- **순위**: 1~3위 메달, 4~10위 파란색, 나머지 회색
- **선수명**: 등록된 선수 이름
- **스코어**: 
  - 언더파 (초록색)
  - 오버파 (빨간색)
  - 이븐파 (회색)
- **상금**: 원화 단위로 표시

## 🎨 UI 구성

### 왼쪽: 대회 목록 패널
- **검색바**: 대회명/장소 검색
- **대회 카드**:
  - 협회 뱃지 (KLPGA/KPGA)
  - 결과 수 뱃지
  - 대회명 (제목)
  - 일정 (날짜)
  - 장소 (아이콘)
- **선택 표시**: 파란색 배경, 화살표 아이콘

### 오른쪽: 대회 결과 패널
- **대회 정보 헤더**:
  - 협회 뱃지
  - 상태 뱃지 (완료/진행중)
  - 대회명
- **요약 정보 카드**:
  - 일정 (시작일)
  - 장소
  - 총 상금
  - 결과 수
- **결과 테이블**:
  - 순위 (메달/뱃지)
  - 선수명
  - 스코어 (색상 구분)
  - 상금 (원화)

## 🔍 특징

### 순위별 시각화
- **1위**: 🥇 금메달 + 노란색 뱃지 + 배경 강조
- **2위**: 🥈 은메달 + 초록색 뱃지 + 배경 강조
- **3위**: 🥉 동메달 + 초록색 뱃지 + 배경 강조
- **4~10위**: 파란색 뱃지
- **11위 이하**: 회색 뱃지

### 스코어 색상
- **언더파** (-14, -12 등): 초록색 (좋은 성적)
- **오버파** (+1, +2 등): 빨간색 (나쁜 성적)
- **이븐파** (0): 회색 (평균)

### 30위 제한
- 대회 결과가 30위보다 많을 경우 상위 30명만 표시
- 하단에 안내 메시지 표시
- 전체 참가자 수 표시

## 🔌 API 엔드포인트

### 1. 대회 목록 조회
```typescript
GET /api/admin/tournaments/results

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "2024 KLPGA 챔피언십",
      "association": "KLPGA",
      "start_date": "2024-10-15",
      "end_date": "2024-10-18",
      "location": "여주",
      "prize_money": 1000000000,
      "status": "completed",
      "results_count": 15
    }
  ],
  "message": "10개의 대회를 찾았습니다."
}
```

### 2. 대회 결과 상세 조회
```typescript
GET /api/admin/tournaments/results?tournamentId=uuid

Response:
{
  "success": true,
  "data": [
    {
      "id": "result-uuid",
      "tournament_id": "tournament-uuid",
      "player_id": "player-uuid",
      "player_name": "김효주",
      "rank": 1,
      "score": -14,
      "prize_amount": 200000000
    }
  ],
  "message": "15명의 결과를 찾았습니다."
}
```

## 📊 데이터베이스 구조

### tournaments 테이블
```sql
SELECT 
  t.id,
  t.name,
  t.association,
  t.start_date,
  t.end_date,
  t.location,
  t.prize_money,
  t.status,
  COUNT(tr.id) as results_count
FROM tournaments t
LEFT JOIN tournament_results tr ON t.id = tr.tournament_id
GROUP BY t.id
HAVING COUNT(tr.id) > 0  -- 결과가 있는 대회만
ORDER BY t.created_at DESC
```

### tournament_results 테이블
```sql
SELECT 
  tr.id,
  tr.tournament_id,
  COALESCE(u.name, tr.player_name) as player_name,
  tr.rank,
  tr.score,
  tr.prize_amount
FROM tournament_results tr
LEFT JOIN users u ON tr.player_id = u.id
WHERE tr.tournament_id = ?
ORDER BY tr.rank ASC
```

## 💡 사용 팁

### 빠른 검색
1. 대회명 일부만 입력해도 검색 가능
2. 장소 이름으로도 검색 가능
3. 실시간 필터링으로 즉시 결과 확인

### 메뉴 구조
- **AI 대회입력**: Gemini AI로 새 대회 결과 입력
- **대회결과 조회**: 저장된 대회 결과 확인 (이 페이지)
- **대회관리**: 대회 등록/수정/삭제

### 데이터 흐름
1. Gemini AI로 대회 결과 파싱
2. 데이터베이스에 저장
3. 대회결과 조회 페이지에서 확인

## ⚠️ 주의사항

1. **30위 제한**
   - UI 성능을 위해 상위 30명만 표시
   - 전체 데이터는 DB에 저장됨
   - API 응답에는 모든 데이터 포함

2. **결과 필터링**
   - 결과가 없는 대회는 목록에 표시되지 않음
   - 최소 1명 이상의 결과가 있어야 표시

3. **데이터 무결성**
   - 선수 정보는 users 테이블과 연동
   - player_id가 없으면 player_name만 표시

## 🚀 향후 개선 사항

- [ ] 페이지네이션 (30위 이후 결과)
- [ ] 엑셀 다운로드 기능
- [ ] 대회 결과 수정/삭제 기능
- [ ] 차트/그래프 시각화
- [ ] 선수별 통계 (역대 성적)
- [ ] 대회별 비교 기능
- [ ] 인쇄 최적화 레이아웃
- [ ] 상금 순위 정렬 옵션

## 📞 문의

문제가 있거나 개선 사항이 있으면 관리자에게 문의해주세요.

---

**마지막 업데이트:** 2025년 10월 14일  
**버전:** 1.0.0

