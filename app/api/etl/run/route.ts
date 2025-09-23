import { NextRequest, NextResponse } from 'next/server';
import { ETLController } from '@/lib/etl/etl-controller';
import { PROFESSIONAL_ETL_CONFIG, SIMPLE_ETL_CONFIG } from '@/lib/etl/etl-config';

export const dynamic = 'force-dynamic';

// 전문 ETL 프로세스 실행 API
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configType = searchParams.get('config') || 'simple';
    const dataType = searchParams.get('type') || 'all';

    console.log(`🚀 ETL 프로세스 시작 - Config: ${configType}, Type: ${dataType}`);

    // 설정 선택
    const config = configType === 'professional' ? PROFESSIONAL_ETL_CONFIG : SIMPLE_ETL_CONFIG;
    
    // ETL 컨트롤러 초기화
    const etlController = new ETLController(config);

    // ETL 실행
    let result;
    if (dataType === 'all') {
      result = await etlController.runETL();
    } else {
      result = await etlController.runETLForType(dataType as any);
    }

    console.log(`✅ ETL 프로세스 완료 - 성공: ${result.success}`);

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'ETL 프로세스가 성공적으로 완료되었습니다.' : 'ETL 프로세스 중 오류가 발생했습니다.',
      data: {
        statistics: result.statistics,
        export: result.export,
        validation: result.validation
      },
      errors: result.errors,
      warnings: result.warnings,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('ETL API 오류:', error);
    return NextResponse.json({
      success: false,
      message: 'ETL 프로세스 실행 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// ETL 상태 확인 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configType = searchParams.get('config') || 'simple';

    const config = configType === 'professional' ? PROFESSIONAL_ETL_CONFIG : SIMPLE_ETL_CONFIG;

    return NextResponse.json({
      success: true,
      message: 'ETL 시스템 상태 확인',
      config: {
        type: configType,
        sources: {
          players: config.sources.players.length,
          golfCourses: config.sources.golfCourses.length,
          tournaments: config.sources.tournaments.length
        },
        validation: config.validation,
        export: config.export,
        quality: config.quality
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('ETL 상태 확인 오류:', error);
    return NextResponse.json({
      success: false,
      message: 'ETL 상태 확인 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
