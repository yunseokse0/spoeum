import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ApiResponse, PaginatedResponse, Tournament, TournamentFilter } from '@/types';

// 임시 대회 데이터 (실제 구현 시 데이터베이스에서 조회)
const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: '2024 PGA 투어 한국 오픈',
    description: '한국에서 열리는 가장 권위 있는 PGA 투어 대회입니다.',
    location: '제주도',
    course: '제주 골프클럽',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
    registrationStartDate: new Date('2024-01-01'),
    registrationEndDate: new Date('2024-03-01'),
    type: 'pga',
    category: 'men',
    entryFee: 5000000,
    prizePool: 2000000000,
    maxParticipants: 156,
    currentParticipants: 142,
    organizer: '한국골프협회',
    contactInfo: '02-1234-5678',
    website: 'https://koreanopen.pga.or.kr',
    imageUrl: '/images/tournaments/pga-korea-open.jpg',
    isActive: true,
    isRegistrationOpen: false,
    requirements: ['PGA 투어 카드 보유', '핸디캡 +2 이하'],
    rules: ['USGA 룰 적용', '드롭 존 규칙', '플레이 속도 규칙'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: '2024 KPGA 투어 제네시스 챔피언십',
    description: 'KPGA 투어의 메이저 대회로 세계적인 골퍼들이 참가합니다.',
    location: '경기도 용인',
    course: '제네시스 골프클럽',
    startDate: new Date('2024-04-20'),
    endDate: new Date('2024-04-22'),
    registrationStartDate: new Date('2024-02-01'),
    registrationEndDate: new Date('2024-04-01'),
    type: 'kpga',
    category: 'men',
    entryFee: 3000000,
    prizePool: 1500000000,
    maxParticipants: 120,
    currentParticipants: 98,
    organizer: 'KPGA',
    contactInfo: '02-2345-6789',
    website: 'https://genesis.kpga.or.kr',
    imageUrl: '/images/tournaments/genesis-championship.jpg',
    isActive: true,
    isRegistrationOpen: true,
    requirements: ['KPGA 투어 카드 보유', '핸디캡 +4 이하'],
    rules: ['KPGA 룰 적용', '코스 정책 준수'],
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: '2024 아마추어 골프 챔피언십',
    description: '아마추어 골퍼들을 위한 최고의 대회입니다.',
    location: '서울',
    course: '서울 골프클럽',
    startDate: new Date('2024-05-10'),
    endDate: new Date('2024-05-12'),
    registrationStartDate: new Date('2024-03-01'),
    registrationEndDate: new Date('2024-04-30'),
    type: 'amateur',
    category: 'mixed',
    entryFee: 500000,
    prizePool: 100000000,
    maxParticipants: 200,
    currentParticipants: 156,
    organizer: '한국아마추어골프협회',
    contactInfo: '02-3456-7890',
    website: 'https://amateur.kga.or.kr',
    imageUrl: '/images/tournaments/amateur-championship.jpg',
    isActive: true,
    isRegistrationOpen: true,
    requirements: ['아마추어 자격', '핸디캡 10 이하'],
    rules: ['아마추어 룰 적용', '기본 골프 에티켓'],
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    name: '2024 기업 골프 대회',
    description: '기업 임직원들을 위한 친선 골프 대회입니다.',
    location: '경기도 양평',
    course: '양평 리조트 골프클럽',
    startDate: new Date('2024-06-15'),
    endDate: new Date('2024-06-15'),
    registrationStartDate: new Date('2024-04-01'),
    registrationEndDate: new Date('2024-06-01'),
    type: 'corporate',
    category: 'mixed',
    entryFee: 200000,
    prizePool: 50000000,
    maxParticipants: 100,
    currentParticipants: 67,
    organizer: '기업골프연맹',
    contactInfo: '02-4567-8901',
    website: 'https://corporate.golf.or.kr',
    imageUrl: '/images/tournaments/corporate-tournament.jpg',
    isActive: true,
    isRegistrationOpen: true,
    requirements: ['기업 임직원', '핸디캡 제한 없음'],
    rules: ['기본 골프 룰', '네트워킹 우선'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '5',
    name: '2024 자선 골프 대회',
    description: '사회공헌을 위한 자선 골프 대회입니다.',
    location: '부산',
    course: '부산 골프클럽',
    startDate: new Date('2024-07-20'),
    endDate: new Date('2024-07-20'),
    registrationStartDate: new Date('2024-05-01'),
    registrationEndDate: new Date('2024-07-01'),
    type: 'charity',
    category: 'mixed',
    entryFee: 300000,
    prizePool: 0,
    maxParticipants: 150,
    currentParticipants: 89,
    organizer: '사회공헌재단',
    contactInfo: '02-5678-9012',
    website: 'https://charity.golf.or.kr',
    imageUrl: '/images/tournaments/charity-tournament.jpg',
    isActive: true,
    isRegistrationOpen: true,
    requirements: ['참가비 납부', '기부 의향'],
    rules: ['자선 목적 우선', '기본 골프 룰'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-30'),
  },
];

// GET - 대회 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const isRegistrationOpen = searchParams.get('isRegistrationOpen');
    const isActive = searchParams.get('isActive');

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
    let filteredTournaments = mockTournaments;

    if (type) {
      filteredTournaments = filteredTournaments.filter(t => t.type === type);
    }

    if (category) {
      filteredTournaments = filteredTournaments.filter(t => t.category === category);
    }

    if (location) {
      filteredTournaments = filteredTournaments.filter(t => 
        t.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (isRegistrationOpen !== null) {
      const isOpen = isRegistrationOpen === 'true';
      filteredTournaments = filteredTournaments.filter(t => t.isRegistrationOpen === isOpen);
    }

    if (isActive !== null) {
      const active = isActive === 'true';
      filteredTournaments = filteredTournaments.filter(t => t.isActive === active);
    }

    // 페이지네이션
    const total = filteredTournaments.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTournaments = filteredTournaments.slice(startIndex, endIndex);

    const response: PaginatedResponse<Tournament> = {
      success: true,
      data: paginatedTournaments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get tournaments error:', error);

    const response: ApiResponse = {
      success: false,
      message: '대회 목록을 불러오는 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
