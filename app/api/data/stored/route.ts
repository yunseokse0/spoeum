import { NextRequest, NextResponse } from 'next/server';
import { dataStorage } from '@/lib/data-storage';

export const dynamic = 'force-dynamic';

// 저장된 데이터 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type') || 'all'; // 'all', 'tournaments', 'golf-courses', 'players'
    const includeMetadata = searchParams.get('metadata') === 'true';

    console.log(`저장된 데이터 조회: ${dataType}`);

    if (dataType === 'all') {
      const data = await dataStorage.loadData();
      
      if (!data) {
        return NextResponse.json({
          success: false,
          message: '저장된 데이터가 없습니다. 먼저 크롤링을 실행해주세요.',
          data: null
        });
      }

      const response: any = {
        success: true,
        data: {
          tournaments: data.tournaments,
          golfCourses: data.golfCourses,
          players: data.players
        }
      };

      if (includeMetadata) {
        response.metadata = {
          lastUpdated: data.lastUpdated,
          version: data.version
        };
      }

      return NextResponse.json(response);
    } else {
      const data = await dataStorage.loadDataType(dataType as any);
      
      if (!data) {
        return NextResponse.json({
          success: false,
          message: `${dataType} 데이터가 없습니다. 먼저 크롤링을 실행해주세요.`,
          data: null
        });
      }

      const response: any = {
        success: true,
        data: data
      };

      if (includeMetadata) {
        const allData = await dataStorage.loadData();
        response.metadata = {
          lastUpdated: allData?.lastUpdated,
          version: allData?.version
        };
      }

      return NextResponse.json(response);
    }

  } catch (error) {
    console.error('저장된 데이터 조회 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '데이터 조회 중 오류가 발생했습니다.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// 저장된 데이터 삭제 API
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm');
    
    if (confirm !== 'true') {
      return NextResponse.json({
        success: false,
        message: '데이터 삭제를 확인하려면 ?confirm=true를 추가해주세요.'
      }, { status: 400 });
    }

    await dataStorage.clearData();
    
    return NextResponse.json({
      success: true,
      message: '저장된 데이터가 삭제되었습니다.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('데이터 삭제 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '데이터 삭제 중 오류가 발생했습니다.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// 데이터 백업 API
export async function POST(request: NextRequest) {
  try {
    const backupFile = await dataStorage.backupData();
    
    return NextResponse.json({
      success: true,
      message: '데이터 백업이 완료되었습니다.',
      backupFile: backupFile,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('데이터 백업 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '데이터 백업 중 오류가 발생했습니다.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
