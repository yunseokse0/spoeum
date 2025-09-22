import { NextRequest, NextResponse } from 'next/server';
import { ContractCancellationRequest, ContractCancellationResponse, Contract, ContractCancellation } from '@/types';

// 임시 저장소 (실제 운영 시 DB 연동)
const contracts: Contract[] = [
  {
    id: 'contract_001',
    matchingRequestId: 'req_001',
    requesterId: 'golfer_001',
    providerId: 'caddy_001',
    type: 'tournament',
    title: '제주 블루원 골프 투어',
    description: '제주 블루원에서 진행되는 골프 투어 캐디 서비스',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-03'),
    location: '제주 블루원',
    baseRate: 500000,
    status: 'active',
    terms: '3일간 투어 캐디 서비스',
    penaltyRate: 20, // 20% 위약금
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'contract_002',
    matchingRequestId: 'req_002',
    requesterId: 'sponsor_001',
    providerId: 'golfer_001',
    type: 'annual',
    title: '2024 시즌 스폰서십 계약',
    description: '1년간 골프백, 모자 스폰서십',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    location: '전국',
    baseRate: 50000000,
    status: 'active',
    terms: '1년간 스폰서십 서비스',
    penaltyRate: 15, // 15% 위약금
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export async function POST(request: NextRequest) {
  try {
    const body: ContractCancellationRequest = await request.json();
    const { contractId, whoCancelled, reason, penaltyPercent = 20 } = body;

    console.log(`계약 파기 요청: ${contractId} - ${whoCancelled}`);

    // 계약 조회
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) {
      return NextResponse.json<ContractCancellationResponse>({
        success: false,
        error: '계약을 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // 이미 파기된 계약인지 확인
    if (contract.status === 'cancelled') {
      return NextResponse.json<ContractCancellationResponse>({
        success: false,
        error: '이미 파기된 계약입니다.'
      }, { status: 400 });
    }

    // 계약이 활성 상태인지 확인
    if (contract.status !== 'active') {
      return NextResponse.json<ContractCancellationResponse>({
        success: false,
        error: '활성 상태인 계약만 파기할 수 있습니다.'
      }, { status: 400 });
    }

    // 위약금 비율 결정 (요청된 비율 또는 계약서에 명시된 비율)
    const finalPenaltyPercent = penaltyPercent || contract.penaltyRate || 20;
    
    // 위약금 금액 계산
    const penaltyAmount = Math.round(contract.baseRate * (finalPenaltyPercent / 100));

    // 위약금 수령자 결정
    let beneficiary: 'golfer' | 'caddy' | 'sponsor';
    
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
      default:
        beneficiary = 'golfer';
    }

    // 계약 파기 정보 생성
    const cancellation: ContractCancellation = {
      whoCancelled,
      reason: reason.trim(),
      penaltyPercent: finalPenaltyPercent,
      penaltyAmount,
      beneficiary,
      date: new Date(),
      status: 'pending',
      notes: `계약 파기 처리 중 - 위약금 ${penaltyAmount.toLocaleString()}원`
    };

    // 계약 상태 업데이트
    contract.status = 'cancelled';
    contract.cancellation = cancellation;
    contract.updatedAt = new Date();

    // TODO: 실제 결제 시스템 연동
    console.log(`위약금 처리 시작: ${penaltyAmount.toLocaleString()}원 → ${beneficiary}`);
    
    // Mock 결제 처리 (실제로는 PG API 호출)
    setTimeout(() => {
      processPenaltyPayment(contract, cancellation);
    }, 1000);

    console.log(`계약 파기 처리 완료: ${contractId}`);

    return NextResponse.json<ContractCancellationResponse>({
      success: true,
      data: {
        contractId,
        cancellation,
        newStatus: 'cancelled'
      }
    });

  } catch (error) {
    console.error('계약 파기 API 오류:', error);
    
    return NextResponse.json<ContractCancellationResponse>({
      success: false,
      error: error instanceof Error ? error.message : '계약 파기 처리 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// 위약금 결제 처리 (Mock)
async function processPenaltyPayment(contract: Contract, cancellation: ContractCancellation) {
  try {
    console.log(`위약금 결제 처리 시작: ${contract.id}`);
    
    // Mock 결제 처리 (실제로는 PG API 호출)
    const mockPaymentId = `penalty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 결제 성공 시뮬레이션
    setTimeout(() => {
      if (contract.cancellation) {
        contract.cancellation.status = 'completed';
        contract.cancellation.paymentId = mockPaymentId;
        contract.cancellation.notes = `위약금 결제 완료 - ${cancellation.penaltyAmount.toLocaleString()}원`;
        contract.updatedAt = new Date();
        
        console.log(`위약금 결제 완료: ${contract.id} - ${mockPaymentId}`);
        
        // TODO: 실제 알림 시스템 연동
        sendCancellationNotification(contract, cancellation);
      }
    }, 2000);
    
  } catch (error) {
    console.error('위약금 결제 처리 오류:', error);
    
    if (contract.cancellation) {
      contract.cancellation.status = 'failed';
      contract.cancellation.notes = '위약금 결제 실패';
      contract.updatedAt = new Date();
    }
  }
}

// 계약 파기 알림 발송 (Mock)
function sendCancellationNotification(contract: Contract, cancellation: ContractCancellation) {
  console.log(`계약 파기 알림 발송:`);
  console.log(`- 계약: ${contract.title}`);
  console.log(`- 파기 주체: ${cancellation.whoCancelled}`);
  console.log(`- 위약금: ${cancellation.penaltyAmount.toLocaleString()}원`);
  console.log(`- 수령자: ${cancellation.beneficiary}`);
  
  // TODO: 실제 알림톡/푸시 알림 발송
  // - 파기한 당사자에게 파기 완료 알림
  // - 위약금 수령자에게 위약금 입금 알림
  // - 관련 당사자들에게 계약 파기 알림
}

// 계약 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractId = searchParams.get('id');

    if (contractId) {
      const contract = contracts.find(c => c.id === contractId);
      if (!contract) {
        return NextResponse.json({
          success: false,
          error: '계약을 찾을 수 없습니다.'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: contract
      });
    }

    // 전체 계약 목록 반환
    return NextResponse.json({
      success: true,
      data: contracts
    });

  } catch (error) {
    console.error('계약 조회 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '계약 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// OPTIONS 메서드 (CORS 지원)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
