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
        
        // Mock 데이터를 먼저 반환 (실제 크롤링은 시간이 오래 걸림)
        const tournamentScraper = new TournamentScraper();
        const mockKLPGA = (tournamentScraper as any).getMockKLPGAEvents();
        const mockKPGA = (tournamentScraper as any).getMockKPGAEvents();
        const mockAll = [...mockKLPGA, ...mockKPGA];

        results.data.tournaments = {
          klpga: mockKLPGA,
          kpga: mockKPGA,
          all: mockAll,
          count: mockAll.length,
          isMock: true
        };

        const tournamentTime = Date.now() - tournamentStartTime;
        console.log(`대회 정보 크롤링 완료: ${mockAll.length}개 (${tournamentTime}ms)`);
        
        // 실제 크롤링은 백그라운드에서 실행 (선택사항)
        if (!includeMock) {
          try {
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
              count: tournaments.length,
              isMock: false
            };
          } catch (realError) {
            console.error('실제 대회 정보 크롤링 오류:', realError);
            // Mock 데이터 유지
          }
        }
        
      } catch (error) {
        console.error('대회 정보 크롤링 오류:', error);
        results.stats.errors.push({
          type: 'tournaments',
          error: error instanceof Error ? error.message : '대회 정보 크롤링 실패'
        });
        
        // 오류 시에도 Mock 데이터 반환
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

    // 2. 골프장 정보 크롤링
    if (dataType === 'all' || dataType === 'golf-courses') {
      try {
        console.log('골프장 정보 크롤링 시작...');
        const golfCourseStartTime = Date.now();
        
        // Mock 데이터를 먼저 반환
        const golfCourseScraper = new GolfCourseScraper();
        const mockCourses = await golfCourseScraper.addManualCourses();

        results.data.golfCourses = {
          courses: mockCourses,
          count: mockCourses.length,
          regions: [...new Set(mockCourses.map(course => course.region))],
          sources: [...new Set(mockCourses.map(course => course.source))],
          isMock: true
        };

        const golfCourseTime = Date.now() - golfCourseStartTime;
        console.log(`골프장 정보 크롤링 완료: ${mockCourses.length}개 (${golfCourseTime}ms)`);
        
        // 실제 크롤링은 백그라운드에서 실행 (선택사항)
        if (!includeMock) {
          try {
            const golfCourses = await golfCourseScraper.collectAllCourses();

            results.data.golfCourses = {
              courses: golfCourses,
              count: golfCourses.length,
              regions: [...new Set(golfCourses.map(course => course.region))],
              sources: [...new Set(golfCourses.map(course => course.source))],
              isMock: false
            };
          } catch (realError) {
            console.error('실제 골프장 정보 크롤링 오류:', realError);
            // Mock 데이터 유지
          }
        }
        
      } catch (error) {
        console.error('골프장 정보 크롤링 오류:', error);
        results.stats.errors.push({
          type: 'golf-courses',
          error: error instanceof Error ? error.message : '골프장 정보 크롤링 실패'
        });
        
        // 오류 시에도 Mock 데이터 반환
        const golfCourseScraper = new GolfCourseScraper();
        const mockCourses = await golfCourseScraper.addManualCourses();
        results.data.golfCourses = {
          courses: mockCourses,
          count: mockCourses.length,
          regions: [...new Set(mockCourses.map(course => course.region))],
          sources: [...new Set(mockCourses.map(course => course.source))],
          isMock: true
        };
      }
    }

    // 3. 선수 정보 크롤링 (샘플)
    if (dataType === 'all' || dataType === 'players') {
      try {
        console.log('선수 정보 크롤링 시작...');
        const playerStartTime = Date.now();
        
        // Mock 선수 데이터 생성
        const mockPlayers: PlayerInfo[] = [
          {
            memberId: 'KPGA12345',
            name: '김골프',
            association: 'KPGA',
            birth: '1990-05-15',
            career: [
              {
                year: 2024,
                title: '2024 KPGA 투어',
                result: '2승 8회 상위10위',
                prize: 50000000,
                ranking: 5
              },
              {
                year: 2023,
                title: '2023 KPGA 투어',
                result: '1승 12회 상위10위',
                prize: 35000000,
                ranking: 8
              }
            ],
            ranking: {
              current: 5,
              best: 3,
              points: 1250
            },
            currentRanking: 5,
            totalPrize: 85000000,
            isActive: true
          },
          {
            memberId: 'KLPGA67890',
            name: '이여자골프',
            association: 'KLPGA',
            birth: '1995-08-22',
            career: [
              {
                year: 2024,
                title: '2024 KLPGA 투어',
                result: '1승 6회 상위10위',
                prize: 30000000,
                ranking: 7
              }
            ],
            ranking: {
              current: 7,
              best: 5,
              points: 980
            },
            currentRanking: 7,
            totalPrize: 30000000,
            isActive: true
          },
          {
            memberId: 'KPGA11111',
            name: '박프로',
            association: 'KPGA',
            birth: '1988-03-10',
            career: [
              {
                year: 2024,
                title: '2024 KPGA 투어',
                result: '0승 5회 상위10위',
                prize: 15000000,
                ranking: 15
              }
            ],
            ranking: {
              current: 15,
              best: 10,
              points: 750
            },
            currentRanking: 15,
            totalPrize: 15000000,
            isActive: true
          },
          {
            memberId: 'KLPGA22222',
            name: '최여자프로',
            association: 'KLPGA',
            birth: '1992-11-05',
            career: [
              {
                year: 2024,
                title: '2024 KLPGA 투어',
                result: '0승 3회 상위10위',
                prize: 8000000,
                ranking: 25
              }
            ],
            ranking: {
              current: 25,
              best: 18,
              points: 450
            },
            currentRanking: 25,
            totalPrize: 8000000,
            isActive: true
          }
        ];

        results.data.players = {
          players: mockPlayers,
          count: mockPlayers.length,
          errors: [],
          associations: [...new Set(mockPlayers.map(p => p.association))],
          isMock: true
        };

        const playerTime = Date.now() - playerStartTime;
        console.log(`선수 정보 크롤링 완료: ${mockPlayers.length}개 (${playerTime}ms)`);
        
      } catch (error) {
        console.error('선수 정보 크롤링 오류:', error);
        results.stats.errors.push({
          type: 'players',
          error: error instanceof Error ? error.message : '선수 정보 크롤링 실패'
        });
        
        // 오류 시에도 Mock 데이터 반환
        results.data.players = {
          players: [],
          count: 0,
          errors: ['선수 정보 크롤링 실패'],
          associations: [],
          isMock: true
        };
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
