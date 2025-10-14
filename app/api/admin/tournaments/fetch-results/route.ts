import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 선택한 대회의 결과 데이터 가져오기
// 실제 환경에서는 KPGA/KLPGA 웹사이트에서 크롤링하거나 공식 API를 사용
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('tournamentId');
    const association = searchParams.get('association') || 'KLPGA';

    if (!tournamentId) {
      return NextResponse.json({
        success: false,
        error: '대회 ID가 필요합니다.'
      }, { status: 400 });
    }

    console.log(`대회 결과 가져오기: ${tournamentId} (${association})`);

    // Mock 대회 결과 데이터 생성
    const mockData = generateMockTournamentResults(tournamentId, association as 'KPGA' | 'KLPGA');

    return NextResponse.json({
      success: true,
      tournament_name: mockData.name,
      raw_data: mockData.results,
      tournamentId,
      association,
      message: '대회 결과를 성공적으로 가져왔습니다.'
    });

  } catch (error) {
    console.error('대회 결과 조회 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
}

// Mock 대회 결과 데이터 생성
function generateMockTournamentResults(tournamentId: string, association: 'KPGA' | 'KLPGA') {
  const year = tournamentId.split('-')[0];
  
  // 대회 이름 추출
  let tournamentName = '';
  if (tournamentId.includes('klpga-001')) {
    tournamentName = `${year} KLPGA 챔피언십`;
  } else if (tournamentId.includes('klpga-002')) {
    tournamentName = `${year} 한화클래식`;
  } else if (tournamentId.includes('klpga-003')) {
    tournamentName = `${year} BMW 레이디스 챔피언십`;
  } else if (tournamentId.includes('kpga-001')) {
    tournamentName = `${year} KPGA 챔피언십`;
  } else if (tournamentId.includes('kpga-002')) {
    tournamentName = `${year} 제네시스 챔피언십`;
  } else {
    tournamentName = `${year} ${association} 대회`;
  }

  // Mock 결과 데이터 생성
  let results = '';
  
  if (association === 'KLPGA') {
    results = `
${tournamentName} 최종 결과

1위 김효주 - 14언더파 (상금 2억원)
2위 박민지 - 12언더파 (상금 1억2천만원)
3위 이정은 - 10언더파 (상금 8천만원)
4위 최혜진 - 8언더파 (상금 6천만원)
5위 전인지 - 6언더파 (상금 4천만원)
6위 박성현 - 4언더파 (상금 3천만원)
7위 김세영 - 2언더파 (상금 2천5백만원)
8위 고진영 - 이븐파 (상금 2천만원)
9위 유소연 - 1오버파 (상금 1천5백만원)
10위 안선주 - 2오버파 (상금 1천만원)
11위 최민 - 3오버파 (상금 8백만원)
12위 장하나 - 4오버파 (상금 7백만원)
13위 김민선 - 5오버파 (상금 6백만원)
14위 박지영 - 6오버파 (상금 5백만원)
15위 임희정 - 7오버파 (상금 4백만원)
`;
  } else {
    results = `
${tournamentName} 최종 결과

1위 김시우 - 16언더파 (상금 3억원)
2위 안병훈 - 14언더파 (상금 1억8천만원)
3위 김주형 - 12언더파 (상금 1억2천만원)
4위 임성재 - 10언더파 (상금 9천만원)
5위 강경남 - 8언더파 (상금 6천만원)
6위 김한별 - 6언더파 (상금 4천5백만원)
7위 이경훈 - 4언더파 (상금 3천5백만원)
8위 박상현 - 2언더파 (상금 2천8백만원)
9위 김태훈 - 이븐파 (상금 2천2백만원)
10위 노승열 - 1오버파 (상금 1천8백만원)
11위 함정우 - 2오버파 (상금 1천5백만원)
12위 최민철 - 3오버파 (상금 1천2백만원)
13위 박은신 - 4오버파 (상금 1천만원)
14위 이수민 - 5오버파 (상금 8백만원)
15위 원우영 - 6오버파 (상금 6백만원)
`;
  }

  return {
    name: tournamentName,
    results: results.trim()
  };
}

// POST 메서드: 실제 KPGA/KLPGA 웹사이트에서 크롤링
// 향후 구현 예정
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, association } = body;

    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL이 필요합니다.'
      }, { status: 400 });
    }

    // TODO: 실제 웹 크롤링 구현
    // const crawledData = await crawlTournamentResults(url, association);

    return NextResponse.json({
      success: false,
      error: '웹 크롤링 기능은 아직 구현되지 않았습니다.',
      message: 'Mock 데이터를 사용해주세요.'
    }, { status: 501 });

  } catch (error) {
    console.error('대회 결과 크롤링 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
}

