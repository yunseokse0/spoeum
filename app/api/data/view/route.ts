import { NextRequest, NextResponse } from 'next/server';
import { TournamentScraper } from '@/lib/scraper/tournament-scraper';
import { GolfCourseScraper } from '@/lib/scraper/golf-course-scraper';
import { playerScraper } from '@/lib/scraper';
import { Tournament, GolfCourse, PlayerInfo } from '@/types';

export const dynamic = 'force-dynamic';

// 크롤링된 데이터 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type') || 'all'; // 'all', 'tournaments', 'golf-courses', 'players'
    const includeMock = searchParams.get('mock') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log(`크롤링된 데이터 조회: ${dataType}`);

    const results: any = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {},
      pagination: {
        limit,
        offset,
        total: 0
      }
    };

    // 1. 대회 정보 조회
    if (dataType === 'all' || dataType === 'tournaments') {
      try {
        // 실제 데이터 크롤링
        const tournamentScraper = new TournamentScraper();
        
        try {
          const [klpgaEvents, kpgaEvents] = await Promise.all([
            tournamentScraper.scrapeKLPGAEvents(),
            tournamentScraper.scrapeKPGAEvents()
          ]);
          
          const tournaments = [...klpgaEvents, ...kpgaEvents];
          await tournamentScraper.closeBrowser();
          
          // 페이지네이션 적용
          const paginatedTournaments = tournaments.slice(offset, offset + limit);

          results.data.tournaments = {
            klpga: klpgaEvents.slice(offset, offset + limit),
            kpga: kpgaEvents.slice(offset, offset + limit),
            all: paginatedTournaments,
            count: paginatedTournaments.length,
            total: tournaments.length,
            isMock: false,
            pagination: {
              limit,
              offset,
              total: tournaments.length,
              hasMore: offset + limit < tournaments.length
            }
          };

          results.pagination.total += tournaments.length;
          
        } catch (error) {
          console.error('실제 대회 정보 크롤링 오류:', error);
          
          // 실제 크롤링 실패 시 Mock 데이터 사용
          const mockKLPGA = (tournamentScraper as any).getMockKLPGAEvents();
          const mockKPGA = (tournamentScraper as any).getMockKPGAEvents();
          const mockAll = [...mockKLPGA, ...mockKPGA];
          
          // 페이지네이션 적용
          const paginatedTournaments = mockAll.slice(offset, offset + limit);

          results.data.tournaments = {
            klpga: mockKLPGA.slice(offset, offset + limit),
            kpga: mockKPGA.slice(offset, offset + limit),
            all: paginatedTournaments,
            count: paginatedTournaments.length,
            total: mockAll.length,
            isMock: true,
            pagination: {
              limit,
              offset,
              total: mockAll.length,
              hasMore: offset + limit < mockAll.length
            }
          };

          results.pagination.total += mockAll.length;
        }
        
      } catch (error) {
        console.error('대회 정보 조회 오류:', error);
        
        // 오류 시에도 Mock 데이터 반환
        const tournamentScraper = new TournamentScraper();
        const mockKLPGA = (tournamentScraper as any).getMockKLPGAEvents();
        const mockKPGA = (tournamentScraper as any).getMockKPGAEvents();
        const mockAll = [...mockKLPGA, ...mockKPGA];
        
        results.data.tournaments = {
          klpga: mockKLPGA,
          kpga: mockKPGA,
          all: mockAll,
          count: mockAll.length,
          total: mockAll.length,
          isMock: true,
          pagination: {
            limit,
            offset,
            total: mockAll.length,
            hasMore: false
          }
        };
      }
    }

    // 2. 골프장 정보 조회
    if (dataType === 'all' || dataType === 'golf-courses') {
      try {
        // 실제 데이터 크롤링
        const golfCourseScraper = new GolfCourseScraper();
        
        try {
          const golfCourses = await golfCourseScraper.collectAllCourses();

          // 페이지네이션 적용
          const paginatedCourses = golfCourses.slice(offset, offset + limit);

          // 지역별 통계
          const regionStats = golfCourses.reduce((acc, course) => {
            acc[course.region] = (acc[course.region] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          // 소스별 통계
          const sourceStats = golfCourses.reduce((acc, course) => {
            acc[course.source] = (acc[course.source] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          results.data.golfCourses = {
            courses: paginatedCourses,
            count: paginatedCourses.length,
            total: golfCourses.length,
            regions: regionStats,
            sources: sourceStats,
            isMock: false,
            pagination: {
              limit,
              offset,
              total: golfCourses.length,
              hasMore: offset + limit < golfCourses.length
            }
          };

          results.pagination.total += golfCourses.length;
          
        } catch (error) {
          console.error('실제 골프장 정보 크롤링 오류:', error);
          
          // 실제 크롤링 실패 시 Mock 데이터 사용
          const golfCourses = await golfCourseScraper.addManualCourses();

          // 페이지네이션 적용
          const paginatedCourses = golfCourses.slice(offset, offset + limit);

          // 지역별 통계
          const regionStats = golfCourses.reduce((acc, course) => {
            acc[course.region] = (acc[course.region] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          // 소스별 통계
          const sourceStats = golfCourses.reduce((acc, course) => {
            acc[course.source] = (acc[course.source] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          results.data.golfCourses = {
            courses: paginatedCourses,
            count: paginatedCourses.length,
            total: golfCourses.length,
            regions: regionStats,
            sources: sourceStats,
            isMock: true,
            pagination: {
              limit,
              offset,
              total: golfCourses.length,
              hasMore: offset + limit < golfCourses.length
            }
          };

          results.pagination.total += golfCourses.length;
        }
        
      } catch (error) {
        console.error('골프장 정보 조회 오류:', error);
        
        // 오류 시에도 Mock 데이터 반환
        const golfCourseScraper = new GolfCourseScraper();
        const golfCourses = await golfCourseScraper.addManualCourses();
        
        results.data.golfCourses = {
          courses: golfCourses,
          count: golfCourses.length,
          total: golfCourses.length,
          regions: {},
          sources: {},
          isMock: true,
          pagination: {
            limit,
            offset,
            total: golfCourses.length,
            hasMore: false
          }
        };
      }
    }

    // 3. 선수 정보 조회 (샘플)
    if (dataType === 'all' || dataType === 'players') {
      try {
        // 실제 선수 정보 크롤링
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

        // 페이지네이션 적용
        const paginatedPlayers = players.slice(offset, offset + limit);

        results.data.players = {
          players: paginatedPlayers,
          count: paginatedPlayers.length,
          total: players.length,
          errors: playerErrors,
          associations: [...new Set(players.map(p => p.association))],
          isMock: false,
          pagination: {
            limit,
            offset,
            total: players.length,
            hasMore: offset + limit < players.length
          }
        };

        results.pagination.total += players.length;
        
        // 실제 크롤링 결과가 없으면 Mock 데이터로 fallback
        if (players.length === 0) {
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
            }
          ];

          // 페이지네이션 적용
          const paginatedMockPlayers = mockPlayers.slice(offset, offset + limit);

          results.data.players = {
            players: paginatedMockPlayers,
            count: paginatedMockPlayers.length,
            total: mockPlayers.length,
            errors: playerErrors,
            associations: [...new Set(mockPlayers.map(p => p.association))],
            isMock: true,
            pagination: {
              limit,
              offset,
              total: mockPlayers.length,
              hasMore: offset + limit < mockPlayers.length
            }
          };

          results.pagination.total = mockPlayers.length;
        }
        
      } catch (error) {
        console.error('선수 정보 조회 오류:', error);
        
        // 오류 시에도 Mock 데이터 반환
        results.data.players = {
          players: [],
          count: 0,
          total: 0,
          errors: ['선수 정보 조회 실패'],
          associations: [],
          isMock: true,
          pagination: {
            limit,
            offset,
            total: 0,
            hasMore: false
          }
        };
      }
    }

    // 전체 통계
    results.summary = {
      totalDataTypes: Object.keys(results.data).length,
      totalRecords: results.pagination.total,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(results);

  } catch (error) {
    console.error('크롤링된 데이터 조회 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '데이터 조회 중 오류가 발생했습니다.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// 특정 데이터 타입의 상세 정보 조회
export async function POST(request: NextRequest) {
  try {
    const { dataType, filters } = await request.json();

    const results: any = {
      success: true,
      timestamp: new Date().toISOString(),
      dataType,
      data: {}
    };

    switch (dataType) {
      case 'tournaments':
        try {
          const tournamentScraper = new TournamentScraper();
          const [klpgaEvents, kpgaEvents] = await Promise.all([
            tournamentScraper.scrapeKLPGAEvents(),
            tournamentScraper.scrapeKPGAEvents()
          ]);
          
          let tournaments = [...klpgaEvents, ...kpgaEvents];
          
          // 필터 적용
          if (filters?.association) {
            tournaments = tournaments.filter(t => t.organizer === filters.association);
          }
          if (filters?.category) {
            tournaments = tournaments.filter(t => t.category === filters.category);
          }
          if (filters?.year) {
            tournaments = tournaments.filter(t => 
              t.startDate.getFullYear() === parseInt(filters.year)
            );
          }

          results.data = {
            tournaments,
            count: tournaments.length,
            filters: filters || {}
          };

          await tournamentScraper.closeBrowser();
        } catch (error) {
          console.error('대회 정보 상세 조회 오류:', error);
          throw error;
        }
        break;

      case 'golf-courses':
        try {
          const golfCourseScraper = new GolfCourseScraper();
          let golfCourses = await golfCourseScraper.collectAllCourses();
          
          // 필터 적용
          if (filters?.region) {
            golfCourses = golfCourses.filter(c => c.region === filters.region);
          }
          if (filters?.city) {
            golfCourses = golfCourses.filter(c => c.city === filters.city);
          }
          if (filters?.source) {
            golfCourses = golfCourses.filter(c => c.source === filters.source);
          }

          results.data = {
            golfCourses,
            count: golfCourses.length,
            filters: filters || {}
          };
        } catch (error) {
          console.error('골프장 정보 상세 조회 오류:', error);
          throw error;
        }
        break;

      default:
        return NextResponse.json({
          success: false,
          error: '지원하지 않는 데이터 타입입니다.'
        }, { status: 400 });
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('상세 데이터 조회 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '상세 데이터 조회 중 오류가 발생했습니다.'
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
