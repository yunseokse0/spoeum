import { NextRequest, NextResponse } from 'next/server';
import { TournamentScraper } from '@/lib/scraper/tournament-scraper';
import { Tournament } from '@/types';

export const dynamic = 'force-dynamic';

// 대회 정보 크롤링 API
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const association = searchParams.get('association'); // 'klpga', 'kpga', 'all'

    console.log(`대회 정보 크롤링 요청: ${association || 'all'}`);

    const scraper = new TournamentScraper();
    let tournaments: Tournament[] = [];

    if (!association || association === 'all') {
      // 모든 협회 대회 크롤링
      const [klpgaEvents, kpgaEvents] = await Promise.all([
        scraper.scrapeKLPGAEvents(),
        scraper.scrapeKPGAEvents()
      ]);
      tournaments = [...klpgaEvents, ...kpgaEvents];
    } else if (association === 'klpga') {
      tournaments = await scraper.scrapeKLPGAEvents();
    } else if (association === 'kpga') {
      tournaments = await scraper.scrapeKPGAEvents();
    } else {
      return NextResponse.json({
        success: false,
        error: '지원하지 않는 협회입니다. klpga, kpga, 또는 all을 선택해주세요.'
      }, { status: 400 });
    }

    // 브라우저 정리
    await scraper.closeBrowser();

    console.log(`대회 정보 크롤링 완료: ${tournaments.length}개`);

    return NextResponse.json({
      success: true,
      data: tournaments,
      message: `${association || 'all'} 대회 정보를 성공적으로 크롤링했습니다.`,
      count: tournaments.length
    });

  } catch (error) {
    console.error('대회 정보 크롤링 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '대회 정보 크롤링 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// 크롤링 상태 확인
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeMock = searchParams.get('mock') === 'true';

    const response: any = {
      success: true,
      message: '대회 크롤링 서비스가 정상 작동 중입니다.',
      endpoints: {
        scrape: 'POST /api/tournaments/scrape?association=klpga|kpga|all',
        status: 'GET /api/tournaments/scrape'
      }
    };

    if (includeMock) {
      const scraper = new TournamentScraper();
      response.mockData = {
        klpga: (scraper as any).getMockKLPGAEvents(),
        kpga: (scraper as any).getMockKPGAEvents()
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('대회 크롤링 상태 확인 오류:', error);
    
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
