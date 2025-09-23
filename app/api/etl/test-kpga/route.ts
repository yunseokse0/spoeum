import { NextRequest, NextResponse } from 'next/server';
import { KPGAAdvancedScraper } from '@/lib/etl/kpga-advanced-scraper';

export const dynamic = 'force-dynamic';

// KPGA 고급 크롤링 테스트 API
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 KPGA 고급 크롤링 테스트 시작...');
    
    const scraper = new KPGAAdvancedScraper();
    const players = await scraper.scrapePlayerList();

    console.log(`✅ KPGA 고급 크롤링 완료: ${players.length}명`);

    return NextResponse.json({
      success: true,
      message: `KPGA 고급 크롤링이 성공적으로 완료되었습니다.`,
      data: {
        players,
        count: players.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ KPGA 고급 크롤링 테스트 실패:', error);
    return NextResponse.json({
      success: false,
      message: 'KPGA 고급 크롤링 테스트 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// KPGA 고급 크롤링 실행 API
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testMode = searchParams.get('test') === 'true';
    
    console.log(`🚀 KPGA 고급 크롤링 실행 시작 (테스트 모드: ${testMode})...`);
    
    const scraper = new KPGAAdvancedScraper();
    const players = await scraper.scrapePlayerList();

    // 테스트 모드에서는 처음 5명만 반환
    const resultPlayers = testMode ? players.slice(0, 5) : players;

    console.log(`✅ KPGA 고급 크롤링 완료: ${resultPlayers.length}명`);

    return NextResponse.json({
      success: true,
      message: `KPGA 고급 크롤링이 성공적으로 완료되었습니다.`,
      data: {
        players: resultPlayers,
        count: resultPlayers.length,
        totalFound: players.length,
        testMode,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ KPGA 고급 크롤링 실행 실패:', error);
    return NextResponse.json({
      success: false,
      message: 'KPGA 고급 크롤링 실행 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
