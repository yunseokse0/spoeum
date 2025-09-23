import { BaseScraper } from './base';
import { PlayerInfo, GolfAssociation } from '@/types';
import * as cheerio from 'cheerio';

export class NaverGolfScraper extends BaseScraper {
  private readonly baseUrl = 'https://sports.naver.com/golf';
  private readonly klpgaRankingUrl = `${this.baseUrl}/player/ranking?category=klpga`;
  private readonly kpgaRankingUrl = `${this.baseUrl}/player/ranking?category=kpga`;

  // KLPGA 선수 랭킹 크롤링
  async scrapeKLPGARanking(): Promise<PlayerInfo[]> {
    try {
      console.log('네이버 스포츠 KLPGA 랭킹 크롤링 시작...');
      
      const response = await this.scrapeWithAxios(this.klpgaRankingUrl);
      const players = this.parseNaverGolfRanking(response.data, 'KLPGA');
      
      console.log(`네이버 스포츠 KLPGA 랭킹 크롤링 완료: ${players.length}명`);
      return players;
    } catch (error) {
      console.error('네이버 스포츠 KLPGA 랭킹 크롤링 오류:', error);
      return [];
    }
  }

  // KPGA 선수 랭킹 크롤링
  async scrapeKPGARanking(): Promise<PlayerInfo[]> {
    try {
      console.log('네이버 스포츠 KPGA 랭킹 크롤링 시작...');
      
      const response = await this.scrapeWithAxios(this.kpgaRankingUrl);
      const players = this.parseNaverGolfRanking(response.data, 'KPGA');
      
      console.log(`네이버 스포츠 KPGA 랭킹 크롤링 완료: ${players.length}명`);
      return players;
    } catch (error) {
      console.error('네이버 스포츠 KPGA 랭킹 크롤링 오류:', error);
      return [];
    }
  }

  // 네이버 골프 랭킹 파싱
  private parseNaverGolfRanking(html: string, association: GolfAssociation): PlayerInfo[] {
    try {
      const $ = cheerio.load(html);
      const players: PlayerInfo[] = [];

      // 랭킹 테이블에서 선수 정보 추출
      $('.ranking_table tbody tr, .player_list .player_item, [class*="ranking"] tr').each((i, el) => {
        try {
          const $el = $(el);
          const $cells = $el.find('td');
          
          if ($cells.length < 3) return; // 최소 3개 컬럼 필요

          // 선수 기본 정보 추출
          const name = $cells.eq(1).text().trim() || $el.find('.player_name, .name').text().trim();
          const ranking = this.parseRanking($cells.eq(0).text().trim());
          const prize = this.parsePrizeAmount($cells.eq(2).text().trim());
          
          if (name && name.length > 1) {
            const memberId = this.generateMemberId(name, association);
            
            const player: PlayerInfo = {
              memberId,
              name,
              association,
              birth: '1990-01-01', // 기본값
              career: [{
                year: new Date().getFullYear(),
                title: `${new Date().getFullYear()} ${association} 투어`,
                result: '진행중',
                prize: prize,
                ranking: ranking
              }],
              ranking: {
                current: ranking,
                best: ranking,
                worst: ranking
              },
              currentRanking: ranking,
              totalPrize: prize,
              isActive: true
            };

            players.push(player);
          }
        } catch (error) {
          console.error(`네이버 골프 선수 ${i} 파싱 오류:`, error);
        }
      });

      return players;
    } catch (error) {
      console.error('네이버 골프 랭킹 파싱 오류:', error);
      return [];
    }
  }

  // 회원번호 생성
  private generateMemberId(name: string, association: GolfAssociation): string {
    const prefix = association === 'KLPGA' ? 'KLPGA' : 'KPGA';
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `${prefix}${Math.abs(hash).toString().padStart(5, '0')}`;
  }

  // 랭킹 파싱
  private parseRanking(text: string): number {
    if (!text) return 0;
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  // 상금 파싱
  private parsePrizeAmount(text: string): number {
    if (!text) return 0;
    const match = text.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  }
}
