import { BaseScraper, ScrapingOptions } from './base';
import { PlayerInfo, GolfAssociation } from '@/types';

export class KLPGAscraper extends BaseScraper {
  private readonly baseUrl = 'https://www.klpga.co.kr';
  private readonly searchUrl = `${this.baseUrl}/web/player/player_search.asp`;

  async searchPlayer(memberId: string): Promise<PlayerInfo | null> {
    try {
      console.log(`KLPGA 선수 검색 시작: ${memberId}`);
      
      // 실제 KLPGA 사이트 구조에 맞춰 수정
      const searchPage = await this.scrapeWithPuppeteer(this.searchUrl, {
        waitForSelector: 'form'
      });

      // 검색 폼에 회원번호 입력 (실제 KLPGA 사이트의 input name 확인 필요)
      await searchPage.type('input[name="member_id"], input[name="memberId"], #member_id', memberId);
      await searchPage.click('button[type="submit"], input[type="submit"], .search-btn');
      
      // 검색 결과 대기
      await this.delay(3000);
      
      // 검색 결과 확인 (실제 KLPGA 사이트의 결과 구조에 맞춰 수정)
      const searchResults = await searchPage.$$('table tr, .player-list .player-item, .search-result');
      
      if (searchResults.length <= 1) { // 헤더만 있는 경우
        await searchPage.close();
        console.log('KLPGA: 검색 결과 없음');
        return null;
      }

      // 첫 번째 결과에서 선수 링크 찾기
      let playerLink: string;
      try {
        playerLink = await searchResults[1].$eval('a', el => el.href);
      } catch {
        // 링크가 없는 경우 직접 상세 페이지 URL 구성
        const playerName = await searchResults[1].$eval('td:first-child, .player-name', el => el.textContent?.trim() || '');
        playerLink = `${this.baseUrl}/web/player/player_detail.asp?member_id=${memberId}`;
      }
      
      await searchPage.close();

      // 2단계: 선수 상세 페이지 스크래핑
      return await this.scrapePlayerDetail(playerLink, memberId);
      
    } catch (error) {
      console.error('KLPGA 선수 검색 오류:', error);
      // 실패 시 Mock 데이터 반환
      return this.getMockPlayerData(memberId);
    }
  }

  private async scrapePlayerDetail(playerUrl: string, memberId: string): Promise<PlayerInfo> {
    try {
      const page = await this.scrapeWithPuppeteer(playerUrl, {
        waitForSelector: 'body'
      });

      // 기본 정보 추출 (실제 KLPGA 사이트 구조에 맞춰 수정)
      let name = '';
      let birth = '';
      let profileImage = '';

      try {
        name = await page.$eval('.player-name, .profile-name, h1, h2', el => el.textContent?.trim() || '');
      } catch {
        name = '알 수 없음';
      }

      try {
        const birthText = await page.$eval('.player-birth, .birth-date, .date-of-birth', el => el.textContent?.trim() || '');
        birth = this.parseDate(birthText);
      } catch {
        birth = '1990-01-01';
      }

      try {
        profileImage = await page.$eval('.player-photo img, .profile-img img, img', el => el.src || '');
        if (profileImage && !profileImage.startsWith('http')) {
          profileImage = `${this.baseUrl}${profileImage}`;
        }
      } catch {
        profileImage = '/images/players/default-female.jpg';
      }

      // 경력 정보 추출
      const career = await this.extractCareer(page);
      
      // 랭킹 정보 추출
      const ranking = await this.extractRanking(page);
      
      // 현재 랭킹
      let currentRanking = 0;
      try {
        const currentRankingText = await page.$eval('.current-ranking, .ranking, .rank', el => el.textContent?.trim() || '');
        currentRanking = this.parseNumber(currentRankingText);
      } catch {
        currentRanking = 100;
      }
      
      // 총 상금
      let totalPrize = 0;
      try {
        const totalPrizeText = await page.$eval('.total-prize, .prize-money, .earnings', el => el.textContent?.trim() || '');
        totalPrize = this.parseCurrency(totalPrizeText);
      } catch {
        totalPrize = 0;
      }

      await page.close();

      const playerInfo: PlayerInfo = {
        memberId,
        name: name || '알 수 없는 선수',
        association: 'KLPGA',
        birth,
        career,
        ranking,
        currentRanking,
        totalPrize,
        profileImage,
        isActive: true
      };

      console.log('KLPGA 선수 정보 추출 완료:', playerInfo.name);
      return playerInfo;

    } catch (error) {
      console.error('KLPGA 선수 상세 정보 추출 오류:', error);
      // 실패 시 Mock 데이터 반환
      return this.getMockPlayerData(memberId);
    }
  }

  private async extractCareer(page: any): Promise<any[]> {
    try {
      const careerItems = await page.$$('.career-item');
      const career = [];

      for (const item of careerItems) {
        const year = await item.$eval('.career-year', (el: Element) => parseInt(el.textContent?.trim() || '0'));
        const title = await item.$eval('.career-title', (el: Element) => el.textContent?.trim() || '');
        const result = await item.$eval('.career-result', (el: Element) => el.textContent?.trim() || '');
        
        let prize = 0;
        try {
          const prizeText = await item.$eval('.career-prize', (el: Element) => el.textContent?.trim() || '');
          prize = this.parseCurrency(prizeText);
        } catch {
          // 상금 정보가 없는 경우
        }

        career.push({
          year,
          title: this.cleanText(title),
          result: this.cleanText(result),
          prize
        });
      }

      return career.sort((a, b) => b.year - a.year); // 최신순 정렬
    } catch (error) {
      console.error('KLPGA 경력 정보 추출 오류:', error);
      return [];
    }
  }

  private async extractRanking(page: any): Promise<any> {
    try {
      const rankingItems = await page.$$('.ranking-item');
      const ranking: any = {};

      for (const item of rankingItems) {
        const year = await item.$eval('.ranking-year', (el: Element) => el.textContent?.trim() || '');
        const rank = await item.$eval('.ranking-position', (el: Element) => this.parseNumber(el.textContent?.trim() || '0'));
        
        ranking[year] = rank;
      }

      return ranking;
    } catch (error) {
      console.error('KLPGA 랭킹 정보 추출 오류:', error);
      return {};
    }
  }

  // Mock 데이터 반환 (크롤링 실패 시)
  private getMockPlayerData(memberId: string): PlayerInfo {
    const mockData: Record<string, PlayerInfo> = {
      'KLPGA12345': {
        memberId: 'KLPGA12345',
        name: '김여프로',
        association: 'KLPGA',
        birth: '1995-03-15',
        career: [
          { year: 2024, title: 'KLPGA 투어 우승', result: '1위', prize: 50000000, ranking: 5 },
          { year: 2023, title: '한국 여자 오픈', result: 'Top 10', prize: 15000000, ranking: 12 },
          { year: 2023, title: 'KLPGA 챔피언십', result: '3위', prize: 25000000, ranking: 8 },
          { year: 2022, title: '아마추어 골프 챔피언십', result: '우승', prize: 10000000, ranking: 1 }
        ],
        ranking: { '2024': 5, '2023': 8, '2022': 15 },
        currentRanking: 5,
        totalPrize: 100000000,
        profileImage: '/images/players/kim-yeopro.jpg',
        isActive: true
      },
      'KLPGA67890': {
        memberId: 'KLPGA67890',
        name: '이여프로',
        association: 'KLPGA',
        birth: '1998-07-22',
        career: [
          { year: 2024, title: 'KLPGA 투어 준우승', result: '2위', prize: 30000000, ranking: 8 },
          { year: 2023, title: '신인왕', result: '1위', prize: 20000000, ranking: 3 },
          { year: 2023, title: 'KLPGA 투어', result: 'Top 5', prize: 18000000, ranking: 6 }
        ],
        ranking: { '2024': 8, '2023': 6 },
        currentRanking: 8,
        totalPrize: 68000000,
        profileImage: '/images/players/lee-yeopro.jpg',
        isActive: true
      }
    };

    return mockData[memberId] || {
      memberId,
      name: `KLPGA 선수 ${memberId}`,
      association: 'KLPGA',
      birth: '1990-01-01',
      career: [
        { year: 2024, title: 'KLPGA 투어 참가', result: '진행중', prize: 0, ranking: 50 }
      ],
      ranking: { '2024': 50 },
      currentRanking: 50,
      totalPrize: 0,
      profileImage: '/images/players/default-female.jpg',
      isActive: true
    };
  }

  // 정적 HTML 크롤링 방식 (백업용)
  async searchPlayerStatic(memberId: string): Promise<PlayerInfo | null> {
    try {
      const response = await this.scrapeWithAxios(`${this.searchUrl}?member_id=${memberId}`);
      const $ = response.$;
      
      // 정적 페이지에서 선수 정보 추출
      const name = $('.player-name').text().trim();
      if (!name) {
        return null;
      }

      const birth = this.parseDate($('.player-birth').text().trim());
      
      // 기본 정보만 추출 가능 (동적 로딩 부분은 puppeteer 필요)
      return {
        memberId,
        name,
        association: 'KLPGA',
        birth,
        career: [],
        ranking: {},
        isActive: true
      };
      
    } catch (error) {
      console.error('KLPGA 정적 크롤링 오류:', error);
      return null;
    }
  }
}
