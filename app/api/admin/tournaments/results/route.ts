import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database/connection';

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
    const tournamentInsert = await executeQuery(
      `
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
      [
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
    );

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
        const playerCheck = await executeQuery(
          `
            SELECT id FROM users 
            WHERE name = ? AND user_type = 'tour_pro'
            LIMIT 1
          `,
          [result.player_name]
        );

        let playerId = null;
        
        // 선수가 없으면 임시 선수 계정 생성
        if (Array.isArray(playerCheck) && playerCheck.length === 0) {
          const playerInsert = await executeQuery(
            `
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
            [
              `${result.player_name.toLowerCase().replace(/\s+/g, '')}@temp.com`,
              'temp_password_hash', // 임시 해시
              result.player_name,
              '010-0000-0000',
            ]
          );
          
          playerId = (playerInsert as any).insertId;
        } else if (Array.isArray(playerCheck) && playerCheck.length > 0) {
          playerId = (playerCheck[0] as any).id;
        }

        if (!playerId) {
          errors.push(`선수 ${result.player_name} 저장 실패`);
          continue;
        }

        // 대회 결과 저장
        await executeQuery(
          `
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
          [
            tournamentId,
            playerId,
            result.player_name,
            result.rank,
            result.score,
            result.prize_amount
          ]
        );

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
    const tournamentId = searchParams.get('tournament_id');

    // Vercel 환경에서는 Mock 데이터 반환
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      if (!tournamentId) {
        // 모든 대회 목록 Mock 데이터
        const mockTournaments = [
          {
            id: 'tournament-1',
            name: '2024 KLPGA 챔피언십',
            association: 'KLPGA',
            start_date: '2024-03-15',
            end_date: '2024-03-17',
            location: '경기도',
            prize_money: 1500000000,
            status: 'completed',
            description: 'KLPGA 메이저 대회',
            created_at: '2024-03-01T00:00:00Z',
            updated_at: '2024-03-17T00:00:00Z',
            results_count: 30
          },
          {
            id: 'tournament-2',
            name: '2024 KPGA 오픈',
            association: 'KPGA',
            start_date: '2024-04-10',
            end_date: '2024-04-13',
            location: '제주도',
            prize_money: 2000000000,
            status: 'completed',
            description: 'KPGA 정규투어 대회',
            created_at: '2024-03-15T00:00:00Z',
            updated_at: '2024-04-13T00:00:00Z',
            results_count: 25
          },
          {
            id: 'tournament-3',
            name: '2024 한화클래식',
            association: 'KLPGA',
            start_date: '2024-05-20',
            end_date: '2024-05-22',
            location: '강원도',
            prize_money: 1200000000,
            status: 'completed',
            description: 'KLPGA 투어 대회',
            created_at: '2024-04-01T00:00:00Z',
            updated_at: '2024-05-22T00:00:00Z',
            results_count: 28
          }
        ];

        return NextResponse.json({
          success: true,
          data: mockTournaments,
          message: `${mockTournaments.length}개의 대회를 찾았습니다.`
        });
      }

      // 특정 대회의 결과 Mock 데이터
      const mockResults = [
        { id: 1, tournament_id: tournamentId, player_id: null, player_name: '김효주', rank: 1, score: -14, prize_amount: 200000000, created_at: '2024-03-17T00:00:00Z', player_email: null },
        { id: 2, tournament_id: tournamentId, player_id: null, player_name: '박민지', rank: 2, score: -12, prize_amount: 120000000, created_at: '2024-03-17T00:00:00Z', player_email: null },
        { id: 3, tournament_id: tournamentId, player_id: null, player_name: '이정은', rank: 3, score: -10, prize_amount: 80000000, created_at: '2024-03-17T00:00:00Z', player_email: null },
        { id: 4, tournament_id: tournamentId, player_id: null, player_name: '최유진', rank: 4, score: -9, prize_amount: 60000000, created_at: '2024-03-17T00:00:00Z', player_email: null },
        { id: 5, tournament_id: tournamentId, player_id: null, player_name: '정소영', rank: 5, score: -8, prize_amount: 50000000, created_at: '2024-03-17T00:00:00Z', player_email: null }
      ];

      return NextResponse.json({
        success: true,
        data: mockResults,
        message: `${mockResults.length}명의 결과를 찾았습니다.`
      });
    }

    // 개발 환경에서는 실제 데이터베이스 사용
    if (!tournamentId) {
      // 모든 대회 목록 조회
      const tournaments = await executeQuery(
        `
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
        `
      );

      return NextResponse.json({
        success: true,
        data: tournaments,
        message: `${Array.isArray(tournaments) ? tournaments.length : 0}개의 대회를 찾았습니다.`
      });
    }

    // 특정 대회의 결과 조회 (30위까지)
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
          tr.created_at,
          u.email as player_email
        FROM tournament_results tr
        LEFT JOIN users u ON tr.player_id = u.id
        WHERE tr.tournament_id = ?
        ORDER BY tr.\`rank\` ASC
      `,
      [tournamentId]
    );

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

