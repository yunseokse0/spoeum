// KLPGA 웹사이트 스크래핑 유틸리티

/**
 * HTML 가져오기
 */
export async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('HTML 가져오기 실패:', error);
    throw error;
  }
}

/**
 * KLPGA 선수 목록 가져오기
 */
export async function getKLPGAPlayerList(season: string): Promise<string[]> {
  try {
    const url = `https://www.klpga.co.kr/web/player/list.do?season=${season}`;
    const html = await fetchHTML(url);
    
    // playerId를 추출하는 정규식
    const playerIdRegex = /playerId=(\d+)/g;
    const ids = new Set<string>();
    
    let match;
    while ((match = playerIdRegex.exec(html)) !== null) {
      ids.add(match[1]);
    }
    
    return Array.from(ids);
  } catch (error) {
    console.error('선수 목록 가져오기 실패:', error);
    throw error;
  }
}

/**
 * KPGA 선수 목록 가져오기 (필요시 확장)
 */
export async function getKPGAPlayerList(season: string): Promise<string[]> {
  // KPGA 구현 필요
  return [];
}

