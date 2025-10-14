import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';

// 정산 규칙 정의
const PAYOUT_RULES = [
  { minRank: 1, maxRank: 10, rate: 10.00 },
  { minRank: 11, maxRank: 30, rate: 7.00 },
  { minRank: 31, maxRank: 50, rate: 5.00 },
  { minRank: 51, maxRank: 999, rate: 3.00 }
];

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

    // Vercel 환경에서는 mock 데이터 반환
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      const mockPayouts = [
        {
          id: 'payout-1',
          tournament_id: tournamentId,
          player_name: '김선수',
          rank: 1,
          prize_amount: 30000000,
          caddy_name: '이캐디',
          payout_rate: 10,
          payout_amount: 3000000,
          paid_status: false,
          paid_date: null
        },
        {
          id: 'payout-2',
          tournament_id: tournamentId,
          player_name: '박선수',
          rank: 2,
          prize_amount: 20000000,
          caddy_name: '최캐디',
          payout_rate: 10,
          payout_amount: 2000000,
          paid_status: false,
          paid_date: null
        },
        {
          id: 'payout-3',
          tournament_id: tournamentId,
          player_name: '정선수',
          rank: 3,
          prize_amount: 15000000,
          caddy_name: '한캐디',
          payout_rate: 10,
          payout_amount: 1500000,
          paid_status: false,
          paid_date: null
        },
        {
          id: 'payout-4',
          tournament_id: tournamentId,
          player_name: '강선수',
          rank: 15,
          prize_amount: 5000000,
          caddy_name: '윤캐디',
          payout_rate: 7,
          payout_amount: 350000,
          paid_status: false,
          paid_date: null
        },
        {
          id: 'payout-5',
          tournament_id: tournamentId,
          player_name: '조선수',
          rank: 35,
          prize_amount: 3000000,
          caddy_name: '임캐디',
          payout_rate: 5,
          payout_amount: 150000,
          paid_status: false,
          paid_date: null
        }
      ];

      const totalAmount = mockPayouts.reduce((sum, p) => sum + p.payout_amount, 0);

      return NextResponse.json({
        success: true,
        message: `${mockPayouts.length}건의 캐디 정산이 계산되었습니다.`,
        payouts: mockPayouts,
        summary: {
          total_payouts: mockPayouts.length,
          total_amount: totalAmount
        }
      });
    }

    // 로컬 환경에서는 실제 데이터베이스 처리
    // 1. 대회 결과 조회
    const results = await executeQuery(
      `
        SELECT 
          tr.id,
          tr.tournament_id,
          tr.player_id,
          COALESCE(u.name, tr.player_name) as player_name,
          tr.\`rank\`,
          tr.score,
          tr.prize_amount,
          tr.created_at
        FROM tournament_results tr
        LEFT JOIN users u ON tr.player_id = u.id
        WHERE tr.tournament_id = ?
        ORDER BY tr.\`rank\` ASC
      `,
      [tournamentId]
    );

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({
        success: false,
        error: '대회 결과를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // 2. 기존 정산 내역 삭제
    await executeQuery(
      'DELETE FROM caddy_payouts WHERE tournament_id = ?',
      [tournamentId]
    );

    // 3. 각 선수별로 캐디 정산 계산
    const payouts = [];
    let savedCount = 0;

    for (const result of results) {
      try {
        // 정산 규칙에 따른 지급율 계산
        const rule = PAYOUT_RULES.find(r => 
          result.rank >= r.minRank && result.rank <= r.maxRank
        );
        
        const payoutRate = rule ? rule.rate : 0;
        const payoutAmount = Math.round((result.prize_amount * payoutRate) / 100);

        // 임시 캐디명 생성 (실제로는 캐디 매칭 로직 필요)
        const caddyName = `${result.player_name} 캐디`;

        // 정산 데이터 저장
        await executeQuery(
          `
            INSERT INTO caddy_payouts (
              tournament_id,
              result_id,
              player_name,
              player_id,
              caddy_name,
              caddy_id,
              rank,
              prize_amount,
              payout_rate,
              payout_amount,
              paid_status,
              created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE, NOW())
          `,
          [
            tournamentId,
            result.id,
            result.player_name,
            result.player_id,
            caddyName,
            null, // 실제 캐디 ID (나중에 매칭)
            result.rank,
            result.prize_amount,
            payoutRate,
            payoutAmount
          ]
        );

        payouts.push({
          id: `payout-${result.id}`,
          tournament_id: tournamentId,
          player_name: result.player_name,
          rank: result.rank,
          prize_amount: result.prize_amount,
          caddy_name: caddyName,
          payout_rate: payoutRate,
          payout_amount: payoutAmount,
          paid_status: false,
          paid_date: null
        });

        savedCount++;
      } catch (error) {
        console.error(`선수 ${result.player_name} 정산 계산 오류:`, error);
      }
    }

    console.log(`캐디 정산 계산 완료: ${savedCount}건`);

    return NextResponse.json({
      success: true,
      message: `${savedCount}건의 캐디 정산이 계산되었습니다.`,
      payouts,
      summary: {
        total_payouts: savedCount,
        total_amount: payouts.reduce((sum, p) => sum + p.payout_amount, 0)
      }
    });

  } catch (error) {
    console.error('캐디 정산 계산 오류:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '정산 계산 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}