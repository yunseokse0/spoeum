import { NextRequest, NextResponse } from 'next/server';
import { searchGolfCourses, getAllRegions, syncGolfCoursesData } from '@/lib/data/golf-courses';
import { GolfCourseSearchResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const region = searchParams.get('region') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');
    const autoSync = searchParams.get('autoSync') === 'true';

    console.log(`골프장 검색 요청: query="${query}", region="${region}", limit=${limit}, autoSync=${autoSync}`);

    // 자동 동기화 옵션이 활성화된 경우 최신 데이터 동기화
    if (autoSync) {
      await syncGolfCoursesData();
    }

    // 빈 쿼리의 경우 빈 결과 반환
    if (!query.trim()) {
      return NextResponse.json<GolfCourseSearchResponse>({
        success: true,
        data: []
      });
    }

    // 골프장 검색 실행
    const results = searchGolfCourses(query, region);
    
    // 결과 제한
    const limitedResults = results.slice(0, limit);

    console.log(`골프장 검색 결과: ${limitedResults.length}개`);

    return NextResponse.json<GolfCourseSearchResponse>({
      success: true,
      data: limitedResults,
      autoSynced: autoSync
    });

  } catch (error) {
    console.error('골프장 검색 API 오류:', error);
    
    return NextResponse.json<GolfCourseSearchResponse>({
      success: false,
      error: error instanceof Error ? error.message : '골프장 검색 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// OPTIONS 메서드 (CORS 지원)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
