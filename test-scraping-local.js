// 로컬 크롤링 테스트 스크립트
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testScraping() {
  console.log('🚀 로컬 크롤링 테스트 시작...\n');

  try {
    // 1. 대회 정보 크롤링 테스트
    console.log('📅 대회 정보 크롤링 테스트...');
    const tournamentResponse = await axios.get(`${BASE_URL}/api/data/scrape-all?dataType=tournaments&mock=false`);
    
    if (tournamentResponse.data.success) {
      console.log('✅ 대회 정보 크롤링 성공!');
      console.log(`   - KLPGA: ${tournamentResponse.data.data.tournaments.klpga?.length || 0}개`);
      console.log(`   - KPGA: ${tournamentResponse.data.data.tournaments.kpga?.length || 0}개`);
      console.log(`   - 총 대회: ${tournamentResponse.data.data.tournaments.all?.length || 0}개`);
      console.log(`   - Mock 데이터 여부: ${tournamentResponse.data.data.tournaments.isMock ? '예' : '아니오'}`);
    } else {
      console.log('❌ 대회 정보 크롤링 실패:', tournamentResponse.data.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 2. 골프장 정보 크롤링 테스트
    console.log('⛳ 골프장 정보 크롤링 테스트...');
    const golfCourseResponse = await axios.get(`${BASE_URL}/api/data/scrape-all?dataType=golf-courses&mock=false`);
    
    if (golfCourseResponse.data.success) {
      console.log('✅ 골프장 정보 크롤링 성공!');
      console.log(`   - 골프장 수: ${golfCourseResponse.data.data.golfCourses?.length || 0}개`);
      console.log(`   - Mock 데이터 여부: ${golfCourseResponse.data.data.golfCourses.isMock ? '예' : '아니오'}`);
    } else {
      console.log('❌ 골프장 정보 크롤링 실패:', golfCourseResponse.data.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 3. 선수 정보 크롤링 테스트
    console.log('👤 선수 정보 크롤링 테스트...');
    const playerResponse = await axios.get(`${BASE_URL}/api/data/scrape-all?dataType=players&mock=false`);
    
    if (playerResponse.data.success) {
      console.log('✅ 선수 정보 크롤링 성공!');
      console.log(`   - KLPGA 선수: ${playerResponse.data.data.players.klpga?.length || 0}명`);
      console.log(`   - KPGA 선수: ${playerResponse.data.data.players.kpga?.length || 0}명`);
      console.log(`   - 총 선수: ${playerResponse.data.data.players.all?.length || 0}명`);
      console.log(`   - Mock 데이터 여부: ${playerResponse.data.data.players.isMock ? '예' : '아니오'}`);
    } else {
      console.log('❌ 선수 정보 크롤링 실패:', playerResponse.data.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 4. 전체 데이터 크롤링 테스트
    console.log('🔄 전체 데이터 크롤링 테스트...');
    const allDataResponse = await axios.get(`${BASE_URL}/api/data/scrape-all?dataType=all&mock=false`);
    
    if (allDataResponse.data.success) {
      console.log('✅ 전체 데이터 크롤링 성공!');
      console.log(`   - 대회: ${allDataResponse.data.data.tournaments?.all?.length || 0}개`);
      console.log(`   - 골프장: ${allDataResponse.data.data.golfCourses?.length || 0}개`);
      console.log(`   - 선수: ${allDataResponse.data.data.players?.all?.length || 0}명`);
      console.log(`   - 총 소요 시간: ${allDataResponse.data.stats.totalTime}ms`);
    } else {
      console.log('❌ 전체 데이터 크롤링 실패:', allDataResponse.data.error);
    }

    console.log('\n🎉 크롤링 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    console.error('오류 스택:', error.stack);
  }
}

// 5초 후 테스트 실행 (서버 시작 대기)
setTimeout(testScraping, 5000);
