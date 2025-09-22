import { NextRequest, NextResponse } from 'next/server';
import { User, ApiResponse, MemberStatus } from '@/types';

export const dynamic = 'force-dynamic';

// Mock 에이전시 회원 데이터
const mockAgencyUsers: User[] = [
  {
    id: 'agency_001',
    email: 'contact@topagency.co.kr',
    name: '김에이전시',
    phone: '010-8000-1000',
    userType: 'agency',
    role: 'user',
    profileImage: '/images/agencies/topagency.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-15T09:30:00Z'),
    createdAt: new Date('2023-02-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T09:30:00Z'),
    agencyInfo: {
      businessLicense: '123-45-67890',
      companyName: '탑에이전시',
      address: '서울특별시 강남구 테헤란로 123',
      representative: '김에이전시',
      businessLicenseVerified: true
    }
  },
  {
    id: 'agency_002',
    email: 'info@proagency.com',
    name: '이프로',
    phone: '010-8000-2000',
    userType: 'agency',
    role: 'user',
    profileImage: '/images/agencies/proagency.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-14T16:20:00Z'),
    createdAt: new Date('2023-04-20T14:30:00Z'),
    updatedAt: new Date('2024-01-14T16:20:00Z'),
    agencyInfo: {
      businessLicense: '987-65-43210',
      companyName: '프로에이전시',
      address: '부산광역시 해운대구 센텀로 456',
      representative: '이프로',
      businessLicenseVerified: true
    }
  },
  {
    id: 'agency_003',
    email: 'admin@newagency.co.kr',
    name: '박신규',
    phone: '010-8000-3000',
    userType: 'agency',
    role: 'user',
    profileImage: '/images/agencies/newagency.jpg',
    isVerified: true,
    isActive: true,
    status: 'pending',
    lastLoginAt: new Date('2024-01-13T12:45:00Z'),
    createdAt: new Date('2024-01-10T11:20:00Z'),
    updatedAt: new Date('2024-01-13T12:45:00Z'),
    agencyInfo: {
      businessLicense: '111-22-33333',
      companyName: '뉴에이전시',
      address: '대구광역시 수성구 동대구로 789',
      representative: '박신규',
      businessLicenseVerified: false
    }
  },
  {
    id: 'agency_004',
    email: 'ceo@megaagency.com',
    name: '최메가',
    phone: '010-8000-4000',
    userType: 'agency',
    role: 'user',
    profileImage: '/images/agencies/megaagency.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-12T07:15:00Z'),
    createdAt: new Date('2022-08-05T10:20:00Z'),
    updatedAt: new Date('2024-01-12T07:15:00Z'),
    agencyInfo: {
      businessLicense: '555-66-77777',
      companyName: '메가에이전시',
      address: '제주특별자치도 제주시 중앙로 101',
      representative: '최메가',
      businessLicenseVerified: true
    }
  },
  {
    id: 'agency_005',
    email: 'manager@startupagency.io',
    name: '정스타트업',
    phone: '010-8000-5000',
    userType: 'agency',
    role: 'user',
    profileImage: '/images/agencies/startupagency.jpg',
    isVerified: false,
    isActive: true,
    status: 'suspended',
    lastLoginAt: new Date('2023-11-20T15:30:00Z'),
    createdAt: new Date('2023-10-20T13:45:00Z'),
    updatedAt: new Date('2023-11-20T15:30:00Z'),
    agencyInfo: {
      businessLicense: '999-88-77777',
      companyName: '스타트업에이전시',
      address: '인천광역시 연수구 컨벤시아대로 202',
      representative: '정스타트업',
      businessLicenseVerified: false
    }
  },
  {
    id: 'agency_006',
    email: 'director@eliteagency.co.kr',
    name: '윤엘리트',
    phone: '010-8000-6000',
    userType: 'agency',
    role: 'user',
    profileImage: '/images/agencies/eliteagency.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-14T13:20:00Z'),
    createdAt: new Date('2022-11-05T12:00:00Z'),
    updatedAt: new Date('2024-01-14T13:20:00Z'),
    agencyInfo: {
      businessLicense: '333-44-55555',
      companyName: '엘리트에이전시',
      address: '경기도 성남시 분당구 판교로 303',
      representative: '윤엘리트',
      businessLicenseVerified: true
    }
  },
  {
    id: 'agency_007',
    email: 'admin@globalagency.com',
    name: '한글로벌',
    phone: '010-8000-7000',
    userType: 'agency',
    role: 'user',
    profileImage: '/images/agencies/globalagency.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-15T10:45:00Z'),
    createdAt: new Date('2023-06-20T15:30:00Z'),
    updatedAt: new Date('2024-01-15T10:45:00Z'),
    agencyInfo: {
      businessLicense: '777-88-99999',
      companyName: '글로벌에이전시',
      address: '광주광역시 서구 상무대로 404',
      representative: '한글로벌',
      businessLicenseVerified: true
    }
  },
  {
    id: 'agency_008',
    email: 'contact@specialagency.co.kr',
    name: '특수에이전시',
    phone: '010-8000-8000',
    userType: 'agency',
    role: 'user',
    profileImage: '/images/agencies/specialagency.jpg',
    isVerified: true,
    isActive: true,
    status: 'active',
    lastLoginAt: new Date('2024-01-15T11:30:00Z'),
    createdAt: new Date('2023-09-15T16:30:00Z'),
    updatedAt: new Date('2024-01-15T11:30:00Z'),
    agencyInfo: {
      businessLicense: '222-33-44444',
      companyName: '특수에이전시',
      address: '대전광역시 유성구 대학로 505',
      representative: '특수에이전시',
      businessLicenseVerified: true
    }
  }
];

// GET - 에이전시 회원 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const verification = searchParams.get('verification');
    const search = searchParams.get('search');

    let filteredUsers = mockAgencyUsers;

    // 상태 필터
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // 검증 필터
    if (verification && verification !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        verification === 'verified' ? user.agencyInfo?.businessLicenseVerified : !user.agencyInfo?.businessLicenseVerified
      );
    }

    // 검색 필터
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.agencyInfo?.companyName.toLowerCase().includes(searchLower) ||
        user.agencyInfo?.businessLicense.includes(search)
      );
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response: ApiResponse = {
      success: true,
      data: paginatedUsers,
      message: '에이전시 회원 목록을 성공적으로 조회했습니다.',
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch agency members:', error);
    const response: ApiResponse = {
      success: false,
      error: '에이전시 회원 목록 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
