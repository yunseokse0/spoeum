import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { verifyPassword, generateToken } from '@/lib/auth';
import { ApiResponse } from '@/types';

// 임시 사용자 데이터 (실제 구현 시 데이터베이스에서 조회)
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeBsG0d6kF5vKqZqK', // 'password123'
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
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeBsG0d6kF5vKqZqK',
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 입력 데이터 검증
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // 사용자 찾기
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      };
      return NextResponse.json(response, { status: 401 });
    }

    // 비밀번호 확인
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      const response: ApiResponse = {
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      };
      return NextResponse.json(response, { status: 401 });
    }

    // JWT 토큰 생성
    const token = generateToken(user);

    // 응답 데이터 (비밀번호 제외)
    const { password: _, ...userWithoutPassword } = user;

    const response: ApiResponse = {
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
      message: '로그인에 성공했습니다.',
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Login error:', error);

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
      message: '로그인 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
