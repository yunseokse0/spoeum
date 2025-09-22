import { NextRequest, NextResponse } from 'next/server';
import { User, ApiResponse, GolfAssociation, Gender, MemberStatus } from '@/types';

export const dynamic = 'force-dynamic';

// Mock 투어프로 회원 데이터
const mockTourProUsers: User[] = [
  {
    id: 'tour_pro_001',
    email: 'kim.tour@example.com',
    name: '김투어프로',
    phone: '010-1234-5678',
    userType: 'tour_pro',
    role: 'user',
    profileImage: '/images/players/kim-tour-pro.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-15T10:30:00Z'),
    createdAt: new Date('2023-06-15T09:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    tourProInfo: {
      association: 'KLPGA',
      memberNumber: 'KLPGA12345',
      gender: 'female',
      career: [
        { year: 2023, title: 'KLPGA 투어 우승', result: '1위', prize: 50000000 },
        { year: 2022, title: '한국 여자 오픈', result: '2위', prize: 30000000 },
        { year: 2021, title: 'KLPGA 선수권', result: '3위', prize: 20000000 }
      ],
      ranking: { '2023': 5, '2022': 12, '2021': 18 },
      totalPrize: 100000000
    }
  },
  {
    id: 'tour_pro_002',
    email: 'lee.golfer@example.com',
    name: '이골퍼',
    phone: '010-2345-6789',
    userType: 'tour_pro',
    role: 'user',
    profileImage: '/images/players/lee-golfer.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-14T15:20:00Z'),
    createdAt: new Date('2023-03-20T14:00:00Z'),
    updatedAt: new Date('2024-01-14T15:20:00Z'),
    tourProInfo: {
      association: 'KPGA',
      memberNumber: 'KPGA98765',
      gender: 'male',
      career: [
        { year: 2023, title: 'KPGA 투어 우승', result: '1위', prize: 80000000 },
        { year: 2022, title: '코리안 투어', result: '4위', prize: 25000000 }
      ],
      ranking: { '2023': 3, '2022': 8 },
      totalPrize: 105000000
    }
  },
  {
    id: 'tour_pro_003',
    email: 'park.pro@example.com',
    name: '박프로',
    phone: '010-3456-7890',
    userType: 'tour_pro',
    role: 'user',
    profileImage: '/images/players/park-pro.jpg',
    isVerified: true,
    isActive: true,
    status: 'pending',
    lastLoginAt: new Date('2024-01-13T11:45:00Z'),
    createdAt: new Date('2024-01-10T16:30:00Z'),
    updatedAt: new Date('2024-01-13T11:45:00Z'),
    tourProInfo: {
      association: 'KLPGA',
      memberNumber: 'KLPGA54321',
      gender: 'female',
      career: [
        { year: 2023, title: 'KLPGA 신인왕', result: '신인상', prize: 15000000 }
      ],
      ranking: { '2023': 25 },
      totalPrize: 15000000
    }
  },
  {
    id: 'tour_pro_004',
    email: 'choi.master@example.com',
    name: '최마스터',
    phone: '010-4567-8901',
    userType: 'tour_pro',
    role: 'user',
    profileImage: '/images/players/choi-master.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-12T09:15:00Z'),
    createdAt: new Date('2022-09-05T10:20:00Z'),
    updatedAt: new Date('2024-01-12T09:15:00Z'),
    tourProInfo: {
      association: 'KPGA',
      memberNumber: 'KPGA11111',
      gender: 'male',
      career: [
        { year: 2023, title: 'KPGA 선수권', result: '2위', prize: 40000000 },
        { year: 2022, title: '대회 우승', result: '1위', prize: 60000000 },
        { year: 2021, title: '투어 우승', result: '1위', prize: 70000000 }
      ],
      ranking: { '2023': 2, '2022': 1, '2021': 3 },
      totalPrize: 170000000
    }
  },
  {
    id: 'tour_pro_005',
    email: 'jung.ace@example.com',
    name: '정에이스',
    phone: '010-5678-9012',
    userType: 'tour_pro',
    role: 'user',
    profileImage: '/images/players/jung-ace.jpg',
    isVerified: false,
    isActive: true,
    status: 'suspended',
    lastLoginAt: new Date('2024-01-08T14:30:00Z'),
    createdAt: new Date('2023-11-20T13:45:00Z'),
    updatedAt: new Date('2024-01-08T14:30:00Z'),
    tourProInfo: {
      association: 'KLPGA',
      memberNumber: 'KLPGA99999',
      gender: 'female',
      career: [],
      ranking: {},
      totalPrize: 0
    }
  }
];

// GET - 투어프로 회원 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const association = searchParams.get('association');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filteredUsers = mockTourProUsers;

    // 협회 필터
    if (association && association !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.tourProInfo?.association === association
      );
    }

    // 상태 필터
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // 검색 필터
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.tourProInfo?.memberNumber?.includes(search)
      );
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response: ApiResponse = {
      success: true,
      data: paginatedUsers,
      message: '투어프로 회원 목록을 성공적으로 조회했습니다.',
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch tour pro members:', error);
    const response: ApiResponse = {
      success: false,
      error: '투어프로 회원 목록 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
