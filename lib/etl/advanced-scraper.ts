import { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { PlayerInfo, Tournament, GolfCourse, GolfAssociation } from '@/types';

export interface ScrapingConfig {
  name: string;
  url: string;
  type: 'static' | 'dynamic' | 'api';
  selectors: {
    container: string;
    fields: Record<string, string>;
  };
  pagination?: {
    nextButton: string;
    maxPages?: number;
  };
  encoding?: string;
  headers?: Record<string, string>;
  delay?: number;
}

export interface ScrapingResult<T> {
  data: T[];
  success: boolean;
  errors: string[];
  metadata: {
    source: string;
    timestamp: string;
    totalItems: number;
    processingTime: number;
  };
}

export class AdvancedScraper {
  private browser: Browser | null = null;
  private results: Map<string, any[]> = new Map();

  constructor() {
    this.results = new Map();
  }

  // 고급 브라우저 초기화
  async initAdvancedBrowser(): Promise<Browser> {
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
          '--disable-features=VizDisplayCompositor',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-extensions',
          '--disable-plugins',
          '--disable-default-apps',
          '--disable-sync',
          '--disable-translate',
          '--hide-scrollbars',
          '--mute-audio',
          '--no-default-browser-check',
          '--no-pings',
          '--single-process',
          '--disable-blink-features=AutomationControlled',
          '--disable-features=VizDisplayCompositor'
        ]
      };

      if (isVercel) {
        launchOptions.executablePath = '/usr/bin/chromium-browser';
      }

      try {
        const puppeteer = await import('puppeteer');
        this.browser = await puppeteer.launch(launchOptions);
        console.log('고급 브라우저 초기화 완료');
      } catch (error) {
        console.error('브라우저 초기화 실패:', error);
        throw error;
      }
    }

    return this.browser;
  }

  // 정적 페이지 크롤링 (Cheerio)
  async scrapeStatic<T>(config: ScrapingConfig): Promise<ScrapingResult<T>> {
    const startTime = Date.now();
    const errors: string[] = [];
    let data: T[] = [];

    try {
      console.log(`정적 크롤링 시작: ${config.name}`);
      
      const response = await axios.get(config.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          ...config.headers
        },
        timeout: 30000,
        responseType: 'arraybuffer'
      });

      // 인코딩 처리
      let html: string;
      if (config.encoding) {
        const iconv = await import('iconv-lite');
        html = iconv.decode(response.data, config.encoding);
      } else {
        html = response.data.toString('utf-8');
      }

      const $ = cheerio.load(html);
      data = this.parseStaticData<T>($, config);

      console.log(`${config.name} 정적 크롤링 완료: ${data.length}개 항목`);

    } catch (error) {
      const errorMsg = `정적 크롤링 실패 (${config.name}): ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    return {
      data,
      success: errors.length === 0,
      errors,
      metadata: {
        source: config.name,
        timestamp: new Date().toISOString(),
        totalItems: data.length,
        processingTime: Date.now() - startTime
      }
    };
  }

  // 동적 페이지 크롤링 (Puppeteer)
  async scrapeDynamic<T>(config: ScrapingConfig): Promise<ScrapingResult<T>> {
    const startTime = Date.now();
    const errors: string[] = [];
    let data: T[] = [];
    let page: Page | null = null;

    try {
      console.log(`동적 크롤링 시작: ${config.name}`);
      
      const browser = await this.initAdvancedBrowser();
      page = await browser.newPage();

      // 봇 탐지 우회 설정
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
        });
      });

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });

      // 페이지 로드
      await page.goto(config.url, { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });

      // 추가 대기
      await this.delay(config.delay || 3000);

      // 스크롤하여 동적 콘텐츠 로드
      await this.scrollToLoadContent(page);

      // 페이지네이션 처리
      if (config.pagination) {
        data = await this.scrapeWithPagination<T>(page, config);
      } else {
        data = await this.parseDynamicData<T>(page, config);
      }

      console.log(`${config.name} 동적 크롤링 완료: ${data.length}개 항목`);

    } catch (error) {
      const errorMsg = `동적 크롤링 실패 (${config.name}): ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    } finally {
      if (page) {
        await page.close();
      }
    }

    return {
      data,
      success: errors.length === 0,
      errors,
      metadata: {
        source: config.name,
        timestamp: new Date().toISOString(),
        totalItems: data.length,
        processingTime: Date.now() - startTime
      }
    };
  }

  // 페이지네이션 처리
  private async scrapeWithPagination<T>(page: Page, config: ScrapingConfig): Promise<T[]> {
    const allData: T[] = [];
    let currentPage = 1;
    const maxPages = config.pagination?.maxPages || 10;

    while (currentPage <= maxPages) {
      try {
        console.log(`${config.name} 페이지 ${currentPage} 크롤링 중...`);
        
        // 현재 페이지 데이터 추출
        const pageData = await this.parseDynamicData<T>(page, config);
        allData.push(...pageData);

        // 다음 페이지 버튼 클릭
        const nextButton = await page.$(config.pagination!.nextButton);
        if (!nextButton) {
          console.log(`${config.name} 페이지네이션 완료 (${currentPage}페이지)`);
          break;
        }

        await nextButton.click();
        await this.delay(2000);
        currentPage++;

      } catch (error) {
        console.error(`${config.name} 페이지 ${currentPage} 처리 오류:`, error);
        break;
      }
    }

    return allData;
  }

  // 스크롤하여 동적 콘텐츠 로드
  private async scrollToLoadContent(page: Page): Promise<void> {
    await page.evaluate(() => {
      return new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve(undefined);
          }
        }, 100);
      });
    });
  }

  // 정적 데이터 파싱
  private parseStaticData<T>($: cheerio.CheerioAPI, config: ScrapingConfig): T[] {
    const data: T[] = [];
    
    $(config.selectors.container).each((index, element) => {
      try {
        const item: any = {};
        
        for (const [field, selector] of Object.entries(config.selectors.fields)) {
          const value = $(element).find(selector).text().trim();
          item[field] = this.cleanText(value);
        }
        
        if (Object.keys(item).length > 0) {
          data.push(item as T);
        }
      } catch (error) {
        console.error(`정적 데이터 파싱 오류 (항목 ${index}):`, error);
      }
    });

    return data;
  }

  // 동적 데이터 파싱
  private async parseDynamicData<T>(page: Page, config: ScrapingConfig): Promise<T[]> {
    const data: T[] = [];
    
    const elements = await page.$$(config.selectors.container);
    
    for (let i = 0; i < elements.length; i++) {
      try {
        const item: any = {};
        
        for (const [field, selector] of Object.entries(config.selectors.fields)) {
          const value = await elements[i].$eval(selector, (el: Element) => el.textContent?.trim() || '');
          item[field] = this.cleanText(value);
        }
        
        if (Object.keys(item).length > 0) {
          data.push(item as T);
        }
      } catch (error) {
        console.error(`동적 데이터 파싱 오류 (항목 ${i}):`, error);
      }
    }

    return data;
  }

  // 텍스트 정리
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n\t]/g, '')
      .trim();
  }

  // 지연 함수
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 브라우저 종료
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
