import { BaseScraper } from '../scraper/base';
import { DynamicLoader, DynamicLoadingOptions } from './dynamic-loader';
import { PlayerInfo, GolfAssociation } from '@/types';
import { Page } from 'puppeteer';

export interface KPGAAdvancedConfig {
  baseUrl: string;
  playerListUrl: string;
  playerDetailUrl: string;
  searchUrl: string;
  dynamicLoading: DynamicLoadingOptions;
}

export class KPGAAdvancedScraper extends BaseScraper {
  private config: KPGAAdvancedConfig;

  constructor() {
    super();
    this.config = {
      baseUrl: 'https://kpga.co.kr',
      playerListUrl: 'https://kpga.co.kr/player/list',
      playerDetailUrl: 'https://kpga.co.kr/player/detail',
      searchUrl: 'https://kpga.co.kr/player/search',
      dynamicLoading: {
        maxWaitTime: 30000,
        scrollDelay: 2000,
        networkIdleTime: 3000,
        retryAttempts: 3,
        customWaitSelectors: [
          '.player_list',
          '.player_list li',
          '.player_item',
          '[class*="player"]'
        ],
        waitForImages: true,
        waitForFonts: false,
        waitForCustomEvents: ['playerListLoaded', 'dataReady']
      }
    };
  }

  // KPGA 선수 목록 고급 크롤링
  async scrapePlayerList(): Promise<PlayerInfo[]> {
    console.log('🚀 KPGA 선수 목록 고급 크롤링 시작...');
    
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();

      // 페이지 설정
      await this.setupPage(page);

      // 동적 로딩 처리
      const dynamicLoader = new DynamicLoader(page, this.config.dynamicLoading);
      await dynamicLoader.loadDynamicContent();

      // 선수 목록 추출
      const players = await this.extractPlayerList(page);

      await browser.close();
      
      console.log(`✅ KPGA 선수 목록 크롤링 완료: ${players.length}명`);
      return players;

    } catch (error) {
      console.error('❌ KPGA 선수 목록 크롤링 실패:', error);
      return [];
    }
  }

  // 페이지 설정
  private async setupPage(page: Page): Promise<void> {
    // 봇 탐지 우회
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
      
      // Chrome 객체 추가
      (window as any).chrome = {
        runtime: {}
      };
    });

    // User-Agent 설정
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // 뷰포트 설정
    await page.setViewport({ width: 1920, height: 1080 });

    // 요청 인터셉터 설정
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (['image', 'stylesheet', 'font'].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }

  // 선수 목록 추출
  private async extractPlayerList(page: Page): Promise<PlayerInfo[]> {
    console.log('📋 선수 목록 추출 중...');

    // 여러 셀렉터 시도
    const selectors = [
      '.player_list li',
      '.player_item',
      '[class*="player"] li',
      '.list_item',
      'tr[class*="player"]'
    ];

    let players: PlayerInfo[] = [];

    for (const selector of selectors) {
      try {
        console.log(`🔍 셀렉터 시도: ${selector}`);
        
        const elements = await page.$$(selector);
        console.log(`📊 발견된 요소: ${elements.length}개`);

        if (elements.length > 0) {
          players = await this.parsePlayerElements(elements);
          console.log(`✅ 파싱 성공: ${players.length}명`);
          break;
        }
      } catch (error) {
        console.log(`⚠️ 셀렉터 실패: ${selector}`, error);
      }
    }

    // 상세 정보 수집
    if (players.length > 0) {
      players = await this.enrichPlayerDetails(page, players);
    }

    return players;
  }

  // 선수 요소 파싱
  private async parsePlayerElements(elements: any[]): Promise<PlayerInfo[]> {
    const players: PlayerInfo[] = [];

    for (let i = 0; i < elements.length; i++) {
      try {
        const element = elements[i];
        
        // 기본 정보 추출
        const playerData = await element.evaluate((el: Element) => {
          const nameEl = el.querySelector('.name, .player_name, h3, h4, [class*="name"]');
          const linkEl = el.querySelector('a');
          const idEl = el.querySelector('[class*="id"], .member_id, .player_id');
          const rankEl = el.querySelector('.rank, .ranking, [class*="rank"]');
          const prizeEl = el.querySelector('.prize, .money, [class*="prize"]');

          return {
            name: nameEl?.textContent?.trim() || '',
            profileUrl: linkEl?.href || '',
            memberId: idEl?.textContent?.trim() || '',
            ranking: rankEl?.textContent?.trim() || '',
            prize: prizeEl?.textContent?.trim() || ''
          };
        });

        if (playerData.name && playerData.name.length > 1) {
          const player: PlayerInfo = {
            memberId: playerData.memberId || this.generateMemberId(playerData.name),
            name: playerData.name,
            association: 'KPGA',
            birth: '1990-01-01', // 기본값
            career: [{
              year: new Date().getFullYear(),
              title: `${new Date().getFullYear()} KPGA 투어`,
              result: '진행중',
              prize: this.parsePrizeAmount(playerData.prize),
              ranking: this.parseRanking(playerData.ranking)
            }],
            ranking: {
              current: this.parseRanking(playerData.ranking),
              best: this.parseRanking(playerData.ranking),
              worst: this.parseRanking(playerData.ranking)
            },
            currentRanking: this.parseRanking(playerData.ranking),
            totalPrize: this.parsePrizeAmount(playerData.prize),
            isActive: true,
            profileUrl: playerData.profileUrl
          };

          players.push(player);
        }
      } catch (error) {
        console.error(`❌ 선수 ${i} 파싱 오류:`, error);
      }
    }

    return players;
  }

  // 선수 상세 정보 수집
  private async enrichPlayerDetails(page: Page, players: PlayerInfo[]): Promise<PlayerInfo[]> {
    console.log('🔍 선수 상세 정보 수집 중...');
    
    const enrichedPlayers: PlayerInfo[] = [];

    for (let i = 0; i < Math.min(players.length, 10); i++) { // 처음 10명만 상세 수집
      try {
        const player = players[i];
        
        if (player.profileUrl) {
          console.log(`📄 상세 정보 수집: ${player.name}`);
          
          const detailPage = await page.browser()?.newPage();
          if (detailPage) {
            await detailPage.goto(player.profileUrl, { 
              waitUntil: 'networkidle2',
              timeout: 30000 
            });

            const enrichedPlayer = await this.extractPlayerDetails(detailPage, player);
            enrichedPlayers.push(enrichedPlayer);
            
            await detailPage.close();
            
            // 요청 간 지연
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } else {
          enrichedPlayers.push(player);
        }
      } catch (error) {
        console.error(`❌ 상세 정보 수집 실패: ${player.name}`, error);
        enrichedPlayers.push(players[i]);
      }
    }

    // 나머지 선수들 추가
    enrichedPlayers.push(...players.slice(10));

    return enrichedPlayers;
  }

  // 선수 상세 정보 추출
  private async extractPlayerDetails(page: Page, player: PlayerInfo): Promise<PlayerInfo> {
    try {
      // 생년월일 추출
      const birthText = await page.$eval('.birth, .birth_date, [class*="birth"]', 
        (el: Element) => el.textContent?.trim() || ''
      ).catch(() => '');

      // 경력 정보 추출
      const careerText = await page.$eval('.career, .history, [class*="career"]', 
        (el: Element) => el.textContent?.trim() || ''
      ).catch(() => '');

      // 랭킹 정보 추출
      const rankingText = await page.$eval('.ranking, .rank, [class*="rank"]', 
        (el: Element) => el.textContent?.trim() || ''
      ).catch(() => '');

      // 상금 정보 추출
      const prizeText = await page.$eval('.prize, .money, [class*="prize"]', 
        (el: Element) => el.textContent?.trim() || ''
      ).catch(() => '');

      return {
        ...player,
        birth: this.parseDate(birthText) || player.birth,
        career: this.parseCareer(careerText) || player.career,
        ranking: {
          current: this.parseRanking(rankingText) || player.ranking.current,
          best: this.parseRanking(rankingText) || player.ranking.best,
          worst: this.parseRanking(rankingText) || player.ranking.worst
        },
        currentRanking: this.parseRanking(rankingText) || player.currentRanking,
        totalPrize: this.parsePrizeAmount(prizeText) || player.totalPrize
      };

    } catch (error) {
      console.error('❌ 상세 정보 추출 실패:', error);
      return player;
    }
  }

  // 회원번호 생성
  private generateMemberId(name: string): string {
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `KPGA${Math.abs(hash).toString().padStart(5, '0')}`;
  }

  // 날짜 파싱
  private parseDate(dateStr: string): string | null {
    if (!dateStr) return null;
    
    const match = dateStr.match(/(\d{4})[년.-](\d{1,2})[월.-](\d{1,2})/);
    if (match) {
      const [, year, month, day] = match;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return null;
  }

  // 경력 파싱
  private parseCareer(careerStr: string): any[] | null {
    if (!careerStr) return null;
    
    // 간단한 경력 파싱 로직
    return [{
      year: new Date().getFullYear(),
      title: 'KPGA 투어',
      result: '진행중',
      prize: 0,
      ranking: 0
    }];
  }

  // 랭킹 파싱
  private parseRanking(rankingStr: string): number {
    if (!rankingStr) return 0;
    const match = rankingStr.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  // 상금 파싱
  private parsePrizeAmount(prizeStr: string): number {
    if (!prizeStr) return 0;
    const match = prizeStr.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  }
}
