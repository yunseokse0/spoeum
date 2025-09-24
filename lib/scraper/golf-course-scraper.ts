import { GolfCourse } from '@/types';
import { CSVParser, GolfCourseData } from '@/lib/utils/csv-parser';
import path from 'path';

// 불필요한 인터페이스 제거 - CSV 데이터만 사용

export interface ScrapedGolfCourse {
  name: string;
  region: string;
  city: string;
  address: string;
  phone?: string;
  website?: string;
  source: string;
}

export class GolfCourseScraper {
  // CSV 데이터만 사용하므로 브라우저 관련 코드 제거

  // 웹 스크래핑 관련 메서드들 제거 - CSV 데이터만 사용

  // 지역 정보 파싱 로직 (CSV 데이터용)
  private parseRegion(regionText: string): { region: string; city: string } {
    if (!regionText) return { region: '미분류', city: '미분류' };

    const regionMap: { [key: string]: string } = {
      '서울': '서울',
      '경기': '경기',
      '인천': '인천',
      '강원': '강원',
      '충북': '충북',
      '충남': '충남',
      '전북': '전북',
      '전남': '전남',
      '경북': '경북',
      '경남': '경남',
      '제주': '제주',
      '부산': '경남',
      '대구': '경북',
      '광주': '전남',
      '대전': '충남',
      '울산': '경남'
    };

    for (const [region, mappedRegion] of Object.entries(regionMap)) {
      if (regionText.includes(region)) {
        return { 
          region: mappedRegion, 
          city: region 
        };
      }
    }

    return { region: '미분류', city: '미분류' };
  }

  // 수동 골프장 추가 메서드 제거 - CSV 데이터만 사용

  // 데이터베이스에서 골프장 데이터 로드
  async loadFromDatabase(): Promise<ScrapedGolfCourse[]> {
    try {
      console.log('데이터베이스에서 골프장 데이터 로드 시작...');
      
      // API 호출로 데이터베이스에서 골프장 데이터 가져오기
      const response = await fetch('/api/golf-courses?limit=1000');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '골프장 데이터 로드 실패');
      }
      
      const courses: ScrapedGolfCourse[] = data.data.map((course: any) => ({
        name: course.name,
        region: course.region,
        city: course.city,
        address: course.address || '주소 정보 없음',
        phone: course.phone,
        website: course.website,
        source: '데이터베이스'
      }));
      
      console.log(`데이터베이스에서 ${courses.length}개 골프장 데이터 로드 완료`);
      return courses;
      
    } catch (error) {
      console.error('데이터베이스 데이터 로드 오류:', error);
      return [];
    }
  }

  // 주소에서 도시명 추출
  private extractCityFromAddress(address: string): string {
    if (!address) return '미상';
    
    // 시/군/구 단위로 도시명 추출
    const cityPatterns = [
      /([가-힣]+시)/g,
      /([가-힣]+군)/g,
      /([가-힣]+구)/g,
      /([가-힣]+동)/g
    ];
    
    for (const pattern of cityPatterns) {
      const match = address.match(pattern);
      if (match && match[0]) {
        return match[0];
      }
    }
    
    return '미상';
  }

  // 전체 골프장 수집 (데이터베이스 데이터 사용)
  async collectAllCourses(): Promise<ScrapedGolfCourse[]> {
    try {
      console.log('골프장 정보 수집 시작...');
      
      // 데이터베이스에서 데이터 로드
      const dbCourses = await this.loadFromDatabase();
      
      if (dbCourses.length > 0) {
        console.log(`데이터베이스 데이터 사용: ${dbCourses.length}개 골프장`);
        return dbCourses;
      }
      
      console.log('데이터베이스에 골프장 데이터가 없습니다.');
      return [];
      
    } catch (error) {
      console.error('골프장 정보 수집 오류:', error);
      return [];
    }
  }

  // 프렌즈 스크린 관련 메서드들 제거 - CSV 데이터만 사용
}
