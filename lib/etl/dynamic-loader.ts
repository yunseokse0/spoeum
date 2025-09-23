import { Page } from 'puppeteer';

export interface DynamicLoadingOptions {
  maxWaitTime?: number;
  scrollDelay?: number;
  networkIdleTime?: number;
  retryAttempts?: number;
  customWaitSelectors?: string[];
  waitForImages?: boolean;
  waitForFonts?: boolean;
  waitForCustomEvents?: string[];
}

export class DynamicLoader {
  private page: Page;
  private options: Required<DynamicLoadingOptions>;

  constructor(page: Page, options: DynamicLoadingOptions = {}) {
    this.page = page;
    this.options = {
      maxWaitTime: options.maxWaitTime || 30000,
      scrollDelay: options.scrollDelay || 1000,
      networkIdleTime: options.networkIdleTime || 2000,
      retryAttempts: options.retryAttempts || 3,
      customWaitSelectors: options.customWaitSelectors || [],
      waitForImages: options.waitForImages || false,
      waitForFonts: options.waitForFonts || false,
      waitForCustomEvents: options.waitForCustomEvents || []
    };
  }

  // 고급 동적 로딩 처리
  async loadDynamicContent(): Promise<void> {
    console.log('🔄 동적 콘텐츠 로딩 시작...');
    
    try {
      // 1단계: 기본 네트워크 안정화
      await this.waitForNetworkStability();
      
      // 2단계: 스크롤을 통한 콘텐츠 로딩
      await this.scrollToLoadContent();
      
      // 3단계: 커스텀 셀렉터 대기
      await this.waitForCustomSelectors();
      
      // 4단계: 추가 리소스 로딩 대기
      await this.waitForAdditionalResources();
      
      // 5단계: 커스텀 이벤트 대기
      await this.waitForCustomEvents();
      
      console.log('✅ 동적 콘텐츠 로딩 완료');
    } catch (error) {
      console.error('❌ 동적 콘텐츠 로딩 실패:', error);
      throw error;
    }
  }

  // 네트워크 안정화 대기
  private async waitForNetworkStability(): Promise<void> {
    console.log('🌐 네트워크 안정화 대기 중...');
    
    try {
      // Puppeteer에서는 waitForLoadState 대신 waitForFunction 사용
      await this.page.waitForFunction(
        () => {
          return document.readyState === 'complete';
        },
        { timeout: this.options.maxWaitTime }
      );
      
      // 추가로 네트워크 안정화를 위해 잠시 대기
      await this.delay(this.options.networkIdleTime);
    } catch (error) {
      console.log('⚠️ 네트워크 안정화 타임아웃, 계속 진행...');
    }
  }

  // 스크롤을 통한 콘텐츠 로딩
  private async scrollToLoadContent(): Promise<void> {
    console.log('📜 스크롤을 통한 콘텐츠 로딩 중...');
    
    let previousHeight = 0;
    let currentHeight = 0;
    let stableCount = 0;
    const maxStableCount = 3;

    do {
      // 현재 높이 저장
      previousHeight = currentHeight;
      
      // 페이지 끝까지 스크롤
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // 스크롤 후 대기
      await this.delay(this.options.scrollDelay);

      // 새로운 높이 확인
      currentHeight = await this.page.evaluate(() => document.body.scrollHeight);
      
      if (currentHeight === previousHeight) {
        stableCount++;
      } else {
        stableCount = 0;
      }

      console.log(`📏 스크롤 진행: ${currentHeight}px (안정: ${stableCount}/${maxStableCount})`);

    } while (stableCount < maxStableCount && currentHeight < 50000); // 최대 50MB 제한

    // 맨 위로 스크롤
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }

  // 커스텀 셀렉터 대기
  private async waitForCustomSelectors(): Promise<void> {
    if (this.options.customWaitSelectors.length === 0) return;

    console.log('🎯 커스텀 셀렉터 대기 중...');
    
    for (const selector of this.options.customWaitSelectors) {
      try {
        await this.page.waitForSelector(selector, { 
          timeout: 5000 
        });
        console.log(`✅ 셀렉터 발견: ${selector}`);
      } catch (error) {
        console.log(`⚠️ 셀렉터 타임아웃: ${selector}`);
      }
    }
  }

  // 추가 리소스 로딩 대기
  private async waitForAdditionalResources(): Promise<void> {
    console.log('🖼️ 추가 리소스 로딩 대기 중...');
    
    const promises: Promise<any>[] = [];

    // 이미지 로딩 대기
    if (this.options.waitForImages) {
      promises.push(
        this.page.waitForFunction(
          () => {
            const images = Array.from(document.querySelectorAll('img'));
            return images.every(img => img.complete);
          },
          { timeout: 10000 }
        ).catch(() => console.log('⚠️ 이미지 로딩 타임아웃'))
      );
    }

    // 폰트 로딩 대기
    if (this.options.waitForFonts) {
      promises.push(
        this.page.waitForFunction(
          () => document.fonts.ready,
          { timeout: 5000 }
        ).catch(() => console.log('⚠️ 폰트 로딩 타임아웃'))
      );
    }

    // 모든 리소스 로딩 대기
    await Promise.allSettled(promises);
  }

  // 커스텀 이벤트 대기
  private async waitForCustomEvents(): Promise<void> {
    if (this.options.waitForCustomEvents.length === 0) return;

    console.log('🎪 커스텀 이벤트 대기 중...');
    
    for (const event of this.options.waitForCustomEvents) {
      try {
        await this.page.waitForFunction(
          () => window.dispatchEvent(new CustomEvent(event)),
          { timeout: 5000 }
        );
        console.log(`✅ 이벤트 발생: ${event}`);
      } catch (error) {
        console.log(`⚠️ 이벤트 타임아웃: ${event}`);
      }
    }
  }

  // AJAX 요청 완료 대기
  async waitForAjaxComplete(): Promise<void> {
    console.log('🔄 AJAX 요청 완료 대기 중...');
    
    await this.page.waitForFunction(
      () => {
        return window.jQuery ? window.jQuery.active === 0 : true;
      },
      { timeout: this.options.maxWaitTime }
    );
  }

  // 특정 요소가 로드될 때까지 대기
  async waitForElementLoad(selector: string, timeout: number = 10000): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.log(`⚠️ 요소 로딩 실패: ${selector}`);
      return false;
    }
  }

  // 무한 스크롤 처리
  async handleInfiniteScroll(loadMoreSelector?: string): Promise<void> {
    console.log('♾️ 무한 스크롤 처리 중...');
    
    let hasMoreContent = true;
    let scrollCount = 0;
    const maxScrolls = 50;

    while (hasMoreContent && scrollCount < maxScrolls) {
      const previousHeight = await this.page.evaluate(() => document.body.scrollHeight);
      
      // 페이지 끝으로 스크롤
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // 로드 더 보기 버튼 클릭 (있는 경우)
      if (loadMoreSelector) {
        try {
          const loadMoreButton = await this.page.$(loadMoreSelector);
          if (loadMoreButton) {
            await loadMoreButton.click();
            await this.page.waitForTimeout(2000);
          }
        } catch (error) {
          console.log('⚠️ 로드 더 보기 버튼 클릭 실패');
        }
      }

      // 콘텐츠 로딩 대기
      await this.delay(this.options.scrollDelay);

      const newHeight = await this.page.evaluate(() => document.body.scrollHeight);
      
      if (newHeight === previousHeight) {
        hasMoreContent = false;
      } else {
        scrollCount++;
        console.log(`📜 무한 스크롤 진행: ${scrollCount}/${maxScrolls}`);
      }
    }

    console.log(`✅ 무한 스크롤 완료: ${scrollCount}회 스크롤`);
  }

  // 동적 테이블 로딩 대기
  async waitForDynamicTable(tableSelector: string, minRows: number = 1): Promise<void> {
    console.log(`📊 동적 테이블 로딩 대기 중: 최소 ${minRows}행`);
    
    await this.page.waitForFunction(
      (selector, min) => {
        const table = document.querySelector(selector);
        if (!table) return false;
        
        const rows = table.querySelectorAll('tr');
        return rows.length >= min;
      },
      { timeout: this.options.maxWaitTime },
      tableSelector,
      minRows
    );
  }

  // SPA 라우팅 대기
  async waitForSPARouting(): Promise<void> {
    console.log('🔄 SPA 라우팅 대기 중...');
    
    await this.page.waitForFunction(
      () => {
        return window.history && window.history.state !== null;
      },
      { timeout: 5000 }
    );
  }

  // 콘텐츠 변경 감지
  async waitForContentChange(selector: string, initialContent?: string): Promise<void> {
    console.log('👀 콘텐츠 변경 감지 대기 중...');
    
    if (!initialContent) {
      initialContent = await this.page.$eval(selector, el => el.textContent || '');
    }

    await this.page.waitForFunction(
      (sel, initial) => {
        const element = document.querySelector(sel);
        if (!element) return false;
        
        const currentContent = element.textContent || '';
        return currentContent !== initial;
      },
      { timeout: this.options.maxWaitTime },
      selector,
      initialContent
    );
  }

  // 지연 함수
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
