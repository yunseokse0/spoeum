import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { tournamentId: string } }
) {
  try {
    const { tournamentId } = params;

    if (!tournamentId) {
      return NextResponse.json({
        success: false,
        error: '대회 ID가 필요합니다.'
      }, { status: 400 });
    }

    // Vercel 환경에서는 mock 데이터 반환
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      const mockPayouts = [
        {
          id: 'payout-1',
          tournament_id: tournamentId,
          player_name: '김선수',
          player_id: 'player-1',
          caddy_name: '이캐디',
          caddy_id: 'caddy-1',
          rank: 1,
          prize_amount: 30000000,
          payout_rate: 0.10,
          payout_amount: 3000000,
          paid_status: false,
          paid_date: null,
          created_at: new Date().toISOString(),
          tournament_name: '2024 한화클래식'
        },
        {
          id: 'payout-2',
          tournament_id: tournamentId,
          player_name: '박선수',
          player_id: 'player-2',
          caddy_name: '최캐디',
          caddy_id: 'caddy-2',
          rank: 2,
          prize_amount: 20000000,
          payout_rate: 0.10,
          payout_amount: 2000000,
          paid_status: false,
          paid_date: null,
          created_at: new Date().toISOString(),
          tournament_name: '2024 한화클래식'
        },
        {
          id: 'payout-3',
          tournament_id: tournamentId,
          player_name: '정선수',
          player_id: 'player-3',
          caddy_name: '한캐디',
          caddy_id: 'caddy-3',
          rank: 3,
          prize_amount: 15000000,
          payout_rate: 0.10,
          payout_amount: 1500000,
          paid_status: true,
          paid_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          tournament_name: '2024 한화클래식'
        }
      ];

      return NextResponse.json({
        success: true,
        payouts: mockPayouts,
        message: `${mockPayouts.length}건의 정산 내역을 찾았습니다.`
      });
    }

    // 로컬 환경에서는 실제 데이터베이스 조회
    const payouts = await executeQuery(
      `
        SELECT 
          cp.id,
          cp.tournament_id,
          cp.player_name,
          cp.player_id,
          cp.caddy_name,
          cp.caddy_id,
          cp.rank,
          cp.prize_amount,
          cp.payout_rate,
          cp.payout_amount,
          cp.paid_status,
          cp.paid_date,
          cp.created_at,
          t.name as tournament_name
        FROM caddy_payouts cp
        LEFT JOIN tournaments t ON cp.tournament_id = t.id
        WHERE cp.tournament_id = ?
        ORDER BY cp.rank ASC
      `,
      [tournamentId]
    );

    return NextResponse.json({
      success: true,
      payouts: payouts || [],
      message: `${Array.isArray(payouts) ? payouts.length : 0}건의 정산 내역을 찾았습니다.`
    });

  } catch (error) {
    console.error('정산 내역 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '정산 내역 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}