import { NextRequest, NextResponse } from 'next/server';
import { signupSchema } from '@/lib/validations';
import { hashPassword, generateToken } from '@/lib/auth';
import { ApiResponse } from '@/types';

// 임시 사용자 저장소 (실제 구현 시 데이터베이스 사용)
let mockUsers: any[] = [
  {
    id: '1',
    email: 'test@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeBsG0d6kF5vKqZqK',
    name: '테스트 사용자',
    phone: '010-1234-5678',
    userType: 'caddy',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 입력 데이터 검증
    const validatedData = signupSchema.parse(body);
    const { email, password, name, phone, userType } = validatedData;

    // 이메일 중복 확인
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        message: '이미 가입된 이메일입니다.',
      };
      return NextResponse.json(response, { status: 409 });
    }

    // 전화번호 중복 확인
    const existingPhone = mockUsers.find(u => u.phone === phone);
    if (existingPhone) {
      const response: ApiResponse = {
        success: false,
        message: '이미 가입된 전화번호입니다.',
      };
      return NextResponse.json(response, { status: 409 });
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 새 사용자 생성
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      password: hashedPassword,
      name,
      phone,
      userType,
      role: 'user' as const,
      isVerified: false,
      isActive: true,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 사용자 저장 (실제 구현 시 데이터베이스에 저장)
    mockUsers.push(newUser);

    // JWT 토큰 생성
    const token = generateToken(newUser);

    // 응답 데이터 (비밀번호 제외)
    const { password: _, ...userWithoutPassword } = newUser;

    const response: ApiResponse = {
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
      message: '회원가입에 성공했습니다.',
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Signup error:', error);

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
      message: '회원가입 중 오류가 발생했습니다.',
      error: error.message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
