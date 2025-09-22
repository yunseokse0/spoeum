import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, MemberStatus } from '@/types';

export const dynamic = 'force-dynamic';

// PUT - 회원 상태 변경
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const userId = params.id;

    // 상태 유효성 검사
    const validStatuses: MemberStatus[] = ['active', 'inactive', 'pending', 'suspended'];
    if (!validStatuses.includes(status)) {
      const response: ApiResponse = {
        success: false,
        error: '유효하지 않은 상태입니다.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Mock: 실제 구현에서는 데이터베이스에서 사용자 상태 업데이트
    console.log(`Updating user ${userId} status to ${status}`);

    const response: ApiResponse = {
      success: true,
      message: `회원 상태가 ${status}로 변경되었습니다.`,
      data: {
        userId,
        status,
        updatedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to update user status:', error);
    const response: ApiResponse = {
      success: false,
      error: '회원 상태 변경 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
