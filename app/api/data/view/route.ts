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
        // Mock 데이터 사용
        const tournamentScraper = new TournamentScraper();
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
        // Mock 데이터 사용
        const golfCourseScraper = new GolfCourseScraper();
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

        // 페이지네이션 적용
        const paginatedPlayers = mockPlayers.slice(offset, offset + limit);

        results.data.players = {
          players: paginatedPlayers,
          count: paginatedPlayers.length,
          total: mockPlayers.length,
          errors: [],
          associations: [...new Set(mockPlayers.map(p => p.association))],
          isMock: true,
          pagination: {
            limit,
            offset,
            total: mockPlayers.length,
            hasMore: offset + limit < mockPlayers.length
          }
        };

        results.pagination.total += mockPlayers.length;
        
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
