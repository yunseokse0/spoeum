import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ApiResponse, PaginatedResponse, SponsorshipProposal, SponsorshipProposalForm, SponsorshipFilter } from '@/types';

// 임시 스폰서십 제안 데이터
const mockProposals: SponsorshipProposal[] = [
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

// GET - 스폰서십 제안 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const sponsorId = searchParams.get('sponsorId');
    const playerId = searchParams.get('playerId');
    const exposureItem = searchParams.get('exposureItem');
    const isTournamentBased = searchParams.get('isTournamentBased');

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

    // 필터링
    let filteredProposals = mockProposals;

    if (status) {
      filteredProposals = filteredProposals.filter(p => p.status === status);
    }

    if (sponsorId) {
      filteredProposals = filteredProposals.filter(p => p.sponsorId === sponsorId);
    }

    if (playerId) {
      filteredProposals = filteredProposals.filter(p => p.playerId === playerId);
    }

    if (exposureItem) {
      filteredProposals = filteredProposals.filter(p => p.exposureItems.includes(exposureItem as any));
    }

    if (isTournamentBased !== null) {
      const tournamentBased = isTournamentBased === 'true';
      filteredProposals = filteredProposals.filter(p => p.isTournamentBased === tournamentBased);
    }

    // 페이지네이션
    const total = filteredProposals.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProposals = filteredProposals.slice(startIndex, endIndex);

    const response: PaginatedResponse<SponsorshipProposal> = {
      success: true,
      data: paginatedProposals,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get sponsorship proposals error:', error);

    const response: ApiResponse = {
      success: false,
      message: '스폰서십 제안 목록을 불러오는 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST - 스폰서십 제안 생성
export async function POST(request: NextRequest) {
  try {
    const body: SponsorshipProposalForm = await request.json();
    const { playerId, exposureItems, startDate, endDate, amount, isTournamentBased, tournamentId, message } = body;

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

    // 필수 필드 검증
    if (!playerId || !exposureItems || !startDate || !endDate || !amount || !message) {
      const response: ApiResponse = {
        success: false,
        message: '필수 필드가 누락되었습니다.',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 새 스폰서십 제안 생성
    const newProposal: SponsorshipProposal = {
      id: (mockProposals.length + 1).toString(),
      sponsorId: decoded.userId,
      playerId,
      exposureItems,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      amount,
      isTournamentBased,
      tournamentId,
      message,
      status: 'proposed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProposals.push(newProposal);

    // TODO: 선수에게 알림톡/푸시 알림 발송

    const response: ApiResponse = {
      success: true,
      data: newProposal,
      message: '스폰서십 제안이 전송되었습니다.',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Create sponsorship proposal error:', error);

    const response: ApiResponse = {
      success: false,
      message: '스폰서십 제안 생성 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
