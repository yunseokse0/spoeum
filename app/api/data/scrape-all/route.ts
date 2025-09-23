import { NextRequest, NextResponse } from 'next/server';
import { TournamentScraper } from '@/lib/scraper/tournament-scraper';
import { GolfCourseScraper } from '@/lib/scraper/golf-course-scraper';
import { playerScraper } from '@/lib/scraper';
import { Tournament, GolfCourse, PlayerInfo } from '@/types';

export const dynamic = 'force-dynamic';

// 전체 데이터 크롤링 API
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type') || 'all'; // 'all', 'tournaments', 'golf-courses', 'players'
    const includeMock = searchParams.get('mock') === 'true';

    console.log(`전체 데이터 크롤링 시작: ${dataType}`);

    const results: any = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {},
      stats: {
        totalTime: 0,
        errors: []
      }
    };

    const startTime = Date.now();

    // 1. 대회 정보 크롤링
    if (dataType === 'all' || dataType === 'tournaments') {
      try {
        console.log('대회 정보 크롤링 시작...');
        const tournamentStartTime = Date.now();
        
        const tournamentScraper = new TournamentScraper();
        const [klpgaEvents, kpgaEvents] = await Promise.all([
          tournamentScraper.scrapeKLPGAEvents(),
          tournamentScraper.scrapeKPGAEvents()
        ]);
        
        const tournaments = [...klpgaEvents, ...kpgaEvents];
        await tournamentScraper.closeBrowser();

        results.data.tournaments = {
          klpga: klpgaEvents,
          kpga: kpgaEvents,
          all: tournaments,
          count: tournaments.length
        };

        const tournamentTime = Date.now() - tournamentStartTime;
        console.log(`대회 정보 크롤링 완료: ${tournaments.length}개 (${tournamentTime}ms)`);
        
      } catch (error) {
        console.error('대회 정보 크롤링 오류:', error);
        results.stats.errors.push({
          type: 'tournaments',
          error: error instanceof Error ? error.message : '대회 정보 크롤링 실패'
        });
        
        if (includeMock) {
          const tournamentScraper = new TournamentScraper();
          results.data.tournaments = {
            klpga: (tournamentScraper as any).getMockKLPGAEvents(),
            kpga: (tournamentScraper as any).getMockKPGAEvents(),
            all: [
              ...(tournamentScraper as any).getMockKLPGAEvents(),
              ...(tournamentScraper as any).getMockKPGAEvents()
            ],
            count: 4,
            isMock: true
          };
        }
      }
    }

    // 2. 골프장 정보 크롤링
    if (dataType === 'all' || dataType === 'golf-courses') {
      try {
        console.log('골프장 정보 크롤링 시작...');
        const golfCourseStartTime = Date.now();
        
        const golfCourseScraper = new GolfCourseScraper();
        const golfCourses = await golfCourseScraper.collectAllCourses();

        results.data.golfCourses = {
          courses: golfCourses,
          count: golfCourses.length,
          regions: [...new Set(golfCourses.map(course => course.region))],
          sources: [...new Set(golfCourses.map(course => course.source))]
        };

        const golfCourseTime = Date.now() - golfCourseStartTime;
        console.log(`골프장 정보 크롤링 완료: ${golfCourses.length}개 (${golfCourseTime}ms)`);
        
      } catch (error) {
        console.error('골프장 정보 크롤링 오류:', error);
        results.stats.errors.push({
          type: 'golf-courses',
          error: error instanceof Error ? error.message : '골프장 정보 크롤링 실패'
        });
      }
    }

    // 3. 선수 정보 크롤링 (샘플)
    if (dataType === 'all' || dataType === 'players') {
      try {
        console.log('선수 정보 크롤링 시작...');
        const playerStartTime = Date.now();
        
        // 샘플 선수 ID들로 크롤링 테스트
        const samplePlayerIds = [
          { id: 'KPGA12345', association: 'KPGA' as const },
          { id: 'KLPGA67890', association: 'KLPGA' as const },
          { id: 'KPGA11111', association: 'KPGA' as const },
          { id: 'KLPGA22222', association: 'KLPGA' as const }
        ];

        const players: PlayerInfo[] = [];
        const playerErrors: string[] = [];

        for (const { id, association } of samplePlayerIds) {
          try {
            const player = await playerScraper.searchPlayer(id, association);
            if (player) {
              players.push(player);
            }
          } catch (error) {
            playerErrors.push(`${association} ${id}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
          }
        }

        results.data.players = {
          players,
          count: players.length,
          errors: playerErrors,
          associations: [...new Set(players.map(p => p.association))]
        };

        const playerTime = Date.now() - playerStartTime;
        console.log(`선수 정보 크롤링 완료: ${players.length}개 (${playerTime}ms)`);
        
      } catch (error) {
        console.error('선수 정보 크롤링 오류:', error);
        results.stats.errors.push({
          type: 'players',
          error: error instanceof Error ? error.message : '선수 정보 크롤링 실패'
        });
      }
    }

    // 전체 실행 시간 계산
    results.stats.totalTime = Date.now() - startTime;
    results.message = `${dataType} 데이터 크롤링이 완료되었습니다.`;

    console.log(`전체 데이터 크롤링 완료: ${results.stats.totalTime}ms`);

    return NextResponse.json(results);

  } catch (error) {
    console.error('전체 데이터 크롤링 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '전체 데이터 크롤링 중 오류가 발생했습니다.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// 크롤링 상태 및 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('stats') === 'true';

    const response: any = {
      success: true,
      message: '전체 데이터 크롤링 서비스가 정상 작동 중입니다.',
      timestamp: new Date().toISOString(),
      endpoints: {
        scrapeAll: 'POST /api/data/scrape-all?type=all|tournaments|golf-courses|players&mock=true',
        status: 'GET /api/data/scrape-all?stats=true'
      }
    };

    if (includeStats) {
      // 캐시 통계
      const cacheStats = playerScraper.getCacheStats();
      
      response.stats = {
        cache: cacheStats,
        services: {
          tournaments: 'KLPGA/KPGA 대회 정보',
          golfCourses: '골프장 정보 (다중 소스)',
          players: 'KLPGA/KPGA 선수 정보'
        },
        lastUpdated: new Date().toISOString()
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('크롤링 상태 확인 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '상태 확인 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// OPTIONS 메서드 (CORS 지원)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
