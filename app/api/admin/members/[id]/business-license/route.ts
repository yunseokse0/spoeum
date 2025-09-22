import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

// PUT - 사업자등록증 검증 상태 변경
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { verified } = await request.json();
    const userId = params.id;

    // 검증 상태 유효성 검사
    if (typeof verified !== 'boolean') {
      const response: ApiResponse = {
        success: false,
        error: '유효하지 않은 검증 상태입니다.'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Mock: 실제 구현에서는 데이터베이스에서 사업자등록증 검증 상태 업데이트
    console.log(`Updating user ${userId} business license verification to ${verified}`);

    const response: ApiResponse = {
      success: true,
      message: `사업자등록증이 ${verified ? '승인' : '거절'}되었습니다.`,
      data: {
        userId,
        businessLicenseVerified: verified,
        updatedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to update business license verification:', error);
    const response: ApiResponse = {
      success: false,
      error: '사업자등록증 검증 상태 변경 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
