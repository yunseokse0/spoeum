import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

interface MemberStats {
  total: number;
  tourPro: number;
  amateur: number;
  caddy: number;
  sponsor: number;
  agency: number;
  active: number;
  pending: number;
}

// Mock 회원 통계 데이터
const mockMemberStats: MemberStats = {
  total: 1250,
  tourPro: 85,
  amateur: 420,
  caddy: 680,
  sponsor: 45,
  agency: 20,
  active: 980,
  pending: 35
};

// GET - 회원 통계 조회
export async function GET(request: NextRequest) {
  try {
    const response: ApiResponse = {
      success: true,
      data: mockMemberStats,
      message: '회원 통계를 성공적으로 조회했습니다.'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch member stats:', error);
    const response: ApiResponse = {
      success: false,
      error: '회원 통계 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
