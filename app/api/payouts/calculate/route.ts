import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 캐디 정산 계산 API
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('tournamentId');

    if (!tournamentId) {
      return NextResponse.json({
        success: false,
        error: '대회 ID가 필요합니다.'
      }, { status: 400 });
    }

    console.log(`캐디 정산 계산 시작: ${tournamentId}`);

    // TODO: 실제 데이터베이스 연동
    // 1. tournament_results에서 해당 대회의 결과 조회
    // 2. contracts 테이블에서 선수-캐디 매핑 정보 조회
    // 3. payout_rules 테이블에서 정산 규칙 조회
    // 4. 각 선수별로 캐디 정산 금액 계산
    // 5. caddy_payouts 테이블에 저장

    // Mock 데이터 (데모용)
    const mockPayouts = [
      {
        id: `payout-1-${Date.now()}`,
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
        paid_date: null,
        notes: null
      },
      {
        id: `payout-2-${Date.now()}`,
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
        paid_status: false,
        paid_date: null,
        notes: null
      },
      {
        id: `payout-3-${Date.now()}`,
        tournament_id: tournamentId,
        result_id: 'result-3',
        player_name: '박선수',
        player_id: null,
        caddy_name: '정캐디',
        caddy_id: null,
        rank: 15,
        prize_amount: 30000000,
        payout_rate: 7.00,
        payout_amount: 2100000,
        paid_status: false,
        paid_date: null,
        notes: null
      },
      {
        id: `payout-4-${Date.now()}`,
        tournament_id: tournamentId,
        result_id: 'result-4',
        player_name: '정선수',
        player_id: null,
        caddy_name: '강캐디',
        caddy_id: null,
        rank: 25,
        prize_amount: 20000000,
        payout_rate: 7.00,
        payout_amount: 1400000,
        paid_status: false,
        paid_date: null,
        notes: null
      },
      {
        id: `payout-5-${Date.now()}`,
        tournament_id: tournamentId,
        result_id: 'result-5',
        player_name: '최선수',
        player_id: null,
        caddy_name: '윤캐디',
        caddy_id: null,
        rank: 35,
        prize_amount: 15000000,
        payout_rate: 5.00,
        payout_amount: 750000,
        paid_status: false,
        paid_date: null,
        notes: null
      }
    ];

    return NextResponse.json({
      success: true,
      payouts: mockPayouts,
      message: `${mockPayouts.length}건의 캐디 정산이 계산되었습니다.`
    });

  } catch (error) {
    console.error('캐디 정산 계산 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '캐디 정산 계산 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

