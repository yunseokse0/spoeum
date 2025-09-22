import { NextRequest, NextResponse } from 'next/server';
import { User, AdminActivityLog } from '@/types';

// Mock 회원 데이터
const mockUsers: User[] = [
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
    updatedAt: new Date('2024-01-15')
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
    updatedAt: new Date('2024-01-14')
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
    updatedAt: new Date('2024-01-10')
  }
];

// Mock 활동 로그
const mockActivityLogs: AdminActivityLog[] = [];

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: '관리자 권한이 필요합니다.'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';

    // 필터링
    let filteredUsers = mockUsers;

    if (search) {
      const query = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query)
      );
    }

    if (status !== 'all') {
      if (status === 'active') {
        filteredUsers = filteredUsers.filter(user => user.isActive);
      } else if (status === 'inactive') {
        filteredUsers = filteredUsers.filter(user => !user.isActive);
      } else if (status === 'verified') {
        filteredUsers = filteredUsers.filter(user => user.isVerified);
      } else if (status === 'unverified') {
        filteredUsers = filteredUsers.filter(user => !user.isVerified);
      }
    }

    if (type !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.userType === type);
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('관리자 회원 목록 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '회원 목록 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: '관리자 권한이 필요합니다.'
      }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action, value } = body;

    if (!userId || !action) {
      return NextResponse.json({
        success: false,
        error: '필수 필드가 누락되었습니다.'
      }, { status: 400 });
    }

    // 사용자 찾기
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // 활동 로그 생성
    const activityLog: AdminActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      adminId: 'admin_001', // 실제로는 JWT에서 추출
      adminName: '관리자',
      action: `회원 ${action}`,
      resource: 'user',
      resourceId: userId,
      details: { action, value },
      ipAddress: request.ip || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || '',
      createdAt: new Date()
    };

    mockActivityLogs.push(activityLog);

    // 사용자 정보 업데이트
    const user = mockUsers[userIndex];
    let updatedUser = { ...user };

    switch (action) {
      case 'toggle_active':
        updatedUser.isActive = value !== undefined ? value : !user.isActive;
        break;
      case 'toggle_verified':
        updatedUser.isVerified = value !== undefined ? value : !user.isVerified;
        break;
      default:
        return NextResponse.json({
          success: false,
          error: '지원하지 않는 액션입니다.'
        }, { status: 400 });
    }

    updatedUser.updatedAt = new Date();
    mockUsers[userIndex] = updatedUser;

    console.log(`회원 정보 업데이트: ${userId} - ${action}`, activityLog);

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: '회원 정보가 성공적으로 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('관리자 회원 정보 업데이트 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '회원 정보 업데이트 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// OPTIONS 메서드 (CORS 지원)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
