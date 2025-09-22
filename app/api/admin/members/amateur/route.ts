import { NextRequest, NextResponse } from 'next/server';
import { User, ApiResponse, Gender, MemberStatus } from '@/types';

export const dynamic = 'force-dynamic';

// Mock 아마추어 회원 데이터
const mockAmateurUsers: User[] = [
  {
    id: 'amateur_001',
    email: 'kim.amateur@example.com',
    name: '김아마추어',
    phone: '010-1111-2222',
    userType: 'amateur',
    role: 'user',
    profileImage: '/images/players/kim-amateur.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-15T08:30:00Z'),
    createdAt: new Date('2023-08-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T08:30:00Z'),
    amateurInfo: {
      gender: 'male',
      handicap: 12,
      preferredRegions: ['서울', '경기도', '강원도']
    }
  },
  {
    id: 'amateur_002',
    email: 'lee.golfer@example.com',
    name: '이고퍼',
    phone: '010-2222-3333',
    userType: 'amateur',
    role: 'user',
    profileImage: '/images/players/lee-golfer.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-14T16:20:00Z'),
    createdAt: new Date('2023-05-20T14:30:00Z'),
    updatedAt: new Date('2024-01-14T16:20:00Z'),
    amateurInfo: {
      gender: 'female',
      handicap: 18,
      preferredRegions: ['부산', '경상남도']
    }
  },
  {
    id: 'amateur_003',
    email: 'park.beginner@example.com',
    name: '박초보',
    phone: '010-3333-4444',
    userType: 'amateur',
    role: 'user',
    profileImage: '/images/players/park-beginner.jpg',
    isVerified: true,
    isActive: true,
    status: 'pending',
    lastLoginAt: new Date('2024-01-13T12:45:00Z'),
    createdAt: new Date('2024-01-12T11:20:00Z'),
    updatedAt: new Date('2024-01-13T12:45:00Z'),
    amateurInfo: {
      gender: 'male',
      handicap: 28,
      preferredRegions: ['인천', '경기도']
    }
  },
  {
    id: 'amateur_004',
    email: 'choi.pro@example.com',
    name: '최프로급',
    phone: '010-4444-5555',
    userType: 'amateur',
    role: 'user',
    profileImage: '/images/players/choi-pro.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-12T07:15:00Z'),
    createdAt: new Date('2023-02-10T09:45:00Z'),
    updatedAt: new Date('2024-01-12T07:15:00Z'),
    amateurInfo: {
      gender: 'male',
      handicap: 5,
      preferredRegions: ['제주도', '전라남도', '경상북도']
    }
  },
  {
    id: 'amateur_005',
    email: 'jung.lady@example.com',
    name: '정레이디',
    phone: '010-5555-6666',
    userType: 'amateur',
    role: 'user',
    profileImage: '/images/players/jung-lady.jpg',
    isVerified: false,
    isActive: true,
    status: 'inactive',
    lastLoginAt: new Date('2023-12-20T15:30:00Z'),
    createdAt: new Date('2023-09-15T16:20:00Z'),
    updatedAt: new Date('2023-12-20T15:30:00Z'),
    amateurInfo: {
      gender: 'female',
      handicap: 22,
      preferredRegions: ['대구', '경상북도']
    }
  },
  {
    id: 'amateur_006',
    email: 'yoon.master@example.com',
    name: '윤마스터',
    phone: '010-6666-7777',
    userType: 'amateur',
    role: 'user',
    profileImage: '/images/players/yoon-master.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-14T13:20:00Z'),
    createdAt: new Date('2022-12-05T12:00:00Z'),
    updatedAt: new Date('2024-01-14T13:20:00Z'),
    amateurInfo: {
      gender: 'male',
      handicap: 8,
      preferredRegions: ['서울', '경기도', '강원도', '충청북도']
    }
  },
  {
    id: 'amateur_007',
    email: 'han.ace@example.com',
    name: '한에이스',
    phone: '010-7777-8888',
    userType: 'amateur',
    role: 'user',
    profileImage: '/images/players/han-ace.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-15T10:45:00Z'),
    createdAt: new Date('2023-07-20T15:30:00Z'),
    updatedAt: new Date('2024-01-15T10:45:00Z'),
    amateurInfo: {
      gender: 'female',
      handicap: 15,
      preferredRegions: ['경기도', '강원도']
    }
  }
];

// GET - 아마추어 회원 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const gender = searchParams.get('gender');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filteredUsers = mockAmateurUsers;

    // 성별 필터
    if (gender && gender !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.amateurInfo?.gender === gender
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
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response: ApiResponse = {
      success: true,
      data: paginatedUsers,
      message: '아마추어 회원 목록을 성공적으로 조회했습니다.',
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch amateur members:', error);
    const response: ApiResponse = {
      success: false,
      error: '아마추어 회원 목록 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
