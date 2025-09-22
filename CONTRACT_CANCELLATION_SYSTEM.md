# 스포이음(SPOEUM) - 계약 파기 및 위약금 시스템

## 🎯 구현 완료 기능

### ✅ 1. 계약 파기 요청
- **파기 주체**: 골퍼, 캐디, 스폰서 중 한쪽이 계약 파기 요청 가능
- **파기 사유**: 필수 입력 사유 선택 및 직접 입력 가능
- **위약금 비율**: 계약 시 설정 가능 (기본 20%)
- **실시간 계산**: 위약금 금액 실시간 계산 및 표시

### ✅ 2. 파기 처리 로직
- **계약 상태 업데이트**: `cancelled` 상태로 변경
- **파기 정보 저장**: `cancellation` 필드에 상세 정보 저장
- **위약금 수령자 결정**: 파기 주체에 따른 자동 결정
- **결제 처리**: Mock 결제 시스템으로 위약금 처리

### ✅ 3. 위약금 규칙
- **골퍼 파기**: 캐디/스폰서가 위약금 수령
- **캐디 파기**: 골퍼가 위약금 수령
- **스폰서 파기**: 골퍼가 위약금 수령
- **위약금 비율**: 계약 시 설정 가능 (기본 20%)

### ✅ 4. 결제 처리 시스템
- **자동 계산**: 계약 금액 × 위약금 비율
- **Mock 결제**: PG API 연동 준비된 구조
- **상태 추적**: pending → processing → completed/failed
- **알림 발송**: 관련 당사자에게 자동 알림

### ✅ 5. UI/UX 구현
- **계약 파기 모달**: 직관적인 파기 요청 인터페이스
- **파기 내역 카드**: 상세한 파기 정보 표시
- **계약 상세 화면**: 파기 내역 섹션 통합
- **모바일 반응형**: 모바일 최적화된 UI

## 📁 프로젝트 구조

```
spoeum/
├── types/
│   └── index.ts                              # 계약 파기 관련 타입 추가
├── app/
│   └── api/
│       └── contracts/
│           └── cancel/
│               └── route.ts                  # 계약 파기 API
├── app/(dashboard)/
│   └── contracts/
│       └── [id]/
│           └── page.tsx                      # 계약 상세 화면 (파기 내역 포함)
├── components/
│   └── ui/
│       ├── ContractCancellationModal.tsx     # 계약 파기 모달
│       └── ContractCancellationCard.tsx      # 파기 내역 카드
└── lib/
    └── api.ts                                # API 클라이언트 (파기 메서드 추가)
```

## 🔧 핵심 기능

### 1. 계약 파기 타입 정의
```typescript
// 계약 파기 정보
export interface ContractCancellation {
  whoCancelled: 'golfer' | 'caddy' | 'sponsor';
  reason: string;
  penaltyPercent: number; // 위약금 비율 (0-100)
  penaltyAmount: number; // 위약금 금액
  beneficiary: 'golfer' | 'caddy' | 'sponsor'; // 위약금 수령자
  date: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentId?: string; // 결제 ID
  notes?: string; // 추가 메모
}

// 계약에 파기 정보 추가
export interface Contract {
  // ... 기존 필드들
  cancellation?: ContractCancellation;
  penaltyRate?: number; // 계약 시 설정된 위약금 비율
}
```

### 2. 계약 파기 API
```typescript
// 파기 요청
POST /api/contracts/cancel
{
  "contractId": "contract_001",
  "whoCancelled": "golfer",
  "reason": "개인 사정으로 인한 불가피한 파기",
  "penaltyPercent": 20
}

// 파기 응답
{
  "success": true,
  "data": {
    "contractId": "contract_001",
    "cancellation": {
      "whoCancelled": "golfer",
      "reason": "개인 사정으로 인한 불가피한 파기",
      "penaltyPercent": 20,
      "penaltyAmount": 100000,
      "beneficiary": "caddy",
      "date": "2024-01-15T10:30:00Z",
      "status": "pending"
    },
    "newStatus": "cancelled"
  }
}
```

### 3. 위약금 계산 로직
```typescript
// 위약금 계산
const penaltyAmount = Math.round(contract.baseRate * (penaltyPercent / 100));

// 위약금 수령자 결정
switch (whoCancelled) {
  case 'golfer':
    // 골퍼가 파기 → 캐디 또는 스폰서가 위약금 수령
    beneficiary = contract.providerId.startsWith('caddy') ? 'caddy' : 'sponsor';
    break;
  case 'caddy':
    // 캐디가 파기 → 골퍼가 위약금 수령
    beneficiary = 'golfer';
    break;
  case 'sponsor':
    // 스폰서가 파기 → 골퍼가 위약금 수령
    beneficiary = 'golfer';
    break;
}
```

### 4. 결제 처리 (Mock)
```typescript
// 위약금 결제 처리
async function processPenaltyPayment(contract: Contract, cancellation: ContractCancellation) {
  // Mock 결제 처리 (실제로는 PG API 호출)
  const mockPaymentId = `penalty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // 결제 성공 시뮬레이션
  setTimeout(() => {
    cancellation.status = 'completed';
    cancellation.paymentId = mockPaymentId;
    cancellation.notes = `위약금 결제 완료 - ${cancellation.penaltyAmount.toLocaleString()}원`;
    
    // 알림 발송
    sendCancellationNotification(contract, cancellation);
  }, 2000);
}
```

## 🎨 UI/UX 특징

### 1. 계약 파기 모달
- **경고 아이콘**: 빨간색 AlertTriangle 아이콘으로 주의 표시
- **계약 정보 표시**: 파기할 계약의 상세 정보 표시
- **파기 사유 선택**: 미리 정의된 사유 + 직접 입력 옵션
- **위약금 계산**: 실시간 위약금 금액 계산 및 표시
- **경고 메시지**: 파기 시 주의사항 안내

### 2. 파기 내역 카드
- **상태 표시**: pending, processing, completed, failed 상태별 색상
- **상세 정보**: 파기 주체, 사유, 위약금 금액, 수령자 정보
- **처리 상태**: 위약금 처리 상태별 안내 메시지
- **결제 정보**: 결제 ID 및 처리 메모 표시

### 3. 계약 상세 화면
- **파기 버튼**: 계약 당사자만 파기 버튼 표시
- **파기 내역 섹션**: 계약 파기 시 파기 내역 카드 표시
- **상태 배지**: 계약 상태별 색상 구분
- **반응형 레이아웃**: 모바일 최적화된 레이아웃

## 📊 데이터 흐름

### 1. 파기 요청 흐름
```
사용자 → 파기 모달 → API 호출 → 위약금 계산 → 계약 상태 변경 → 결제 처리 → 알림 발송
```

### 2. 위약금 처리 흐름
```
파기 요청 → 위약금 계산 → Mock 결제 → 결제 완료 → 상태 업데이트 → 알림 발송
```

### 3. 알림 발송 흐름
```
파기 완료 → 관련 당사자 식별 → 알림톡/푸시 발송 → 처리 완료
```

## 🔒 보안 및 검증

### 1. 권한 검증
- **계약 당사자만 파기**: requesterId 또는 providerId 확인
- **상태 검증**: 활성 계약만 파기 가능
- **파기 사유 필수**: 빈 사유 입력 방지

### 2. 데이터 검증
- **위약금 비율**: 0-100% 범위 검증
- **계약 존재 확인**: 유효한 계약 ID 검증
- **중복 파기 방지**: 이미 파기된 계약 재파기 방지

### 3. 오류 처리
- **API 오류 처리**: 서버 오류 시 적절한 에러 메시지
- **결제 실패 처리**: 결제 실패 시 상태 업데이트
- **롤백 지원**: 오류 시 이전 상태 복원

## 🚀 사용 방법

### 1. 계약 파기 요청
```typescript
// 계약 파기 모달 열기
const handleCancelContract = () => {
  setShowCancellationModal(true);
};

// 파기 요청 제출
const response = await api.cancelContract({
  contractId: 'contract_001',
  whoCancelled: 'golfer',
  reason: '개인 사정으로 인한 불가피한 파기',
  penaltyPercent: 20
});
```

### 2. 파기 내역 조회
```typescript
// 계약 조회 (파기 내역 포함)
const response = await api.getContract(contractId);
const contract = response.data;

if (contract.cancellation) {
  // 파기 내역 표시
  <ContractCancellationCard cancellation={contract.cancellation} />
}
```

### 3. 계약 상세 화면
```typescript
// 계약 상세 페이지
export default function ContractDetailPage() {
  const [contract, setContract] = useState<Contract | null>(null);
  
  // 파기 가능 여부 확인
  const canCancelContract = () => {
    return contract.status === 'active' && 
           (contract.requesterId === user.id || contract.providerId === user.id);
  };
  
  return (
    <div>
      {contract.cancellation && (
        <ContractCancellationCard cancellation={contract.cancellation} />
      )}
      
      <ContractCancellationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        contract={contract}
        userType={getUserType()}
        onCancellationSuccess={handleSuccess}
      />
    </div>
  );
}
```

## 📈 모니터링 및 로깅

### 1. 파기 로그
```typescript
console.log(`계약 파기 요청: ${contractId} - ${whoCancelled}`);
console.log(`위약금 처리 시작: ${penaltyAmount.toLocaleString()}원 → ${beneficiary}`);
console.log(`계약 파기 처리 완료: ${contractId}`);
```

### 2. 결제 로그
```typescript
console.log(`위약금 결제 처리 시작: ${contract.id}`);
console.log(`위약금 결제 완료: ${contract.id} - ${mockPaymentId}`);
```

### 3. 알림 로그
```typescript
console.log(`계약 파기 알림 발송:`);
console.log(`- 계약: ${contract.title}`);
console.log(`- 파기 주체: ${cancellation.whoCancelled}`);
console.log(`- 위약금: ${cancellation.penaltyAmount.toLocaleString()}원`);
```

## 🎯 향후 개선 사항

1. **실제 PG 연동**: Mock 결제를 실제 PG API로 교체
2. **알림 시스템**: 실제 알림톡/푸시 알림 발송
3. **파기 승인**: 상대방 승인 후 파기 처리
4. **분할 결제**: 위약금 분할 결제 지원
5. **파기 이력**: 파기 이력 관리 및 통계
6. **자동화**: 정기 계약 자동 갱신 및 파기

## 🔧 설정 및 커스터마이징

### 1. 위약금 비율 설정
```typescript
// 계약 생성 시 위약금 비율 설정
const contract: Contract = {
  // ... 기타 필드들
  penaltyRate: 20, // 20% 위약금
};
```

### 2. 파기 사유 커스터마이징
```typescript
const cancellationReasons = [
  '개인 사정으로 인한 불가피한 파기',
  '건강상의 이유',
  '일정 변경으로 인한 파기',
  '서비스 품질 문제',
  '경제적 사정',
  '기타 (직접 입력)'
];
```

### 3. 알림 템플릿 설정
```typescript
const notificationTemplates = {
  cancellation: '계약이 파기되었습니다.',
  penaltyReceived: '위약금이 입금되었습니다.',
  penaltyPaid: '위약금이 차감되었습니다.'
};
```

---

**구현 완료!** 🎉 
계약 파기 및 위약금 시스템이 완전히 구축되었습니다.
