import { BaseScraper } from '../scraper/base';
import { PlayerInfo } from '@/types';

export class KPGADebugScraper extends BaseScraper {
  private readonly baseUrl = 'https://kpga.co.kr';
  private readonly playerListUrl = 'https://kpga.co.kr/player/list';

  // KPGA 사이트 구조 디버깅
  async debugKPGAStructure(): Promise<any> {
    console.log('🔍 KPGA 사이트 구조 디버깅 시작...');
    
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();

      // 페이지 설정
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });

      // 페이지 로드
      await page.goto(this.playerListUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // 페이지 제목 확인
      const title = await page.title();
      console.log('📄 페이지 제목:', title);

      // URL 확인
      const currentUrl = page.url();
      console.log('🌐 현재 URL:', currentUrl);

      // 페이지 HTML 구조 분석
      const pageStructure = await page.evaluate(() => {
        const body = document.body;
        
        // 모든 클래스명 수집
        const allClasses = Array.from(body.querySelectorAll('*'))
          .map(el => el.className)
          .filter(className => className && typeof className === 'string')
          .flatMap(className => className.split(' '))
          .filter(className => className.length > 0)
          .reduce((acc, className) => {
            acc[className] = (acc[className] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

        // player 관련 클래스 찾기
        const playerClasses = Object.keys(allClasses)
          .filter(className => 
            className.toLowerCase().includes('player') ||
            className.toLowerCase().includes('list') ||
            className.toLowerCase().includes('item') ||
            className.toLowerCase().includes('card')
          )
          .sort((a, b) => allClasses[b] - allClasses[a]);

        // 모든 링크 수집
        const allLinks = Array.from(body.querySelectorAll('a'))
          .map(link => ({
            href: link.href,
            text: link.textContent?.trim(),
            className: link.className
          }))
          .filter(link => link.text && link.text.length > 0);

        // player 관련 링크 찾기
        const playerLinks = allLinks.filter(link => 
          link.href.includes('player') || 
          link.text.toLowerCase().includes('player') ||
          link.className.toLowerCase().includes('player')
        );

        // 테이블 구조 분석
        const tables = Array.from(body.querySelectorAll('table')).map((table, index) => ({
          index,
          className: table.className,
          rowCount: table.querySelectorAll('tr').length,
          colCount: table.querySelectorAll('tr')[0]?.querySelectorAll('td, th').length || 0
        }));

        // 리스트 구조 분석
        const lists = Array.from(body.querySelectorAll('ul, ol')).map((list, index) => ({
          index,
          tagName: list.tagName,
          className: list.className,
          itemCount: list.querySelectorAll('li').length
        }));

        return {
          allClasses: Object.entries(allClasses)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 50), // 상위 50개만
          playerClasses,
          playerLinks: playerLinks.slice(0, 20), // 상위 20개만
          tables,
          lists,
          bodyHTML: body.innerHTML.substring(0, 5000) // 처음 5000자만
        };
      });

      console.log('📊 페이지 구조 분석 결과:');
      console.log('🔤 상위 클래스들:', pageStructure.allClasses.slice(0, 20));
      console.log('👥 Player 관련 클래스들:', pageStructure.playerClasses);
      console.log('🔗 Player 관련 링크들:', pageStructure.playerLinks);
      console.log('📋 테이블들:', pageStructure.tables);
      console.log('📝 리스트들:', pageStructure.lists);

      // 실제 선수 데이터가 있는지 확인
      const playerData = await page.evaluate(() => {
        // 다양한 셀렉터로 선수 데이터 찾기
        const selectors = [
          'tr', 'td', 'li', 'div', 'span', 'a',
          '[class*="player"]', '[class*="list"]', '[class*="item"]',
          '[class*="name"]', '[class*="member"]', '[class*="rank"]'
        ];

        const results: any = {};
        
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            results[selector] = {
              count: elements.length,
              samples: Array.from(elements).slice(0, 5).map(el => ({
                tagName: el.tagName,
                className: el.className,
                textContent: el.textContent?.trim().substring(0, 100),
                innerHTML: el.innerHTML.substring(0, 200)
              }))
            };
          }
        });

        return results;
      });

      console.log('🎯 요소별 분석 결과:');
      Object.entries(playerData).forEach(([selector, data]: [string, any]) => {
        if (data.count > 0) {
          console.log(`  ${selector}: ${data.count}개`);
          data.samples.forEach((sample: any, index: number) => {
            console.log(`    ${index + 1}. ${sample.tagName}.${sample.className}: "${sample.textContent}"`);
          });
        }
      });

      await browser.close();

      return {
        pageStructure,
        playerData,
        success: true
      };

    } catch (error) {
      console.error('❌ KPGA 구조 디버깅 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      };
    }
  }

  // 실제 선수 데이터 크롤링 (디버깅 결과 기반)
  async scrapePlayersWithDebug(): Promise<PlayerInfo[]> {
    console.log('🚀 KPGA 선수 데이터 크롤링 (디버깅 기반)...');
    
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto(this.playerListUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // 페이지 로드 대기
      await new Promise(resolve => setTimeout(resolve, 5000));

      // 스크롤하여 동적 콘텐츠 로드
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

      // 추가 대기
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 실제 선수 데이터 추출
      const players = await page.evaluate(() => {
        const results: any[] = [];
        
        // 모든 가능한 셀렉터 시도
        const selectors = [
          'tr', 'td', 'li', 'div[class*="player"]', 'div[class*="list"]',
          'a[href*="player"]', '[class*="name"]', '[class*="member"]'
        ];

        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el, index) => {
            const text = el.textContent?.trim();
            if (text && text.length > 2 && text.length < 50) {
              // 한글이 포함된 텍스트만 수집
              if (/[가-힣]/.test(text)) {
                results.push({
                  selector,
                  index,
                  text,
                  className: el.className,
                  tagName: el.tagName,
                  href: (el as HTMLAnchorElement).href || ''
                });
              }
            }
          });
        });

        return results;
      });

      console.log(`📊 발견된 텍스트 요소: ${players.length}개`);
      
      // 선수 데이터로 변환
      const playerInfos: PlayerInfo[] = players
        .filter(p => p.text && p.text.length > 2)
        .slice(0, 10) // 처음 10개만
        .map((p, index) => ({
          memberId: `KPGA${String(index + 1).padStart(5, '0')}`,
          name: p.text,
          association: 'KPGA',
          birth: '1990-01-01',
          career: [{
            year: new Date().getFullYear(),
            title: `${new Date().getFullYear()} KPGA 투어`,
            result: '진행중',
            prize: 0,
            ranking: 0
          }],
          ranking: {
            current: 0,
            best: 0,
            worst: 0
          },
          currentRanking: 0,
          totalPrize: 0,
          isActive: true
        }));

      await browser.close();

      console.log(`✅ KPGA 선수 데이터 크롤링 완료: ${playerInfos.length}명`);
      return playerInfos;

    } catch (error) {
      console.error('❌ KPGA 선수 데이터 크롤링 실패:', error);
      return [];
    }
  }
}
