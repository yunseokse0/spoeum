import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';

interface TournamentResult {
  player_name: string;
  rank: number;
  score: number;
  prize_amount: number;
}

interface SaveTournamentRequest {
  tournament_name: string;
  results: TournamentResult[];
}

// 대회 결과 저장
export async function POST(request: NextRequest) {
  try {
    const body: SaveTournamentRequest = await request.json();
    const { tournament_name, results } = body;

    if (!tournament_name || !results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json({
        success: false,
        error: '대회명과 결과 데이터가 필요합니다.'
      }, { status: 400 });
    }

    console.log(`대회 결과 저장 시작: ${tournament_name}, ${results.length}명`);

    // 1. 대회 정보 저장 (tournaments 테이블)
    const tournamentInsert = await query({
      query: `
        INSERT INTO tournaments (
          name,
          association,
          start_date,
          end_date,
          location,
          prize_money,
          max_participants,
          status,
          description,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      values: [
        tournament_name,
        'KLPGA',
        new Date(),
        new Date(),
        'Korea',
        results.reduce((sum, r) => sum + r.prize_amount, 0), // 총 상금
        results.length,
        'completed',
        `${tournament_name} 대회 결과`
      ]
    });

    const tournamentId = (tournamentInsert as any).insertId;

    if (!tournamentId) {
      throw new Error('대회 생성 실패');
    }

    // 2. 대회 결과 저장 (tournament_results 테이블)
    let savedCount = 0;
    const errors: string[] = [];

    for (const result of results) {
      try {
        // 먼저 선수가 있는지 확인 (선수명으로 검색)
        const playerCheck = await query({
          query: `
            SELECT id FROM users 
            WHERE name = ? AND user_type = 'tour_pro'
            LIMIT 1
          `,
          values: [result.player_name]
        });

        let playerId = null;
        
        // 선수가 없으면 임시 선수 계정 생성
        if (Array.isArray(playerCheck) && playerCheck.length === 0) {
          const playerInsert = await query({
            query: `
              INSERT INTO users (
                email, 
                password_hash, 
                name, 
                phone, 
                user_type, 
                status,
                created_at
              ) VALUES (?, ?, ?, ?, 'tour_pro', 'active', NOW())
            `,
            values: [
              `${result.player_name.toLowerCase().replace(/\s+/g, '')}@temp.com`,
              'temp_password_hash', // 임시 해시
              result.player_name,
              '010-0000-0000',
            ]
          });
          
          playerId = (playerInsert as any).insertId;
        } else if (Array.isArray(playerCheck) && playerCheck.length > 0) {
          playerId = (playerCheck[0] as any).id;
        }

        if (!playerId) {
          errors.push(`선수 ${result.player_name} 저장 실패`);
          continue;
        }

        // 대회 결과 저장
        await query({
          query: `
            INSERT INTO tournament_results (
              tournament_id,
              player_id,
              player_name,
              \`rank\`,
              score,
              prize_amount,
              created_at
            ) VALUES (?, ?, ?, ?, ?, ?, NOW())
          `,
          values: [
            tournamentId,
            playerId,
            result.player_name,
            result.rank,
            result.score,
            result.prize_amount
          ]
        });

        savedCount++;
      } catch (error) {
        console.error(`선수 ${result.player_name} 저장 오류:`, error);
        errors.push(`${result.player_name}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `대회 결과가 저장되었습니다.`,
      tournament_id: tournamentId,
      saved_count: savedCount,
      total_count: results.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('대회 결과 저장 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      details: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    }, { status: 500 });
  }
}

// 대회 결과 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('tournamentId');

    if (!tournamentId) {
      // 모든 대회 목록 조회
      const tournaments = await query({
        query: `
          SELECT 
            t.id,
            t.name,
            t.association,
            t.start_date,
            t.end_date,
            t.location,
            t.prize_money,
            t.status,
            t.description,
            t.created_at,
            t.updated_at,
            COUNT(tr.id) as results_count
          FROM tournaments t
          LEFT JOIN tournament_results tr ON t.id = tr.tournament_id
          GROUP BY t.id, t.name, t.association, t.start_date, t.end_date, 
                   t.location, t.prize_money, t.status, t.description, 
                   t.created_at, t.updated_at
          HAVING COUNT(tr.id) > 0
          ORDER BY t.created_at DESC
          LIMIT 100
        `,
        values: []
      });

      return NextResponse.json({
        success: true,
        data: tournaments,
        message: `${Array.isArray(tournaments) ? tournaments.length : 0}개의 대회를 찾았습니다.`
      });
    }

    // 특정 대회의 결과 조회 (30위까지)
    const results = await query({
      query: `
        SELECT 
          tr.id,
          tr.tournament_id,
          tr.player_id,
          COALESCE(u.name, tr.player_name) as player_name,
          tr.\`rank\`,
          tr.score,
          tr.prize_amount,
          tr.created_at,
          u.email as player_email
        FROM tournament_results tr
        LEFT JOIN users u ON tr.player_id = u.id
        WHERE tr.tournament_id = ?
        ORDER BY tr.\`rank\` ASC
      `,
      values: [tournamentId]
    });

    return NextResponse.json({
      success: true,
      data: results,
      message: `${Array.isArray(results) ? results.length : 0}명의 결과를 찾았습니다.`
    });

  } catch (error) {
    console.error('대회 결과 조회 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
}

