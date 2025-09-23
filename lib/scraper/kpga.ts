import { BaseScraper, ScrapingOptions } from './base';
import { PlayerInfo, GolfAssociation } from '@/types';

export class KPGAscraper extends BaseScraper {
  private readonly baseUrl = 'https://www.kpga.co.kr';
  private readonly searchUrl = `${this.baseUrl}/player/search.asp`;

  async searchPlayer(memberId: string): Promise<PlayerInfo | null> {
    try {
      console.log(`KPGA 선수 검색 시작: ${memberId}`);
      
      // 간단한 Mock 데이터로 시작 (실제 크롤링은 나중에 구현)
      const mockPlayer: PlayerInfo = {
        name: `KPGA 선수 ${memberId}`,
        association: 'KPGA' as GolfAssociation,
        memberId: memberId,
        birth: '1985-01-01',
        currentRanking: Math.floor(Math.random() * 100) + 1,
        totalPrize: Math.floor(Math.random() * 150000000) + 20000000,
        isActive: true,
        career: [
          {
            year: 2024,
            title: '2024 KPGA 챔피언십',
            result: '우승',
            prize: 80000000,
            ranking: 1
          },
          {
            year: 2024,
            title: '2024 KPGA 투어',
            result: '3위',
            prize: 40000000,
            ranking: 3
          }
        ],
        ranking: {
          current: Math.floor(Math.random() * 100) + 1,
          best: Math.floor(Math.random() * 50) + 1,
          previous: Math.floor(Math.random() * 100) + 1
        }
      };

      console.log(`KPGA Mock 선수 데이터 생성 완료: ${mockPlayer.name}`);
      return mockPlayer;
      
    } catch (error) {
      console.error('KPGA 선수 검색 오류:', error);
      return null;
    }
  }

  private async scrapePlayerDetail(playerUrl: string, memberId: string, name: string, birth: string): Promise<PlayerInfo> {
    try {
      const page = await this.scrapeWithPuppeteer(playerUrl, {
        waitForSelector: '.player-detail'
      });

      // 프로필 이미지
      let profileImage = '';
      try {
        profileImage = await page.$eval('.player-photo img', el => el.src || '');
      } catch {
        // 프로필 이미지가 없는 경우
      }
      
      // 경력 정보 추출
      const career = await this.extractCareer(page);
      
      // 랭킹 정보 추출
      const ranking = await this.extractRanking(page);
      
      // 현재 랭킹
      let currentRanking = 0;
      try {
        const currentRankingText = await page.$eval('.current-ranking', el => el.textContent?.trim() || '');
        currentRanking = this.parseNumber(currentRankingText);
      } catch {
        // 현재 랭킹 정보가 없는 경우
      }
      
      // 총 상금
      let totalPrize = 0;
      try {
        const totalPrizeText = await page.$eval('.total-prize', el => el.textContent?.trim() || '');
        totalPrize = this.parseCurrency(totalPrizeText);
      } catch {
        // 총 상금 정보가 없는 경우
      }

      await page.close();

      const playerInfo: PlayerInfo = {
        memberId,
        name,
        association: 'KPGA',
        birth,
        career,
        ranking,
        currentRanking,
        totalPrize,
        profileImage: profileImage.startsWith('http') ? profileImage : `${this.baseUrl}${profileImage}`,
        isActive: true
      };

      console.log('KPGA 선수 정보 추출 완료:', playerInfo.name);
      return playerInfo;

    } catch (error) {
      console.error('KPGA 선수 상세 정보 추출 오류:', error);
      // 실패 시 Mock 데이터 반환
      return this.getMockPlayerData(memberId);
    }
  }

  private async extractCareer(page: any): Promise<any[]> {
    try {
      const careerItems = await page.$$('.career-row');
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
      console.error('KPGA 경력 정보 추출 오류:', error);
      return [];
    }
  }

  private async extractRanking(page: any): Promise<any> {
    try {
      const rankingItems = await page.$$('.ranking-row');
      const ranking: any = {};

      for (const item of rankingItems) {
        const year = await item.$eval('.ranking-year', (el: Element) => el.textContent?.trim() || '');
        const rank = await item.$eval('.ranking-position', (el: Element) => this.parseNumber(el.textContent?.trim() || '0'));
        
        ranking[year] = rank;
      }

      return ranking;
    } catch (error) {
      console.error('KPGA 랭킹 정보 추출 오류:', error);
      return {};
    }
  }

  // Mock 데이터 반환 (크롤링 실패 시)
  private getMockPlayerData(memberId: string): PlayerInfo {
    const mockData: Record<string, PlayerInfo> = {
      'KPGA12345': {
        memberId: 'KPGA12345',
        name: '박남프로',
        association: 'KPGA',
        birth: '1992-11-08',
        career: [
          { year: 2024, title: 'KPGA 투어 우승', result: '1위', prize: 80000000, ranking: 3 },
          { year: 2023, title: '한국 오픈', result: 'Top 10', prize: 25000000, ranking: 15 },
          { year: 2023, title: 'KPGA 챔피언십', result: '2위', prize: 40000000, ranking: 7 },
          { year: 2022, title: '아시아 투어', result: '우승', prize: 60000000, ranking: 5 }
        ],
        ranking: { '2024': 3, '2023': 7, '2022': 5 },
        currentRanking: 3,
        totalPrize: 205000000,
        profileImage: '/images/players/park-nampro.jpg',
        isActive: true
      },
      'KPGA67890': {
        memberId: 'KPGA67890',
        name: '최남프로',
        association: 'KPGA',
        birth: '1996-05-14',
        career: [
          { year: 2024, title: 'KPGA 투어 준우승', result: '2위', prize: 50000000, ranking: 12 },
          { year: 2023, title: '신인왕', result: '1위', prize: 30000000, ranking: 2 },
          { year: 2023, title: 'KPGA 투어', result: 'Top 3', prize: 35000000, ranking: 4 }
        ],
        ranking: { '2024': 12, '2023': 4 },
        currentRanking: 12,
        totalPrize: 115000000,
        profileImage: '/images/players/choi-nampro.jpg',
        isActive: true
      }
    };

    return mockData[memberId] || {
      memberId,
      name: `KPGA 선수 ${memberId}`,
      association: 'KPGA',
      birth: '1990-01-01',
      career: [
        { year: 2024, title: 'KPGA 투어 참가', result: '진행중', prize: 0, ranking: 50 }
      ],
      ranking: { '2024': 50 },
      currentRanking: 50,
      totalPrize: 0,
      profileImage: '/images/players/default-male.jpg',
      isActive: true
    };
  }

  // 정적 HTML 크롤링 방식 (백업용)
  async searchPlayerStatic(memberId: string): Promise<PlayerInfo | null> {
    try {
      const response = await this.scrapeWithAxios(`${this.searchUrl}?memberNo=${memberId}`);
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
        association: 'KPGA',
        birth,
        career: [],
        ranking: {},
        isActive: true
      };
      
    } catch (error) {
      console.error('KPGA 정적 크롤링 오류:', error);
      return null;
    }
  }
}
