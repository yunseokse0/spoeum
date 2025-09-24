import { NextRequest, NextResponse } from 'next/server';
import { GolfCourseScraper } from '@/lib/scraper/golf-course-scraper';
import { CSVParser } from '@/lib/utils/csv-parser';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('CSV 골프장 데이터 테스트 시작...');
    
    const results: any = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {},
      errors: []
    };

    // 1. CSV 파일 직접 파싱 테스트
    try {
      console.log('CSV 파일 직접 파싱 테스트...');
      const csvPath = path.join(process.cwd(), 'golfcourse.csv');
      const csvData = CSVParser.parseGolfCourseCSV(csvPath);
      
      results.data.csvDirect = {
        totalCount: csvData.length,
        sampleData: csvData.slice(0, 5), // 처음 5개만 샘플로
        regions: [...new Set(csvData.map(c => c.region))].sort(),
        types: [...new Set(csvData.map(c => c.type))],
        isSuccess: true
      };
      
      console.log(`CSV 직접 파싱 성공: ${csvData.length}개 골프장`);
    } catch (error) {
      console.error('CSV 직접 파싱 실패:', error);
      results.errors.push({
        type: 'csv_direct',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }

    // 2. 골프장 스크래퍼를 통한 CSV 데이터 로드 테스트
    try {
      console.log('골프장 스크래퍼를 통한 CSV 데이터 로드 테스트...');
      const scraper = new GolfCourseScraper();
      const scrapedCourses = await scraper.collectAllCourses();
      
      results.data.scraperLoad = {
        totalCount: scrapedCourses.length,
        sampleData: scrapedCourses.slice(0, 5), // 처음 5개만 샘플로
        regions: [...new Set(scrapedCourses.map(c => c.region))].sort(),
        sources: [...new Set(scrapedCourses.map(c => c.source))],
        isSuccess: true
      };
      
      console.log(`골프장 스크래퍼 CSV 로드 성공: ${scrapedCourses.length}개 골프장`);
    } catch (error) {
      console.error('골프장 스크래퍼 CSV 로드 실패:', error);
      results.errors.push({
        type: 'scraper_load',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }

    // 3. 지역별 통계
    try {
      const csvPath = path.join(process.cwd(), 'golfcourse.csv');
      const csvData = CSVParser.parseGolfCourseCSV(csvPath);
      
      const regionStats = csvData.reduce((acc, course) => {
        acc[course.region] = (acc[course.region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const typeStats = csvData.reduce((acc, course) => {
        acc[course.type] = (acc[course.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      results.data.statistics = {
        regionStats,
        typeStats,
        totalCourses: csvData.length,
        averageHoles: Math.round(csvData.reduce((sum, c) => sum + c.holes, 0) / csvData.length),
        averageArea: Math.round(csvData.reduce((sum, c) => sum + c.totalArea, 0) / csvData.length)
      };
    } catch (error) {
      console.error('통계 생성 실패:', error);
      results.errors.push({
        type: 'statistics',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }

    return NextResponse.json(results);
    
  } catch (error) {
    console.error('CSV 골프장 데이터 테스트 오류:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
