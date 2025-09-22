import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import { GolfCourse } from '@/types';

export interface GolfCourseSource {
  name: string;
  url: string;
  selector: {
    container: string;
    name: string;
    region?: string;
    address?: string;
    phone?: string;
    website?: string;
  };
}

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
  private browser: Browser | null = null;
  private page: Page | null = null;

  // 골프장 데이터 소스 정의
  private sources: GolfCourseSource[] = [
    {
      name: 'golf.co.kr',
      url: 'https://www.golf.co.kr/course/list',
      selector: {
        container: '.course-item',
        name: '.course-name',
        region: '.course-region',
        address: '.course-address',
        phone: '.course-phone'
      }
    },
    {
      name: 'golfzon.com',
      url: 'https://www.golfzon.com/course/search',
      selector: {
        container: '.course-list-item',
        name: '.course-title',
        region: '.course-location',
        address: '.course-address'
      }
    }
  ];

  async initBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    this.page = await this.browser.newPage();
    this.page.setDefaultNavigationTimeout(60000);
    
    // User-Agent 설정
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  async scrapeFromSource(source: GolfCourseSource): Promise<ScrapedGolfCourse[]> {
    try {
      await this.initBrowser();
      if (!this.page) throw new Error("Page not initialized");

      console.log(`골프장 정보 수집 시작: ${source.name}`);
      
      await this.page.goto(source.url, { waitUntil: 'domcontentloaded' });
      
      // 페이지 로딩 대기
      await this.page.waitForTimeout(3000);
      
      // 동적 컨텐츠 로딩 대기
      try {
        await this.page.waitForSelector(source.selector.container, { timeout: 10000 });
      } catch (error) {
        console.log(`컨테이너 셀렉터를 찾을 수 없음: ${source.selector.container}`);
      }

      const html = await this.page.content();
      const $ = cheerio.load(html);

      const courses: ScrapedGolfCourse[] = [];

      $(source.selector.container).each((index, element) => {
        try {
          const name = $(element).find(source.selector.name).text().trim();
          const region = $(element).find(source.selector.region || '').text().trim();
          const address = $(element).find(source.selector.address || '').text().trim();
          const phone = $(element).find(source.selector.phone || '').text().trim();
          const website = $(element).find(source.selector.website || '').attr('href');

          if (name && name.length > 0) {
            // 지역 정보 파싱
            const { region: parsedRegion, city } = this.parseRegion(region);
            
            courses.push({
              name: this.cleanName(name),
              region: parsedRegion,
              city: city,
              address: address || '주소 정보 없음',
              phone: phone || undefined,
              website: website || undefined,
              source: source.name
            });
          }
        } catch (error) {
          console.error(`골프장 정보 파싱 오류 (${index}):`, error);
        }
      });

      console.log(`${source.name}에서 ${courses.length}개 골프장 수집 완료`);
      return courses;

    } catch (error) {
      console.error(`${source.name} 스크래핑 오류:`, error);
      return [];
    }
  }

  async scrapeAllSources(): Promise<ScrapedGolfCourse[]> {
    const allCourses: ScrapedGolfCourse[] = [];

    for (const source of this.sources) {
      try {
        const courses = await this.scrapeFromSource(source);
        allCourses.push(...courses);
        
        // 소스 간 요청 지연
        await this.page?.waitForTimeout(2000);
      } catch (error) {
        console.error(`소스 ${source.name} 처리 오류:`, error);
      }
    }

    return this.deduplicateCourses(allCourses);
  }

  private parseRegion(regionText: string): { region: string; city: string } {
    if (!regionText) return { region: '미분류', city: '미분류' };

    // 지역 정보 파싱 로직
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

    // 지역명 추출
    for (const [region, mappedRegion] of Object.entries(regionMap)) {
      if (regionText.includes(region)) {
        return { 
          region: mappedRegion, 
          city: region 
        };
      }
    }

    // 기본값
    return { region: '미분류', city: '미분류' };
  }

  private cleanName(name: string): string {
    // 골프장 이름 정리
    return name
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s가-힣]/g, '')
      .trim();
  }

  private deduplicateCourses(courses: ScrapedGolfCourse[]): ScrapedGolfCourse[] {
    const uniqueCourses = new Map<string, ScrapedGolfCourse>();

    courses.forEach(course => {
      const key = course.name.toLowerCase().trim();
      
      if (!uniqueCourses.has(key)) {
        uniqueCourses.set(key, course);
      } else {
        // 기존 정보보다 더 상세한 정보로 업데이트
        const existing = uniqueCourses.get(key)!;
        if (course.address !== '주소 정보 없음' && existing.address === '주소 정보 없음') {
          uniqueCourses.set(key, course);
        }
      }
    });

    return Array.from(uniqueCourses.values());
  }

  // 수동으로 골프장 정보 추가 (개발/테스트용)
  async addManualCourses(): Promise<ScrapedGolfCourse[]> {
    const manualCourses: ScrapedGolfCourse[] = [
      {
        name: '서울골프클럽',
        region: '서울',
        city: '서울시',
        address: '서울시 강남구 테헤란로 123',
        phone: '02-1234-5678',
        website: 'https://seoulgc.co.kr',
        source: 'manual'
      },
      {
        name: '경기골프리조트',
        region: '경기',
        city: '성남시',
        address: '경기도 성남시 분당구 판교로 456',
        phone: '031-2345-6789',
        website: 'https://ggr.co.kr',
        source: 'manual'
      },
      {
        name: '제주 블루원',
        region: '제주',
        city: '서귀포시',
        address: '제주특별자치도 서귀포시 중문동 303',
        phone: '064-6789-0123',
        website: 'https://jejublueone.co.kr',
        source: 'manual'
      },
      {
        name: '제주 핀크스',
        region: '제주',
        city: '제주시',
        address: '제주특별자치도 제주시 애월읍 404',
        phone: '064-7890-1234',
        website: 'https://jejupinx.co.kr',
        source: 'manual'
      },
      {
        name: '부산 골프클럽',
        region: '경남',
        city: '부산시',
        address: '부산광역시 해운대구 해운대로 606',
        phone: '051-9012-3456',
        website: 'https://busangc.co.kr',
        source: 'manual'
      }
    ];

    return manualCourses;
  }

  // 전체 골프장 수집 (웹 스크래핑 + 수동 데이터)
  async collectAllCourses(): Promise<ScrapedGolfCourse[]> {
    try {
      console.log('골프장 정보 수집 시작...');
      
      // 웹 스크래핑
      const scrapedCourses = await this.scrapeAllSources();
      
      // 수동 데이터 추가
      const manualCourses = await this.addManualCourses();
      
      // 통합 및 중복 제거
      const allCourses = [...scrapedCourses, ...manualCourses];
      const finalCourses = this.deduplicateCourses(allCourses);
      
      console.log(`총 ${finalCourses.length}개 골프장 정보 수집 완료`);
      
      return finalCourses;
      
    } catch (error) {
      console.error('골프장 정보 수집 오류:', error);
      // 오류 시 수동 데이터만 반환
      return await this.addManualCourses();
    } finally {
      await this.closeBrowser();
    }
  }
}
