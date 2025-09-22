import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

// PUT - 캐디 골프장 승인/거절
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { clubName, action } = await request.json();
    const userId = params.id;

    // 액션 유효성 검사
    const validActions = ['approve', 'reject'];
    if (!validActions.includes(action)) {
      const response: ApiResponse = {
        success: false,
        error: '유효하지 않은 액션입니다.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 클럽명 유효성 검사
    if (!clubName || typeof clubName !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: '골프장명이 필요합니다.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Mock: 실제 구현에서는 데이터베이스에서 캐디의 골프장 소속 상태 업데이트
    console.log(`Updating user ${userId} golf course ${clubName} to ${action}`);

    const response: ApiResponse = {
      success: true,
      message: `골프장 ${action === 'approve' ? '승인' : '거절'}이 완료되었습니다.`,
      data: {
        userId,
        clubName,
        action,
        updatedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to update golf course approval:', error);
    const response: ApiResponse = {
      success: false,
      error: '골프장 승인 처리 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
