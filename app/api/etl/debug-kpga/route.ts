import { NextRequest, NextResponse } from 'next/server';
import { KPGADebugScraper } from '@/lib/etl/kpga-debug-scraper';

export const dynamic = 'force-dynamic';

// KPGA 사이트 구조 디버깅 API
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 KPGA 사이트 구조 디버깅 시작...');
    
    const scraper = new KPGADebugScraper();
    const debugResult = await scraper.debugKPGAStructure();

    console.log('✅ KPGA 사이트 구조 디버깅 완료');

    return NextResponse.json({
      success: debugResult.success,
      message: debugResult.success 
        ? 'KPGA 사이트 구조 디버깅이 완료되었습니다.' 
        : 'KPGA 사이트 구조 디버깅 중 오류가 발생했습니다.',
      data: debugResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ KPGA 사이트 구조 디버깅 실패:', error);
    return NextResponse.json({
      success: false,
      message: 'KPGA 사이트 구조 디버깅 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// KPGA 선수 데이터 크롤링 (디버깅 기반)
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 KPGA 선수 데이터 크롤링 (디버깅 기반) 시작...');
    
    const scraper = new KPGADebugScraper();
    const players = await scraper.scrapePlayersWithDebug();

    console.log(`✅ KPGA 선수 데이터 크롤링 완료: ${players.length}명`);

    return NextResponse.json({
      success: true,
      message: `KPGA 선수 데이터 크롤링이 완료되었습니다.`,
      data: {
        players,
        count: players.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ KPGA 선수 데이터 크롤링 실패:', error);
    return NextResponse.json({
      success: false,
      message: 'KPGA 선수 데이터 크롤링 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
