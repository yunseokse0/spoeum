import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ApiResponse, SponsorshipProposal } from '@/types';

// 임시 스폰서십 제안 데이터 (실제 구현 시 데이터베이스에서 조회)
let mockProposals: SponsorshipProposal[] = [
  {
    id: '1',
    sponsorId: '1',
    playerId: 'player1',
    exposureItems: ['hat', 'golf_bag'],
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-01'),
    amount: 20000000,
    isTournamentBased: false,
    message: '저희 골프테크 코리아에서 스폰서십을 제안드립니다. 모자와 골프백에 로고 노출을 원합니다.',
    status: 'proposed',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    sponsorId: '2',
    playerId: 'player2',
    exposureItems: ['shirt', 'pants'],
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-06-01'),
    amount: 15000000,
    isTournamentBased: true,
    tournamentId: '1',
    message: '프리미엄 골프웨어에서 상의와 하의 스폰서십을 제안드립니다.',
    status: 'accepted',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
];

// POST - 스폰서십 제안 응답 (수락/거절/수정 제안)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, counterAmount, counterMessage } = body;

    // 인증 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse = {
        success: false,
        message: '인증이 필요합니다.',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      const response: ApiResponse = {
        success: false,
        message: '유효하지 않은 토큰입니다.',
      };
      return NextResponse.json(response, { status: 401 });
    }

    // 제안 찾기
    const proposalIndex = mockProposals.findIndex(p => p.id === id);
    if (proposalIndex === -1) {
      const response: ApiResponse = {
        success: false,
        message: '스폰서십 제안을 찾을 수 없습니다.',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const proposal = mockProposals[proposalIndex];

    // 권한 확인 (제안을 받은 선수만 응답 가능)
    if (proposal.playerId !== decoded.userId) {
      const response: ApiResponse = {
        success: false,
        message: '응답할 권한이 없습니다.',
      };
      return NextResponse.json(response, { status: 403 });
    }

    // 상태 확인 (제안 중인 상태만 응답 가능)
    if (proposal.status !== 'proposed' && proposal.status !== 'counter_proposed') {
      const response: ApiResponse = {
        success: false,
        message: '이미 처리된 제안입니다.',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 응답 처리
    let updatedProposal: SponsorshipProposal;
    
    switch (action) {
      case 'accept':
        updatedProposal = {
          ...proposal,
          status: 'accepted',
          updatedAt: new Date(),
        };
        break;
        
      case 'reject':
        updatedProposal = {
          ...proposal,
          status: 'rejected',
          updatedAt: new Date(),
        };
        break;
        
      case 'counter_propose':
        if (!counterAmount || !counterMessage) {
          const response: ApiResponse = {
            success: false,
            message: '수정 제안 시 금액과 메시지가 필요합니다.',
          };
          return NextResponse.json(response, { status: 400 });
        }
        
        updatedProposal = {
          ...proposal,
          status: 'counter_proposed',
          counterAmount,
          counterMessage,
          updatedAt: new Date(),
        };
        break;
        
      default:
        const response: ApiResponse = {
          success: false,
          message: '유효하지 않은 응답입니다.',
        };
        return NextResponse.json(response, { status: 400 });
    }

    // 제안 업데이트
    mockProposals[proposalIndex] = updatedProposal;

    // TODO: 스폰서에게 알림톡/푸시 알림 발송

    const response: ApiResponse = {
      success: true,
      data: updatedProposal,
      message: `스폰서십 제안이 ${action === 'accept' ? '수락' : action === 'reject' ? '거절' : '수정 제안'}되었습니다.`,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Respond to sponsorship proposal error:', error);

    const response: ApiResponse = {
      success: false,
      message: '스폰서십 제안 응답 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
