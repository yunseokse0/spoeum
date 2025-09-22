import { BaseScraper, ScrapingOptions } from './base';
import { PlayerInfo, GolfAssociation } from '@/types';

export class KLPGAscraper extends BaseScraper {
  private readonly baseUrl = 'https://www.klpga.co.kr';
  private readonly searchUrl = `${this.baseUrl}/web/player/player_search.asp`;

  async searchPlayer(memberId: string): Promise<PlayerInfo | null> {
    try {
      console.log(`KLPGA 선수 검색 시작: ${memberId}`);
      
      // 1단계: 검색 페이지에서 선수 목록 가져오기
      const searchPage = await this.scrapeWithPuppeteer(this.searchUrl, {
        waitForSelector: '.search-form'
      });

      // 검색 폼에 회원번호 입력
      await searchPage.type('#member_id', memberId);
      await searchPage.click('.search-btn');
      
      // 검색 결과 대기
      await this.delay(2000);
      
      // 검색 결과 확인
      const searchResults = await searchPage.$$('.player-item');
      
      if (searchResults.length === 0) {
        await searchPage.close();
        console.log('KLPGA: 검색 결과 없음');
        return null;
      }

      // 첫 번째 결과 클릭
      const firstResult = searchResults[0];
      const playerLink = await firstResult.$eval('a', el => el.href);
      
      await searchPage.close();

      // 2단계: 선수 상세 페이지 스크래핑
      return await this.scrapePlayerDetail(playerLink, memberId);
      
    } catch (error) {
      console.error('KLPGA 선수 검색 오류:', error);
      throw error;
    }
  }

  private async scrapePlayerDetail(playerUrl: string, memberId: string): Promise<PlayerInfo> {
    try {
      const page = await this.scrapeWithPuppeteer(playerUrl, {
        waitForSelector: '.player-profile'
      });

      // 기본 정보 추출
      const name = await page.$eval('.player-name', el => el.textContent?.trim() || '');
      const birthText = await page.$eval('.player-birth', el => el.textContent?.trim() || '');
      const birth = this.parseDate(birthText);
      
      // 프로필 이미지
      const profileImage = await page.$eval('.player-photo img', el => el.src || '');

      // 경력 정보 추출
      const career = await this.extractCareer(page);
      
      // 랭킹 정보 추출
      const ranking = await this.extractRanking(page);
      
      // 현재 랭킹
      const currentRankingText = await page.$eval('.current-ranking', el => el.textContent?.trim() || '');
      const currentRanking = this.parseNumber(currentRankingText);
      
      // 총 상금
      const totalPrizeText = await page.$eval('.total-prize', el => el.textContent?.trim() || '');
      const totalPrize = this.parseCurrency(totalPrizeText);

      await page.close();

      const playerInfo: PlayerInfo = {
        memberId,
        name,
        association: 'KLPGA',
        birth,
        career,
        ranking,
        currentRanking,
        totalPrize,
        profileImage: profileImage.startsWith('http') ? profileImage : `${this.baseUrl}${profileImage}`,
        isActive: true
      };

      console.log('KLPGA 선수 정보 추출 완료:', playerInfo.name);
      return playerInfo;

    } catch (error) {
      console.error('KLPGA 선수 상세 정보 추출 오류:', error);
      throw error;
    }
  }

  private async extractCareer(page: any): Promise<any[]> {
    try {
      const careerItems = await page.$$('.career-item');
      const career = [];

      for (const item of careerItems) {
        const year = await item.$eval('.career-year', el => parseInt(el.textContent?.trim() || '0'));
        const title = await item.$eval('.career-title', el => el.textContent?.trim() || '');
        const result = await item.$eval('.career-result', el => el.textContent?.trim() || '');
        
        let prize = 0;
        try {
          const prizeText = await item.$eval('.career-prize', el => el.textContent?.trim() || '');
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
        const year = await item.$eval('.ranking-year', el => el.textContent?.trim() || '');
        const rank = await item.$eval('.ranking-position', el => this.parseNumber(el.textContent?.trim() || '0'));
        
        ranking[year] = rank;
      }

      return ranking;
    } catch (error) {
      console.error('KLPGA 랭킹 정보 추출 오류:', error);
      return {};
    }
  }

  // 정적 HTML 크롤링 방식 (백업용)
  async searchPlayerStatic(memberId: string): Promise<PlayerInfo | null> {
    try {
      const $ = await this.scrapeWithAxios(`${this.searchUrl}?member_id=${memberId}`);
      
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
