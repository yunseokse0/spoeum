import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 특정 대회의 캐디 정산 내역 조회 API
export async function GET(
  request: NextRequest,
  { params }: { params: { tournamentId: string } }
) {
  try {
    const tournamentId = params.tournamentId;

    console.log(`캐디 정산 내역 조회: ${tournamentId}`);

    // TODO: 실제 데이터베이스 연동
    // SELECT * FROM caddy_payouts WHERE tournament_id = ?

    // Mock 데이터 (데모용)
    const mockPayouts = [
      {
        id: 'payout-1',
        tournament_id: tournamentId,
        result_id: 'result-1',
        player_name: '김선수',
        player_id: null,
        caddy_name: '박캐디',
        caddy_id: null,
        rank: 1,
        prize_amount: 100000000,
        payout_rate: 10.00,
        payout_amount: 10000000,
        paid_status: false,
        paid_date: null
      },
      {
        id: 'payout-2',
        tournament_id: tournamentId,
        result_id: 'result-2',
        player_name: '이선수',
        player_id: null,
        caddy_name: '최캐디',
        caddy_id: null,
        rank: 5,
        prize_amount: 50000000,
        payout_rate: 10.00,
        payout_amount: 5000000,
        paid_status: true,
        paid_date: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      payouts: mockPayouts
    });

  } catch (error) {
    console.error('정산 내역 조회 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '정산 내역 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

