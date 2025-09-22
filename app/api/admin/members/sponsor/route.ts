import { NextRequest, NextResponse } from 'next/server';
import { User, ApiResponse, MemberStatus } from '@/types';

export const dynamic = 'force-dynamic';

// Mock 스폰서 회원 데이터
const mockSponsorUsers: User[] = [
  {
    id: 'sponsor_001',
    email: 'sponsor@golfcorp.com',
    name: '김스폰서',
    phone: '010-9000-1000',
    userType: 'sponsor',
    role: 'user',
    profileImage: '/images/sponsors/golfcorp.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-15T09:30:00Z'),
    createdAt: new Date('2023-03-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T09:30:00Z'),
    sponsorInfo: {
      companyName: '골프코퍼레이션',
      businessLicense: '123-45-67890',
      representative: '김스폰서',
      address: '서울특별시 강남구 테헤란로 123',
      website: 'https://www.golfcorp.com',
      industry: '스포츠 용품',
      companySize: 'large',
      budget: 500000000,
      businessLicenseVerified: true
    }
  },
  {
    id: 'sponsor_002',
    email: 'contact@premiumgolf.co.kr',
    name: '이프리미엄',
    phone: '010-9000-2000',
    userType: 'sponsor',
    role: 'user',
    profileImage: '/images/sponsors/premiumgolf.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-14T16:20:00Z'),
    createdAt: new Date('2023-05-20T14:30:00Z'),
    updatedAt: new Date('2024-01-14T16:20:00Z'),
    sponsorInfo: {
      companyName: '프리미엄골프',
      businessLicense: '987-65-43210',
      representative: '이프리미엄',
      address: '부산광역시 해운대구 센텀로 456',
      website: 'https://www.premiumgolf.co.kr',
      industry: '골프 장비',
      companySize: 'medium',
      budget: 200000000,
      businessLicenseVerified: true
    }
  },
  {
    id: 'sponsor_003',
    email: 'info@newbrand.com',
    name: '박신규',
    phone: '010-9000-3000',
    userType: 'sponsor',
    role: 'user',
    profileImage: '/images/sponsors/newbrand.jpg',
    isVerified: true,
    isActive: true,
    status: 'pending',
    lastLoginAt: new Date('2024-01-13T12:45:00Z'),
    createdAt: new Date('2024-01-12T11:20:00Z'),
    updatedAt: new Date('2024-01-13T12:45:00Z'),
    sponsorInfo: {
      companyName: '뉴브랜드골프',
      businessLicense: '111-22-33333',
      representative: '박신규',
      address: '대구광역시 수성구 동대구로 789',
      website: 'https://www.newbrand.com',
      industry: '의류',
      companySize: 'small',
      budget: 50000000,
      businessLicenseVerified: false
    }
  },
  {
    id: 'sponsor_004',
    email: 'ceo@megaenterprise.com',
    name: '최메가',
    phone: '010-9000-4000',
    userType: 'sponsor',
    role: 'user',
    profileImage: '/images/sponsors/megaenterprise.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-12T07:15:00Z'),
    createdAt: new Date('2022-09-05T10:20:00Z'),
    updatedAt: new Date('2024-01-12T07:15:00Z'),
    sponsorInfo: {
      companyName: '메가엔터프라이즈',
      businessLicense: '555-66-77777',
      representative: '최메가',
      address: '제주특별자치도 제주시 중앙로 101',
      website: 'https://www.megaenterprise.com',
      industry: '금융',
      companySize: 'enterprise',
      budget: 1000000000,
      businessLicenseVerified: true
    }
  },
  {
    id: 'sponsor_005',
    email: 'manager@startupgolf.io',
    name: '정스타트업',
    phone: '010-9000-5000',
    userType: 'sponsor',
    role: 'user',
    profileImage: '/images/sponsors/startupgolf.jpg',
    isVerified: false,
    isActive: true,
    status: 'suspended',
    lastLoginAt: new Date('2023-12-20T15:30:00Z'),
    createdAt: new Date('2023-11-20T13:45:00Z'),
    updatedAt: new Date('2023-12-20T15:30:00Z'),
    sponsorInfo: {
      companyName: '스타트업골프',
      businessLicense: '999-88-77777',
      representative: '정스타트업',
      address: '인천광역시 연수구 컨벤시아대로 202',
      website: 'https://www.startupgolf.io',
      industry: 'IT',
      companySize: 'small',
      budget: 10000000,
      businessLicenseVerified: false
    }
  },
  {
    id: 'sponsor_006',
    email: 'director@luxurygolf.co.kr',
    name: '윤럭셔리',
    phone: '010-9000-6000',
    userType: 'sponsor',
    role: 'user',
    profileImage: '/images/sponsors/luxurygolf.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-14T13:20:00Z'),
    createdAt: new Date('2022-12-05T12:00:00Z'),
    updatedAt: new Date('2024-01-14T13:20:00Z'),
    sponsorInfo: {
      companyName: '럭셔리골프',
      businessLicense: '333-44-55555',
      representative: '윤럭셔리',
      address: '경기도 성남시 분당구 판교로 303',
      website: 'https://www.luxurygolf.co.kr',
      industry: '명품',
      companySize: 'medium',
      budget: 300000000,
      businessLicenseVerified: true
    }
  },
  {
    id: 'sponsor_007',
    email: 'admin@techgolf.com',
    name: '한테크',
    phone: '010-9000-7000',
    userType: 'sponsor',
    role: 'user',
    profileImage: '/images/sponsors/techgolf.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-15T10:45:00Z'),
    createdAt: new Date('2023-07-20T15:30:00Z'),
    updatedAt: new Date('2024-01-15T10:45:00Z'),
    sponsorInfo: {
      companyName: '테크골프',
      businessLicense: '777-88-99999',
      representative: '한테크',
      address: '광주광역시 서구 상무대로 404',
      website: 'https://www.techgolf.com',
      industry: '기술',
      companySize: 'medium',
      budget: 150000000,
      businessLicenseVerified: true
    }
  }
];

// GET - 스폰서 회원 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const verification = searchParams.get('verification');
    const search = searchParams.get('search');

    let filteredUsers = mockSponsorUsers;

    // 상태 필터
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // 검증 필터
    if (verification && verification !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        verification === 'verified' ? user.sponsorInfo?.businessLicenseVerified : !user.sponsorInfo?.businessLicenseVerified
      );
    }

    // 검색 필터
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.sponsorInfo?.companyName.toLowerCase().includes(searchLower) ||
        user.sponsorInfo?.businessLicense.includes(search)
      );
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response: ApiResponse = {
      success: true,
      data: paginatedUsers,
      message: '스폰서 회원 목록을 성공적으로 조회했습니다.',
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch sponsor members:', error);
    const response: ApiResponse = {
      success: false,
      error: '스폰서 회원 목록 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
