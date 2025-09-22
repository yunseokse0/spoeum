import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ApiResponse, User } from '@/types';

export const dynamic = 'force-dynamic';

// 임시 사용자 데이터 (실제 구현 시 데이터베이스에서 조회)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    name: '테스트 사용자',
    phone: '010-1234-5678',
    userType: 'caddy' as const,
    role: 'user' as const,
    isVerified: true,
    isActive: true,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'pro@example.com',
    name: '김투어프로',
    phone: '010-2345-6789',
    userType: 'tour_pro' as const,
    role: 'user' as const,
    isVerified: true,
    isActive: true,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// GET - 사용자 프로필 조회
export async function GET(request: NextRequest) {
  try {
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

    // 사용자 정보 조회
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: user,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get profile error:', error);

    const response: ApiResponse = {
      success: false,
      message: '프로필을 불러오는 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - 사용자 프로필 업데이트
export async function PUT(request: NextRequest) {
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

    // 사용자 정보 조회
    const userIndex = mockUsers.findIndex(u => u.id === decoded.userId);
    if (userIndex === -1) {
      const response: ApiResponse = {
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 프로필 업데이트
    const updatedUser = {
      ...mockUsers[userIndex],
      ...body,
      updatedAt: new Date(),
    };

    mockUsers[userIndex] = updatedUser;

    const response: ApiResponse = {
      success: true,
      data: updatedUser,
      message: '프로필이 업데이트되었습니다.',
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Update profile error:', error);

    const response: ApiResponse = {
      success: false,
      message: '프로필 업데이트 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
