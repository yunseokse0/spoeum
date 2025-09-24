import { NextRequest, NextResponse } from 'next/server';
import { User, ApiResponse, Gender, MemberStatus } from '@/types';

export const dynamic = 'force-dynamic';

// Mock 캐디 회원 데이터
const mockCaddyUsers: User[] = [
  {
    id: 'caddy_001',
    email: 'kim.caddy@example.com',
    name: '김캐디',
    phone: '010-1000-2000',
    userType: 'caddy',
    role: 'user',
    profileImage: '/images/caddies/kim-caddy.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-15T06:30:00Z'),
    createdAt: new Date('2023-04-15T08:00:00Z'),
    updatedAt: new Date('2024-01-15T06:30:00Z'),
    caddyInfo: {
      gender: 'male',
      mainClub: '제주 블루원',
      additionalClubs: ['제주 핀크스', '해비치 골프'],
      freelancer: false,
      licenseNumber: 'CD12345',
      career: 8,
      specializations: ['장타', '퍼팅', '샷메이킹'],
      rating: 4.8,
      totalContracts: 156,
      cutOffRate: 0, // 컷오프시 금액 (회원가입시 설정)
      cutPassRate: 0, // 컷통과시 금액 (회원가입시 설정)
      availableRegions: ['제주도', '서울', '경기도']
    }
  },
  {
    id: 'caddy_002',
    email: 'lee.pro@example.com',
    name: '이프로캐디',
    phone: '010-2000-3000',
    userType: 'caddy',
    role: 'user',
    profileImage: '/images/caddies/lee-pro.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-14T17:20:00Z'),
    createdAt: new Date('2022-11-20T14:30:00Z'),
    updatedAt: new Date('2024-01-14T17:20:00Z'),
    caddyInfo: {
      gender: 'female',
      mainClub: '서울 골프클럽',
      additionalClubs: ['경기 골프장'],
      freelancer: false,
      licenseNumber: 'CD67890',
      career: 12,
      specializations: ['코스 관리', '심리 코칭', '기술 분석'],
      rating: 4.9,
      totalContracts: 234,
      cutOffRate: 0, // 컷오프시 금액 (회원가입시 설정)
      cutPassRate: 0, // 컷통과시 금액 (회원가입시 설정)
      availableRegions: ['서울', '경기도', '인천']
    }
  },
  {
    id: 'caddy_003',
    email: 'park.freelance@example.com',
    name: '박프리랜서',
    phone: '010-3000-4000',
    userType: 'caddy',
    role: 'user',
    profileImage: '/images/caddies/park-freelance.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-13T13:45:00Z'),
    createdAt: new Date('2023-08-10T11:20:00Z'),
    updatedAt: new Date('2024-01-13T13:45:00Z'),
    caddyInfo: {
      gender: 'male',
      mainClub: undefined,
      additionalClubs: [],
      freelancer: true,
      licenseNumber: 'CD11111',
      career: 5,
      specializations: ['초보자 지도', '기본기'],
      rating: 4.5,
      totalContracts: 67,
      cutOffRate: 0, // 컷오프시 금액 (회원가입시 설정)
      cutPassRate: 0, // 컷통과시 금액 (회원가입시 설정)
      availableRegions: ['전국']
    }
  },
  {
    id: 'caddy_004',
    email: 'choi.expert@example.com',
    name: '최전문가',
    phone: '010-4000-5000',
    userType: 'caddy',
    role: 'user',
    profileImage: '/images/caddies/choi-expert.jpg',
    isVerified: true,
    isActive: true,
    status: 'pending',
    lastLoginAt: new Date('2024-01-12T10:15:00Z'),
    createdAt: new Date('2024-01-10T16:30:00Z'),
    updatedAt: new Date('2024-01-12T10:15:00Z'),
    caddyInfo: {
      gender: 'female',
      mainClub: '부산 골프클럽',
      additionalClubs: ['울산 골프장 (승인대기)'],
      freelancer: false,
      licenseNumber: 'CD22222',
      career: 3,
      specializations: ['여성 골퍼', '기초 지도'],
      rating: 4.2,
      totalContracts: 23,
      cutOffRate: 0, // 컷오프시 금액 (회원가입시 설정)
      cutPassRate: 0, // 컷통과시 금액 (회원가입시 설정)
      availableRegions: ['부산', '울산', '경상남도']
    }
  },
  {
    id: 'caddy_005',
    email: 'jung.veteran@example.com',
    name: '정베테랑',
    phone: '010-5000-6000',
    userType: 'caddy',
    role: 'user',
    profileImage: '/images/caddies/jung-veteran.jpg',
    isVerified: false,
    isActive: true,
    status: 'suspended',
    lastLoginAt: new Date('2023-12-15T14:30:00Z'),
    createdAt: new Date('2021-06-05T10:20:00Z'),
    updatedAt: new Date('2023-12-15T14:30:00Z'),
    caddyInfo: {
      gender: 'male',
      mainClub: '대구 골프클럽',
      additionalClubs: [],
      freelancer: false,
      licenseNumber: 'CD33333',
      career: 15,
      specializations: ['고급 기술', '경기 분석'],
      rating: 4.7,
      totalContracts: 345,
      cutOffRate: 0, // 컷오프시 금액 (회원가입시 설정)
      cutPassRate: 0, // 컷통과시 금액 (회원가입시 설정)
      availableRegions: ['대구', '경상북도']
    }
  },
  {
    id: 'caddy_006',
    email: 'yoon.newbie@example.com',
    name: '윤신입',
    phone: '010-6000-7000',
    userType: 'caddy',
    role: 'user',
    profileImage: '/images/caddies/yoon-newbie.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-14T08:20:00Z'),
    createdAt: new Date('2023-12-20T13:45:00Z'),
    updatedAt: new Date('2024-01-14T08:20:00Z'),
    caddyInfo: {
      gender: 'female',
      mainClub: '인천 골프장',
      additionalClubs: [],
      freelancer: false,
      licenseNumber: 'CD44444',
      career: 1,
      specializations: ['기초 지도'],
      rating: 4.0,
      totalContracts: 12,
      cutOffRate: 0, // 컷오프시 금액 (회원가입시 설정)
      cutPassRate: 0, // 컷통과시 금액 (회원가입시 설정)
      availableRegions: ['인천', '경기도']
    }
  },
  {
    id: 'caddy_007',
    email: 'han.multi@example.com',
    name: '한다중소속',
    phone: '010-7000-8000',
    userType: 'caddy',
    role: 'user',
    profileImage: '/images/caddies/han-multi.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-15T12:45:00Z'),
    createdAt: new Date('2023-01-15T15:30:00Z'),
    updatedAt: new Date('2024-01-15T12:45:00Z'),
    caddyInfo: {
      gender: 'male',
      mainClub: '강원도 골프클럽',
      additionalClubs: ['춘천 골프장', '홍천 골프장 (승인대기)', '평창 골프장'],
      freelancer: false,
      licenseNumber: 'CD55555',
      career: 6,
      specializations: ['코스 관리', '날씨 대응'],
      rating: 4.6,
      totalContracts: 89,
      cutOffRate: 0, // 컷오프시 금액 (회원가입시 설정)
      cutPassRate: 0, // 컷통과시 금액 (회원가입시 설정)
      availableRegions: ['강원도', '경기도']
    }
  }
];

// GET - 캐디 회원 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const gender = searchParams.get('gender');
    const status = searchParams.get('status');
    const freelancer = searchParams.get('freelancer');
    const search = searchParams.get('search');

    let filteredUsers = mockCaddyUsers;

    // 성별 필터
    if (gender && gender !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.caddyInfo?.gender === gender
      );
    }

    // 상태 필터
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // 프리랜서 필터
    if (freelancer && freelancer !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        freelancer === 'freelancer' ? user.caddyInfo?.freelancer : !user.caddyInfo?.freelancer
      );
    }

    // 검색 필터
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.caddyInfo?.mainClub?.toLowerCase().includes(searchLower) ||
        user.caddyInfo?.licenseNumber?.includes(search)
      );
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response: ApiResponse = {
      success: true,
      data: paginatedUsers,
      message: '캐디 회원 목록을 성공적으로 조회했습니다.',
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch caddy members:', error);
    const response: ApiResponse = {
      success: false,
      error: '캐디 회원 목록 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
