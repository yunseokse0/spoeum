import { BaseScraper, ScrapingOptions } from './base';
import { PlayerInfo, GolfAssociation } from '@/types';

export class KPGAscraper extends BaseScraper {
  private readonly baseUrl = 'https://www.kpga.co.kr';
  private readonly searchUrl = `${this.baseUrl}/player/search.asp`;

  async searchPlayer(memberId: string): Promise<PlayerInfo | null> {
    try {
      console.log(`KPGA 선수 검색 시작: ${memberId}`);
      
      // 1단계: 검색 페이지에서 선수 정보 가져오기
      const page = await this.scrapeWithPuppeteer(this.searchUrl, {
        waitForSelector: '.search-container'
      });

      // 검색 폼에 회원번호 입력
      await page.type('#memberNo', memberId);
      await page.click('#searchBtn');
      
      // 검색 결과 대기
      await this.delay(3000);
      
      // 검색 결과 확인
      const searchResults = await page.$$('.player-row');
      
      if (searchResults.length === 0) {
        await page.close();
        console.log('KPGA: 검색 결과 없음');
        return null;
      }

      // 첫 번째 결과에서 선수 정보 추출
      const firstResult = searchResults[0];
      
      // 선수 기본 정보 추출
      const name = await firstResult.$eval('.player-name', el => el.textContent?.trim() || '');
      const birthText = await firstResult.$eval('.player-birth', el => el.textContent?.trim() || '');
      const birth = this.parseDate(birthText);
      
      // 선수 상세 페이지 링크 확인
      let detailUrl = '';
      try {
        detailUrl = await firstResult.$eval('a', el => el.href);
      } catch {
        // 상세 페이지 링크가 없는 경우
      }

      await page.close();

      // 2단계: 선수 상세 페이지 스크래핑 (링크가 있는 경우)
      if (detailUrl) {
        return await this.scrapePlayerDetail(detailUrl, memberId, name, birth);
      } else {
        // 기본 정보만으로 PlayerInfo 생성
        return {
          memberId,
          name,
          association: 'KPGA',
          birth,
          career: [],
          ranking: {},
          isActive: true
        };
      }
      
    } catch (error) {
      console.error('KPGA 선수 검색 오류:', error);
      throw error;
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
      // 상세 정보 추출 실패 시 기본 정보만 반환
      return {
        memberId,
        name,
        association: 'KPGA',
        birth,
        career: [],
        ranking: {},
        isActive: true
      };
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

  // 정적 HTML 크롤링 방식 (백업용)
  async searchPlayerStatic(memberId: string): Promise<PlayerInfo | null> {
    try {
      const $ = await this.scrapeWithAxios(`${this.searchUrl}?memberNo=${memberId}`);
      
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
