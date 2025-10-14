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

    // 정산 내역 조회
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