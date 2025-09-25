import { NextRequest, NextResponse } from 'next/server';
import { CSVParser } from '@/lib/utils/csv-parser';
import path from 'path';

export const dynamic = 'force-dynamic';

// CSV 데이터를 메모리에 캐시
let cachedGolfCourses: any[] = null;

async function getGolfCourses() {
  if (cachedGolfCourses) {
    return cachedGolfCourses;
  }

  try {
    const csvPath = path.join(process.cwd(), 'golfcourse.csv');
    const csvData = CSVParser.parseGolfCourseCSV(csvPath);
    
    // CSV 데이터를 API 형식에 맞게 변환
    cachedGolfCourses = csvData.map(course => ({
      name: course.name,
      region: course.region,
      city: course.address.split(' ')[1] || course.region,
      address: course.address,
      phone: null,
      website: null,
      source: 'CSV 데이터',
      totalArea: course.totalArea,
      holes: course.holes,
      type: course.type
    }));
    
    return cachedGolfCourses;
  } catch (error) {
    console.error('CSV 파일 읽기 오류:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    
    console.log(`골프장 검색: "${query}", 제한: ${limit}`);
    
    // CSV에서 골프장 데이터 가져오기
    const allCourses = await getGolfCourses();
    
    // 검색 필터링
    let filteredCourses = allCourses;
    if (query.trim()) {
      filteredCourses = allCourses.filter(course => 
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.region.toLowerCase().includes(query.toLowerCase()) ||
        course.city.toLowerCase().includes(query.toLowerCase()) ||
        course.address.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // 제한 적용
    const courses = filteredCourses.slice(0, limit);
    
    console.log(`검색 결과: ${courses.length}개 (전체: ${allCourses.length}개)`);
    
    return NextResponse.json({
      success: true,
      data: {
        courses,
        total: courses.length,
        query,
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
        limit: 20
      }
    }, { status: 500 });
  }
}

// 지역 목록 조회
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    const allCourses = await getGolfCourses();
    
    if (action === 'getRegions') {
      // 지역별 통계 계산
      const regionStats = allCourses.reduce((acc, course) => {
        const region = course.region;
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const regions = Object.entries(regionStats).map(([region, count]) => ({
        region,
        count
      })).sort((a, b) => b.count - a.count);
      
      return NextResponse.json({
        success: true,
        data: { regions },
        message: `${regions.length}개 지역의 골프장 정보를 조회했습니다.`
      });
    }
    
    if (action === 'getTypeStats') {
      // 타입별 통계 계산
      const typeStats = allCourses.reduce((acc, course) => {
        const type = course.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const typeStatsArray = Object.entries(typeStats).map(([type, count]) => ({
        course_type: type,
        count
      })).sort((a, b) => b.count - a.count);
      
      return NextResponse.json({
        success: true,
        data: { typeStats: typeStatsArray },
        message: '골프장 타입별 통계를 조회했습니다.'
      });
    }
    
    if (action === 'getStats') {
      // 전체 통계 계산
      const totalCount = allCourses.length;
      const avgHoles = allCourses.reduce((sum, course) => sum + (course.holes || 0), 0) / totalCount;
      const avgTotalArea = allCourses.reduce((sum, course) => sum + (course.totalArea || 0), 0) / totalCount;
      
      const stats = {
        totalCount,
        avgHoles: Math.round(avgHoles),
        avgTotalArea: Math.round(avgTotalArea)
      };
      
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
      error: error instanceof Error ? error.message : '골프장 통계 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}