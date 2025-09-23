import { NextRequest, NextResponse } from 'next/server';
import { TournamentScraper } from '@/lib/scraper/tournament-scraper';
import { GolfCourseScraper } from '@/lib/scraper/golf-course-scraper';
import { playerScraper } from '@/lib/scraper';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('type') || 'tournaments';
    
    console.log(`테스트 크롤링 시작: ${testType}`);
    
    const results: any = {
      success: true,
      timestamp: new Date().toISOString(),
      testType,
      data: {},
      errors: []
    };

    if (testType === 'tournaments') {
      try {
        console.log('대회 정보 크롤링 테스트 시작...');
        const tournamentScraper = new TournamentScraper();
        
        const [klpgaEvents, kpgaEvents] = await Promise.all([
          tournamentScraper.scrapeKLPGAEvents(),
          tournamentScraper.scrapeKPGAEvents()
        ]);
        
        const tournaments = [...klpgaEvents, ...kpgaEvents];
        await tournamentScraper.closeBrowser();

        results.data = {
          tournaments: {
            klpga: klpgaEvents,
            kpga: kpgaEvents,
            all: tournaments,
            count: tournaments.length,
            isMock: false
          }
        };
        
        console.log(`대회 정보 크롤링 성공: ${tournaments.length}개`);
        
      } catch (error) {
        console.error('대회 정보 크롤링 실패:', error);
        results.errors.push({
          type: 'tournaments',
          error: error instanceof Error ? error.message : '알 수 없는 오류',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        // Mock 데이터로 fallback
        const tournamentScraper = new TournamentScraper();
        const mockKLPGA = (tournamentScraper as any).getMockKLPGAEvents();
        const mockKPGA = (tournamentScraper as any).getMockKPGAEvents();
        const mockAll = [...mockKLPGA, ...mockKPGA];

        results.data = {
          tournaments: {
            klpga: mockKLPGA,
            kpga: mockKPGA,
            all: mockAll,
            count: mockAll.length,
            isMock: true
          }
        };
      }
    }

    if (testType === 'golf-courses') {
      try {
        console.log('골프장 정보 크롤링 테스트 시작...');
        const golfCourseScraper = new GolfCourseScraper();
        const golfCourses = await golfCourseScraper.collectAllCourses();

        results.data = {
          golfCourses: {
            courses: golfCourses,
            count: golfCourses.length,
            isMock: false
          }
        };
        
        console.log(`골프장 정보 크롤링 성공: ${golfCourses.length}개`);
        
      } catch (error) {
        console.error('골프장 정보 크롤링 실패:', error);
        results.errors.push({
          type: 'golf-courses',
          error: error instanceof Error ? error.message : '알 수 없는 오류',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        // Mock 데이터로 fallback
        const golfCourseScraper = new GolfCourseScraper();
        const mockCourses = await golfCourseScraper.addManualCourses();

        results.data = {
          golfCourses: {
            courses: mockCourses,
            count: mockCourses.length,
            isMock: true
          }
        };
      }
    }

    if (testType === 'players') {
      try {
        console.log('선수 정보 크롤링 테스트 시작...');
        const samplePlayerIds = [
          { id: 'KPGA12345', association: 'KPGA' as const },
          { id: 'KLPGA67890', association: 'KLPGA' as const }
        ];

        const players: any[] = [];
        const playerErrors: string[] = [];

        for (const { id, association } of samplePlayerIds) {
          try {
            console.log(`${association} ${id} 크롤링 시도...`);
            const player = await playerScraper.searchPlayer(id, association);
            if (player) {
              players.push(player);
              console.log(`${association} ${id} 크롤링 성공`);
            } else {
              console.log(`${association} ${id} 크롤링 결과 없음`);
            }
          } catch (error) {
            const errorMsg = `${association} ${id}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
            console.error(errorMsg);
            playerErrors.push(errorMsg);
          }
        }

        results.data = {
          players: {
            players,
            count: players.length,
            errors: playerErrors,
            isMock: false
          }
        };
        
        console.log(`선수 정보 크롤링 완료: ${players.length}개 성공, ${playerErrors.length}개 실패`);
        
      } catch (error) {
        console.error('선수 정보 크롤링 실패:', error);
        results.errors.push({
          type: 'players',
          error: error instanceof Error ? error.message : '알 수 없는 오류',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
    }

    return NextResponse.json(results);
    
  } catch (error) {
    console.error('테스트 크롤링 오류:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
