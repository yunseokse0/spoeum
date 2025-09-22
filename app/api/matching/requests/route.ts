import { NextRequest, NextResponse } from 'next/server';
import { matchingRequestSchema } from '@/lib/validations';
import { verifyToken } from '@/lib/auth';
import { ApiResponse, PaginatedResponse, MatchingRequest } from '@/types';

// 임시 매칭 요청 저장소 (실제 구현 시 데이터베이스 사용)
let mockMatchingRequests: MatchingRequest[] = [
  {
    id: '1',
    requesterId: 'user1',
    requesterType: 'tour_pro',
    targetType: 'caddy',
    title: '2024 PGA 투어 대회 캐디 필요',
    description: '3월 15일-17일 제주도에서 열리는 PGA 투어 대회에서 캐디를 찾고 있습니다. 경험이 풍부하고 영어 소통이 가능한 캐디를 원합니다.',
    location: '제주도',
    date: new Date('2024-03-15'),
    budget: 800000,
    status: 'pending',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    requesterId: 'user2',
    requesterType: 'amateur',
    targetType: 'caddy',
    title: '아마추어 골프 대회 캐디',
    description: '주말 아마추어 골프 대회에서 캐디가 필요합니다. 친근하고 경험이 있는 캐디를 찾고 있습니다.',
    location: '경기도 양평',
    date: new Date('2024-01-20'),
    budget: 200000,
    status: 'pending',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
];

// GET - 매칭 요청 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const location = searchParams.get('location');
    const targetType = searchParams.get('targetType');

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
    let filteredRequests = mockMatchingRequests;

    if (status) {
      filteredRequests = filteredRequests.filter(req => req.status === status);
    }

    if (location) {
      filteredRequests = filteredRequests.filter(req => 
        req.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (targetType) {
      filteredRequests = filteredRequests.filter(req => req.targetType === targetType);
    }

    // 페이지네이션
    const total = filteredRequests.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    const response: PaginatedResponse<MatchingRequest> = {
      success: true,
      data: paginatedRequests,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get matching requests error:', error);

    const response: ApiResponse = {
      success: false,
      message: '매칭 요청 목록을 불러오는 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST - 새로운 매칭 요청 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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

    // 입력 데이터 검증
    const validatedData = matchingRequestSchema.parse(body);
    
    // 새 매칭 요청 생성
    const newRequest: MatchingRequest = {
      id: (mockMatchingRequests.length + 1).toString(),
      requesterId: decoded.userId,
      requesterType: decoded.userType,
      ...validatedData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 저장 (실제 구현 시 데이터베이스에 저장)
    mockMatchingRequests.unshift(newRequest);

    const response: ApiResponse = {
      success: true,
      data: newRequest,
      message: '매칭 요청이 생성되었습니다.',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Create matching request error:', error);

    if (error.name === 'ZodError') {
      const response: ApiResponse = {
        success: false,
        message: '입력 데이터가 올바르지 않습니다.',
        error: error.errors.map((err: any) => err.message).join(', '),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: false,
      message: '매칭 요청 생성 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
