import { KLPGAscraper } from './klpga';
import { KPGAscraper } from './kpga';
import { PlayerInfo, GolfAssociation } from '@/types';

export class PlayerScraper {
  private klpgaScraper: KLPGAscraper;
  private kpgaScraper: KPGAscraper;
  private cache: Map<string, PlayerInfo> = new Map();

  constructor() {
    this.klpgaScraper = new KLPGAscraper();
    this.kpgaScraper = new KPGAscraper();
  }

  async searchPlayer(memberId: string, association: GolfAssociation): Promise<PlayerInfo | null> {
    const cacheKey = `${association}_${memberId}`;
    
    // 캐시에서 먼저 확인
    if (this.cache.has(cacheKey)) {
      console.log(`캐시에서 선수 정보 반환: ${memberId}`);
      return this.cache.get(cacheKey)!;
    }

    try {
      let playerInfo: PlayerInfo | null = null;

      switch (association) {
        case 'KLPGA':
          playerInfo = await this.klpgaScraper.searchPlayer(memberId);
          break;
        case 'KPGA':
          playerInfo = await this.kpgaScraper.searchPlayer(memberId);
          break;
        default:
          throw new Error(`지원하지 않는 협회: ${association}`);
      }

      // 캐시에 저장 (1시간 유효)
      if (playerInfo) {
        this.cache.set(cacheKey, playerInfo);
        setTimeout(() => {
          this.cache.delete(cacheKey);
        }, 60 * 60 * 1000); // 1시간 후 캐시 삭제
      }

      return playerInfo;

    } catch (error) {
      console.error('선수 정보 검색 오류:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.klpgaScraper.closeBrowser();
      await this.kpgaScraper.closeBrowser();
    } catch (error) {
      console.error('스크래퍼 정리 오류:', error);
    }
  }

  // 캐시 상태 확인
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // 캐시 클리어
  clearCache(): void {
    this.cache.clear();
  }
}

// 싱글톤 인스턴스
export const playerScraper = new PlayerScraper();
