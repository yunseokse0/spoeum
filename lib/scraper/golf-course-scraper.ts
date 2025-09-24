import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import { GolfCourse } from '@/types';
import { PublicDataGolfScraper } from './public-data-golf-scraper';

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

  // 공공데이터만 사용하므로 기존 소스 배열 제거

  async initBrowser(): Promise<void> {
    if (!this.browser) {
      const isVercel = process.env.VERCEL === '1';
      
      const launchOptions: any = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      };

      // Vercel 환경에서 Chromium 경로 설정
      if (isVercel) {
        launchOptions.executablePath = '/usr/bin/chromium-browser';
        launchOptions.args.push('--disable-extensions');
      }

      this.browser = await puppeteer.launch(launchOptions);
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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

  async scrapeFromPublicData(): Promise<ScrapedGolfCourse[]> {
    const allCourses: ScrapedGolfCourse[] = [];

    // 공공데이터포털에서만 골프장 정보 크롤링
    try {
      console.log('공공데이터포털에서 골프장 정보 크롤링 시작...');
      const publicDataScraper = new PublicDataGolfScraper();
      const publicDataCourses = await publicDataScraper.scrapeGolfCoursesFromPublicData();
      
      if (publicDataCourses.length > 0) {
        const convertedCourses = publicDataCourses.map(course => ({
          name: course.name,
          region: course.region,
          city: course.city,
          address: course.address,
          phone: course.phone,
          source: '공공데이터포털'
        }));
        
        allCourses.push(...convertedCourses);
        console.log(`공공데이터포털에서 ${convertedCourses.length}개 골프장 크롤링 성공`);
      }
    } catch (error) {
      console.error('공공데이터포털 처리 오류:', error);
    }

    // 공공데이터 크롤링 결과 반환
    console.log(`공공데이터로 ${allCourses.length}개 골프장 수집 완료`);
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
      const scrapedCourses = await this.scrapeFromPublicData();
      
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

  // 프렌즈 스크린 전용 크롤링 (동적 로딩 처리)
  async scrapeFriendsScreen(): Promise<ScrapedGolfCourse[]> {
    try {
      console.log('프렌즈 스크린 전용 크롤링 시작...');
      
      await this.initBrowser();
      if (!this.page) throw new Error("Page not initialized");

      await this.page.goto('https://www.friendsscreen.kr/main/course', { waitUntil: 'domcontentloaded' });

      // 페이지 완전 로딩 대기
      await new Promise(resolve => setTimeout(resolve, 5000));

      // 스크롤하여 동적 콘텐츠 로딩
      await this.page.evaluate(() => {
        return new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if(totalHeight >= scrollHeight){
              clearInterval(timer);
              resolve(undefined);
            }
          }, 100);
        });
      });

      // 추가 대기
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 다양한 셀렉터로 골프장 정보 찾기
      const selectors = [
        '.course-item',
        '.golf-course-card', 
        '[class*="course"]',
        '.item',
        '.card',
        'div[class*="golf"]',
        'div[class*="course"]',
        '.top-course',
        '.popular-course',
        '.new-course'
      ];

      let courses: ScrapedGolfCourse[] = [];
      
      for (const selector of selectors) {
        try {
          const elements = await this.page.$$(selector);
          console.log(`프렌즈 스크린: ${selector}에서 ${elements.length}개 항목 발견`);
          
          if (elements.length > 0) {
            for (let i = 0; i < Math.min(elements.length, 20); i++) {
              try {
                const element = elements[i];
                const text = await element.evaluate((el: Element) => el.textContent?.trim() || '');
                
                if (text && text.length > 10) {
                  const course = this.parseFriendsScreenCourse(text, i);
                  if (course) {
                    courses.push(course);
                  }
                }
              } catch (e) {
                console.error(`프렌즈 스크린 항목 ${i} 파싱 오류:`, e);
              }
            }
            
            if (courses.length > 0) {
              break; // 성공적으로 파싱했으면 중단
            }
          }
        } catch (e) {
          console.error(`프렌즈 스크린 셀렉터 ${selector} 오류:`, e);
        }
      }

      console.log(`프렌즈 스크린 크롤링 완료: ${courses.length}개`);
      return courses;

    } catch (error) {
      console.error('프렌즈 스크린 크롤링 오류:', error);
      return [];
    }
  }

  // 프렌즈 스크린 골프장 파싱
  private parseFriendsScreenCourse(text: string, index: number): ScrapedGolfCourse | null {
    try {
      // 텍스트에서 골프장 정보 추출
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (lines.length < 2) return null;

      // 골프장 이름 추출 (첫 번째 의미있는 라인)
      const name = lines[0] || `프렌즈 스크린 골프장 ${index + 1}`;
      
      // 지역 정보 추출
      let region = '전국';
      let city = '미상';
      let address = '주소 정보 없음';

      for (const line of lines) {
        if (line.includes('수도권') || line.includes('서울') || line.includes('경기')) {
          region = '수도권';
          city = line.includes('서울') ? '서울' : '경기';
          address = line;
        } else if (line.includes('강원도')) {
          region = '강원도';
          city = '강원';
          address = line;
        } else if (line.includes('충청도')) {
          region = '충청도';
          city = '충청';
          address = line;
        } else if (line.includes('전라도')) {
          region = '전라도';
          city = '전라';
          address = line;
        } else if (line.includes('경상도')) {
          region = '경상도';
          city = '경상';
          address = line;
        } else if (line.includes('제주도')) {
          region = '제주도';
          city = '제주';
          address = line;
        }
      }

      return {
        name,
        region,
        city,
        address,
        phone: '1666-1538', // 프렌즈 스크린 대표번호
        website: 'https://www.friendsscreen.kr',
        source: '프렌즈 스크린'
      };
    } catch (error) {
      console.error('프렌즈 스크린 골프장 파싱 오류:', error);
      return null;
    }
  }
}
