import { NextRequest, NextResponse } from 'next/server';
import { PlayerSearchResponse, PlayerInfo, PlayerCareer } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { association: string; memberId: string } }
) {
  try {
    const { association, memberId } = params;

    // 협회 유효성 검사
    if (!['KLPGA', 'KPGA'].includes(association)) {
      return NextResponse.json<PlayerSearchResponse>({
        success: false,
        error: '지원하지 않는 협회입니다. KLPGA 또는 KPGA를 선택해주세요.'
      }, { status: 400 });
    }

    // Mock 선수 데이터 생성
    const mockPlayers: Record<string, PlayerInfo> = {
      // KLPGA 선수들
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
      },
      // KPGA 선수들
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

    // 회원번호로 선수 정보 찾기
    const playerInfo = mockPlayers[memberId];

    if (!playerInfo) {
      return NextResponse.json<PlayerSearchResponse>({
        success: false,
        error: '해당 회원번호의 선수를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    console.log(`Mock 선수 정보 조회 성공: ${playerInfo.name} (${playerInfo.association})`);

    return NextResponse.json<PlayerSearchResponse>({
      success: true,
      data: playerInfo,
      cached: false
    });

  } catch (error) {
    console.error('선수 정보 조회 오류:', error);
    return NextResponse.json<PlayerSearchResponse>({
      success: false,
      error: '선수 정보 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}
