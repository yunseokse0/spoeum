import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Tournament } from '@/types';

export const dynamic = 'force-dynamic';

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
    website: 'https://genesis.kpga.co.kr',
    imageUrl: '/images/tournaments/genesis-championship.jpg',
    isActive: true,
    isRegistrationOpen: true,
    requirements: ['KPGA 투어 카드 보유', '핸디캡 +3 이하'],
    rules: ['KPGA 룰 적용', '드롭 존 규칙'],
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: '2024 KLPGA 투어 KB 스타챔피언십',
    description: 'KLPGA 투어의 대표적인 대회로 많은 여성 골퍼들이 참가합니다.',
    location: '경기도 이천',
    course: '이천 골프클럽',
    startDate: new Date('2024-05-10'),
    endDate: new Date('2024-05-12'),
    registrationStartDate: new Date('2024-03-01'),
    registrationEndDate: new Date('2024-05-01'),
    type: 'pga',
    category: 'women',
    entryFee: 2000000,
    prizePool: 800000000,
    maxParticipants: 144,
    currentParticipants: 120,
    organizer: 'KLPGA',
    contactInfo: '02-3456-7890',
    website: 'https://klpga.co.kr',
    imageUrl: '/images/tournaments/kb-star-championship.jpg',
    isActive: true,
    isRegistrationOpen: true,
    requirements: ['KLPGA 투어 카드 보유', '핸디캡 +5 이하'],
    rules: ['KLPGA 룰 적용', '드롭 존 규칙'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    name: '2024 아마추어 골프 챔피언십',
    description: '아마추어 골퍼들을 위한 대회입니다.',
    location: '경기도 포천',
    course: '포천 골프클럽',
    startDate: new Date('2024-06-15'),
    endDate: new Date('2024-06-16'),
    registrationStartDate: new Date('2024-04-01'),
    registrationEndDate: new Date('2024-06-01'),
    type: 'amateur',
    category: 'mixed',
    entryFee: 500000,
    prizePool: 100000000,
    maxParticipants: 100,
    currentParticipants: 75,
    organizer: '한국아마추어골프협회',
    contactInfo: '02-4567-8901',
    website: 'https://amateur-golf.co.kr',
    imageUrl: '/images/tournaments/amateur-championship.jpg',
    isActive: true,
    isRegistrationOpen: true,
    requirements: ['핸디캡 20 이하', '아마추어 자격'],
    rules: ['USGA 룰 적용', '아마추어 규칙'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '5',
    name: '2024 기업 골프 대회',
    description: '기업 임직원들을 위한 골프 대회입니다.',
    location: '경기도 양평',
    course: '양평 골프클럽',
    startDate: new Date('2024-07-20'),
    endDate: new Date('2024-07-21'),
    registrationStartDate: new Date('2024-05-01'),
    registrationEndDate: new Date('2024-07-01'),
    type: 'corporate',
    category: 'mixed',
    entryFee: 300000,
    prizePool: 50000000,
    maxParticipants: 80,
    currentParticipants: 60,
    organizer: '기업골프협회',
    contactInfo: '02-5678-9012',
    website: 'https://corporate-golf.co.kr',
    imageUrl: '/images/tournaments/corporate-tournament.jpg',
    isActive: true,
    isRegistrationOpen: true,
    requirements: ['기업 임직원', '핸디캡 제한 없음'],
    rules: ['기업 규칙 적용', '네트워킹 우선'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-10'),
  }
];

// GET - 대회 목록 조회 (인증 불필요)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'all';
    const category = searchParams.get('category') || 'all';

    // 필터링
    let filteredTournaments = mockTournaments;

    if (search) {
      const query = search.toLowerCase();
      filteredTournaments = filteredTournaments.filter(tournament =>
        tournament.name.toLowerCase().includes(query) ||
        tournament.location.toLowerCase().includes(query) ||
        tournament.course.toLowerCase().includes(query) ||
        tournament.organizer.toLowerCase().includes(query)
      );
    }

    if (type !== 'all') {
      filteredTournaments = filteredTournaments.filter(tournament => tournament.type === type);
    }

    if (category !== 'all') {
      filteredTournaments = filteredTournaments.filter(tournament => tournament.category === category);
    }

    // 정렬 (최신순)
    filteredTournaments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTournaments = filteredTournaments.slice(startIndex, endIndex);

    const response: ApiResponse = {
      success: true,
      data: paginatedTournaments,
      message: '대회 목록을 성공적으로 조회했습니다.',
      pagination: {
        page,
        limit,
        total: filteredTournaments.length,
        totalPages: Math.ceil(filteredTournaments.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch tournaments:', error);
    const response: ApiResponse = {
      success: false,
      error: '대회 목록 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
