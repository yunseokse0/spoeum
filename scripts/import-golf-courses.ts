import { GolfCourseModel } from '@/lib/models/GolfCourse';
import { CSVParser } from '@/lib/utils/csv-parser';
import { testConnection } from '@/lib/database/connection';
import path from 'path';

async function importGolfCourses() {
  try {
    console.log('🚀 골프장 데이터 가져오기 시작...');
    
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ 데이터베이스 연결 실패');
      process.exit(1);
    }
    
    // CSV 파일 경로
    const csvPath = path.join(process.cwd(), 'golfcourse.csv');
    
    // CSV 데이터 파싱
    console.log('📄 CSV 파일 파싱 중...');
    const csvData = CSVParser.parseGolfCourseCSV(csvPath);
    console.log(`✅ ${csvData.length}개 골프장 데이터 파싱 완료`);
    
    // 데이터베이스에 삽입
    console.log('💾 데이터베이스에 삽입 중...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const courseData of csvData) {
      try {
        await GolfCourseModel.create({
          name: courseData.name,
          region: courseData.region,
          city: courseData.region, // CSV에서 city 정보가 없으므로 region 사용
          address: courseData.address,
          total_area: courseData.totalArea,
          holes: courseData.holes,
          course_type: courseData.type,
          owner: courseData.owner
        });
        successCount++;
      } catch (error) {
        console.error(`❌ 골프장 삽입 실패: ${courseData.name}`, error);
        errorCount++;
      }
    }
    
    console.log(`✅ 골프장 데이터 가져오기 완료!`);
    console.log(`   - 성공: ${successCount}개`);
    console.log(`   - 실패: ${errorCount}개`);
    
    // 통계 출력
    const stats = await GolfCourseModel.getStats();
    console.log(`📊 데이터베이스 통계:`);
    console.log(`   - 총 골프장 수: ${stats.total}개`);
    console.log(`   - 평균 홀 수: ${stats.averageHoles}개`);
    console.log(`   - 평균 면적: ${Math.round(stats.averageArea)}㎡`);
    console.log(`   - 지역 수: ${stats.regionCount}개`);
    
  } catch (error) {
    console.error('❌ 골프장 데이터 가져오기 실패:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  importGolfCourses();
}

export { importGolfCourses };
