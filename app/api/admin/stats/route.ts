import { NextRequest, NextResponse } from 'next/server';
import { AdminStats } from '@/types';

export const dynamic = 'force-dynamic';

// Mock 관리자 통계 데이터
const mockAdminStats: AdminStats = {
  totalUsers: 1250,
  activeUsers: 980,
  totalContracts: 340,
  activeContracts: 156,
  totalPayments: 2840,
  monthlyRevenue: 45000000,
  totalSponsorships: 45,
  activeSponsorships: 23,
  totalTournaments: 28,
  upcomingTournaments: 5
};

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

    // TODO: 실제 JWT 토큰 검증
    const token = authHeader.substring(7);
    console.log('관리자 통계 요청:', token);

    // 통계 데이터 반환
    return NextResponse.json({
      success: true,
      data: mockAdminStats
    });

  } catch (error) {
    console.error('관리자 통계 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '관리자 통계 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// OPTIONS 메서드 (CORS 지원)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
