import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ApiResponse, Tournament } from '@/types';

// 임시 대회 데이터 (실제 구현 시 데이터베이스에서 조회)
const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: '2024 PGA 투어 한국 오픈',
    description: '한국에서 열리는 가장 권위 있는 PGA 투어 대회입니다. 세계적인 프로 골퍼들이 참가하여 치열한 경쟁을 펼칩니다.',
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
    requirements: ['PGA 투어 카드 보유', '핸디캡 +2 이하', '최근 2년 내 상위 10위 입상 경력'],
    rules: ['USGA 룰 적용', '드롭 존 규칙', '플레이 속도 규칙', '드레스 코드 준수'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: '2024 KPGA 투어 제네시스 챔피언십',
    description: 'KPGA 투어의 메이저 대회로 한국을 대표하는 프로 골퍼들이 참가합니다.',
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
    requirements: ['KPGA 투어 카드 보유', '핸디캡 +4 이하', '최근 1년 내 우승 경력'],
    rules: ['KPGA 룰 적용', '코스 정책 준수', '스코어카드 관리'],
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: '2024 아마추어 골프 챔피언십',
    description: '아마추어 골퍼들을 위한 최고의 대회로 다양한 수준의 골퍼들이 참가할 수 있습니다.',
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
    requirements: ['아마추어 자격', '핸디캡 10 이하', '골프 경력 2년 이상'],
    rules: ['아마추어 룰 적용', '기본 골프 에티켓', '페어플레이 정신'],
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

// GET - 개별 대회 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    // 대회 찾기
    const tournament = mockTournaments.find(t => t.id === id);
    if (!tournament) {
      const response: ApiResponse = {
        success: false,
        message: '대회를 찾을 수 없습니다.',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: tournament,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get tournament error:', error);

    const response: ApiResponse = {
      success: false,
      message: '대회 정보를 불러오는 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
