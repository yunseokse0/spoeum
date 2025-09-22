import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ApiResponse, PaginatedResponse, Sponsor, SponsorshipFilter } from '@/types';

// 임시 스폰서 데이터 (실제 구현 시 데이터베이스에서 조회)
const mockSponsors: Sponsor[] = [
  {
    id: '1',
    userId: 'user1',
    companyName: '골프테크 코리아',
    businessLicense: '123-45-67890',
    representative: '김대표',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    email: 'contact@golftech.co.kr',
    website: 'https://golftech.co.kr',
    industry: '골프용품',
    companySize: 'medium',
    budget: 100000000,
    isVerified: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    userId: 'user2',
    companyName: '프리미엄 골프웨어',
    businessLicense: '234-56-78901',
    representative: '이사장',
    address: '경기도 성남시 분당구 판교로 456',
    phone: '031-2345-6789',
    email: 'info@premiumgolf.co.kr',
    website: 'https://premiumgolf.co.kr',
    industry: '패션/의류',
    companySize: 'large',
    budget: 200000000,
    isVerified: true,
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    userId: 'user3',
    companyName: '스마트 골프 장비',
    businessLicense: '345-67-89012',
    representative: '박대표',
    address: '부산시 해운대구 센텀중앙로 789',
    phone: '051-3456-7890',
    email: 'sales@smartgolf.co.kr',
    website: 'https://smartgolf.co.kr',
    industry: '스포츠용품',
    companySize: 'small',
    budget: 50000000,
    isVerified: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
  },
];

// GET - 스폰서 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const industry = searchParams.get('industry');
    const companySize = searchParams.get('companySize');
    const isVerified = searchParams.get('isVerified');

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
    let filteredSponsors = mockSponsors;

    if (industry) {
      filteredSponsors = filteredSponsors.filter(s => s.industry === industry);
    }

    if (companySize) {
      filteredSponsors = filteredSponsors.filter(s => s.companySize === companySize);
    }

    if (isVerified !== null) {
      const verified = isVerified === 'true';
      filteredSponsors = filteredSponsors.filter(s => s.isVerified === verified);
    }

    // 페이지네이션
    const total = filteredSponsors.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSponsors = filteredSponsors.slice(startIndex, endIndex);

    const response: PaginatedResponse<Sponsor> = {
      success: true,
      data: paginatedSponsors,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get sponsors error:', error);

    const response: ApiResponse = {
      success: false,
      message: '스폰서 목록을 불러오는 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST - 스폰서 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, companyName, businessLicense, representative, address, phone, email, website, industry, companySize, budget } = body;

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
    if (!companyName || !businessLicense || !representative || !address || !phone || !email || !industry || !companySize || !budget) {
      const response: ApiResponse = {
        success: false,
        message: '필수 필드가 누락되었습니다.',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 새 스폰서 생성 (실제 구현 시 데이터베이스에 저장)
    const newSponsor: Sponsor = {
      id: (mockSponsors.length + 1).toString(),
      userId: decoded.userId,
      companyName,
      businessLicense,
      representative,
      address,
      phone,
      email,
      website,
      industry,
      companySize,
      budget,
      isVerified: false, // 초기에는 미인증
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockSponsors.push(newSponsor);

    const response: ApiResponse = {
      success: true,
      data: newSponsor,
      message: '스폰서 등록이 완료되었습니다.',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Create sponsor error:', error);

    const response: ApiResponse = {
      success: false,
      message: '스폰서 등록 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
