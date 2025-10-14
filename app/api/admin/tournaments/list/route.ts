import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// KPGA/KLPGA 대회 목록 조회
// 실제 환경에서는 KPGA/KLPGA 웹사이트에서 크롤링하거나 공식 API를 사용
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    const association = searchParams.get('association') || 'KLPGA';

    console.log(`대회 목록 조회: ${year}년 ${association}`);

    // Mock 데이터 (실제로는 크롤링 또는 API 호출)
    const mockTournaments = generateMockTournaments(year, association as 'KPGA' | 'KLPGA');

    return NextResponse.json({
      success: true,
      data: mockTournaments,
      year,
      association,
      message: `${mockTournaments.length}개의 대회를 찾았습니다.`
    });

  } catch (error) {
    console.error('대회 목록 조회 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      data: []
    }, { status: 500 });
  }
}

// Mock 대회 데이터 생성
function generateMockTournaments(year: string, association: 'KPGA' | 'KLPGA') {
  const tournaments = [];
  
  if (association === 'KLPGA') {
    // KLPGA 대회 목록 (2024년 기준 실제 대회 일부)
    tournaments.push(
      {
        id: `${year}-klpga-001`,
        name: `${year} KLPGA 챔피언십`,
        date: `${year}-10-15`,
        location: '여주',
        prize: '10억원',
        url: 'https://www.klpga.co.kr'
      },
      {
        id: `${year}-klpga-002`,
        name: `${year} 한화클래식`,
        date: `${year}-09-20`,
        location: '인천',
        prize: '8억원',
        url: 'https://www.klpga.co.kr'
      },
      {
        id: `${year}-klpga-003`,
        name: `${year} BMW 레이디스 챔피언십`,
        date: `${year}-08-25`,
        location: '제주',
        prize: '12억원',
        url: 'https://www.klpga.co.kr'
      },
      {
        id: `${year}-klpga-004`,
        name: `${year} 하이트진로 챔피언십`,
        date: `${year}-07-15`,
        location: '인천',
        prize: '7억원',
        url: 'https://www.klpga.co.kr'
      },
      {
        id: `${year}-klpga-005`,
        name: `${year} 롯데 오픈`,
        date: `${year}-06-10`,
        location: '제주',
        prize: '9억원',
        url: 'https://www.klpga.co.kr'
      }
    );
  } else if (association === 'KPGA') {
    // KPGA 대회 목록
    tournaments.push(
      {
        id: `${year}-kpga-001`,
        name: `${year} KPGA 챔피언십`,
        date: `${year}-10-20`,
        location: '용인',
        prize: '15억원',
        url: 'https://www.kpga.co.kr'
      },
      {
        id: `${year}-kpga-002`,
        name: `${year} 제네시스 챔피언십`,
        date: `${year}-09-25`,
        location: '인천',
        prize: '12억원',
        url: 'https://www.kpga.co.kr'
      },
      {
        id: `${year}-kpga-003`,
        name: `${year} 코리안 오픈`,
        date: `${year}-08-30`,
        location: '여주',
        prize: '10억원',
        url: 'https://www.kpga.co.kr'
      },
      {
        id: `${year}-kpga-004`,
        name: `${year} 현대해상 오픈`,
        date: `${year}-07-20`,
        location: '부산',
        prize: '8억원',
        url: 'https://www.kpga.co.kr'
      },
      {
        id: `${year}-kpga-005`,
        name: `${year} GS칼텍스 매경 오픈`,
        date: `${year}-06-15`,
        location: '제주',
        prize: '11억원',
        url: 'https://www.kpga.co.kr'
      }
    );
  }

  return tournaments;
}

