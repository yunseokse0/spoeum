import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, User } from '@/types';

export const dynamic = 'force-dynamic';

// Mock 회원 데이터
const mockMembers: User[] = [
  {
    id: 'user_001',
    email: 'golfer1@example.com',
    name: '김골퍼',
    phone: '010-1234-5678',
    userType: 'tour_pro',
    role: 'user',
    profileImage: undefined,
    isVerified: true,
    isActive: true,
    lastLoginAt: new Date('2024-01-15T10:30:00Z'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    status: 'active',
    gender: 'male',
    tourProInfo: {
      association: 'KPGA',
      memberNumber: 'KPGA12345',
      gender: 'male',
      career: [
        { year: 2023, title: 'KPGA 투어 우승', result: '1위' },
        { year: 2022, title: '한국 오픈', result: 'Top 10' }
      ],
      ranking: { '2023': 15, '2022': 25 },
      totalPrize: 50000000
    }
  },
  {
    id: 'user_002',
    email: 'caddy1@example.com',
    name: '이캐디',
    phone: '010-2345-6789',
    userType: 'caddy',
    role: 'user',
    profileImage: undefined,
    isVerified: true,
    isActive: true,
    lastLoginAt: new Date('2024-01-14T15:20:00Z'),
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-14'),
    status: 'active',
    gender: 'female',
    caddyInfo: {
      gender: 'female',
      mainClub: '제주 블루원',
      additionalClubs: ['제주 핀크스'],
      freelancer: false,
      career: 5,
      rating: 4.8,
      totalContracts: 1200,
      specializations: ['코스 관리', '클럽 선택', '퍼팅 조언']
    }
  },
  {
    id: 'user_003',
    email: 'sponsor1@example.com',
    name: '박스폰서',
    phone: '010-3456-7890',
    userType: 'sponsor',
    role: 'user',
    profileImage: undefined,
    isVerified: false,
    isActive: false,
    lastLoginAt: new Date('2024-01-10T09:15:00Z'),
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-10'),
    status: 'pending',
    sponsorInfo: {
      companyName: '스포츠 브랜드',
      businessLicense: '123-45-67890',
      representative: '박스폰서',
      address: '서울특별시 강남구 테헤란로 123',
      website: 'https://sportsbrand.co.kr',
      industry: '스포츠 용품',
      companySize: 'medium',
      budget: 100000000,
      businessLicenseVerified: false
    }
  },
  {
    id: 'user_004',
    email: 'amateur1@example.com',
    name: '최아마추어',
    phone: '010-4567-8901',
    userType: 'amateur',
    role: 'user',
    profileImage: undefined,
    isVerified: true,
    isActive: true,
    lastLoginAt: new Date('2024-01-12T14:30:00Z'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    status: 'active',
    gender: 'male',
    amateurInfo: {
      gender: 'male',
      handicap: 12,
      preferredRegions: ['서울', '경기']
    }
  },
  {
    id: 'user_005',
    email: 'agency1@example.com',
    name: '정에이전시',
    phone: '010-5678-9012',
    userType: 'agency',
    role: 'user',
    profileImage: undefined,
    isVerified: true,
    isActive: true,
    lastLoginAt: new Date('2024-01-13T11:45:00Z'),
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-13'),
    status: 'active',
    agencyInfo: {
      businessLicense: '987-65-43210',
      companyName: '골프 에이전시',
      address: '서울특별시 서초구 서초대로 456',
      representative: '정에이전시',
      businessLicenseVerified: true
    }
  }
];

// GET - 회원 목록 조회 (인증 불필요)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const userType = searchParams.get('userType') || 'all';
    const status = searchParams.get('status') || 'all';

    // 필터링
    let filteredMembers = mockMembers;

    if (search) {
      const query = search.toLowerCase();
      filteredMembers = filteredMembers.filter(member =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.phone.includes(query)
      );
    }

    if (userType !== 'all') {
      filteredMembers = filteredMembers.filter(member => member.userType === userType);
    }

    if (status !== 'all') {
      filteredMembers = filteredMembers.filter(member => member.status === status);
    }

    // 정렬 (최신순)
    filteredMembers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

    const response: ApiResponse = {
      success: true,
      data: paginatedMembers,
      message: '회원 목록을 성공적으로 조회했습니다.',
      pagination: {
        page,
        limit,
        total: filteredMembers.length,
        totalPages: Math.ceil(filteredMembers.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch members:', error);
    const response: ApiResponse = {
      success: false,
      error: '회원 목록 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
