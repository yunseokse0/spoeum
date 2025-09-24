import { NextRequest, NextResponse } from 'next/server';
import { GolfCourseModel } from '@/lib/models/GolfCourse';
import { testConnection } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '데이터베이스 연결 실패' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const region = searchParams.get('region') || undefined;
    const city = searchParams.get('city') || undefined;
    const courseType = searchParams.get('type') as '회원제' | '대중제' | undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    
    console.log(`골프장 검색: "${query}", 지역: "${region}", 도시: "${city}", 타입: "${courseType}", 제한: ${limit}`);
    
    // 데이터베이스에서 검색
    const courses = await GolfCourseModel.search(query, region, city, courseType, limit);
    
    return NextResponse.json({
      success: true,
      data: {
        courses,
        total: courses.length,
        query,
        region,
        city,
        courseType,
        limit
      },
      message: `${courses.length}개의 골프장을 찾았습니다.`
    });
    
  } catch (error) {
    console.error('골프장 검색 오류:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '골프장 검색 중 오류가 발생했습니다.',
      data: {
        courses: [],
        total: 0,
        query: '',
        region: '',
        city: '',
        courseType: '',
        limit: 20
      }
    }, { status: 500 });
  }
}

// 지역 목록 조회
export async function POST(request: NextRequest) {
  try {
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '데이터베이스 연결 실패' },
        { status: 500 }
      );
    }

    const { action } = await request.json();
    
    if (action === 'getRegions') {
      const regions = await GolfCourseModel.getRegionStats();
      
      return NextResponse.json({
        success: true,
        data: { regions },
        message: `${regions.length}개 지역의 골프장 정보를 조회했습니다.`
      });
    }
    
    if (action === 'getTypeStats') {
      const typeStats = await GolfCourseModel.getTypeStats();
      
      return NextResponse.json({
        success: true,
        data: { typeStats },
        message: '골프장 타입별 통계를 조회했습니다.'
      });
    }
    
    if (action === 'getStats') {
      const stats = await GolfCourseModel.getStats();
      
      return NextResponse.json({
        success: true,
        data: { stats },
        message: '골프장 전체 통계를 조회했습니다.'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: '지원하지 않는 액션입니다.'
    }, { status: 400 });
    
  } catch (error) {
    console.error('골프장 통계 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '통계 정보 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}