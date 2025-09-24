import { NextRequest, NextResponse } from 'next/server';
import { GolfCourseScraper } from '@/lib/scraper/golf-course-scraper';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('골프장 데이터 테스트 시작...');
    
    const results: any = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {},
      errors: []
    };

    try {
      console.log('골프장 정보 테스트 시작...');
      const golfCourseScraper = new GolfCourseScraper();
      const golfCourses = await golfCourseScraper.collectAllCourses();

      results.data = {
        golfCourses: {
          courses: golfCourses,
          count: golfCourses.length,
          isMock: false
        }
      };
      
      console.log(`골프장 정보 테스트 성공: ${golfCourses.length}개`);
      
    } catch (error) {
      console.error('골프장 정보 테스트 실패:', error);
      results.errors.push({
        type: 'golf-courses',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined
      });
    }

    return NextResponse.json(results);
    
  } catch (error) {
    console.error('골프장 테스트 오류:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
