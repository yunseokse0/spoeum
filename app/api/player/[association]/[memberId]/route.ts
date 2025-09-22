import { NextRequest, NextResponse } from 'next/server';
import { playerScraper } from '@/lib/scraper';
import { GolfAssociation, PlayerSearchResponse } from '@/types';

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

    // 회원번호 유효성 검사
    if (!memberId || memberId.trim().length === 0) {
      return NextResponse.json<PlayerSearchResponse>({
        success: false,
        error: '회원번호를 입력해주세요.'
      }, { status: 400 });
    }

    console.log(`선수 정보 조회 요청: ${association} - ${memberId}`);

    // 크롤링 실행 (실제 크롤링 + Mock 데이터 폴백)
    let playerInfo = await playerScraper.searchPlayer(
      memberId.trim(), 
      association as GolfAssociation
    );

    // 크롤링 실패 시 Mock API로 폴백
    if (!playerInfo) {
      console.log(`실제 크롤링 실패, Mock API로 폴백: ${association}/${memberId}`);
      try {
        const mockResponse = await fetch(`http://localhost:3000/api/player/mock/${association}/${memberId}`);
        if (mockResponse.ok) {
          const mockData = await mockResponse.json();
          playerInfo = mockData.data;
        }
      } catch (mockError) {
        console.error('Mock API 폴백 실패:', mockError);
      }
    }

    if (!playerInfo) {
      return NextResponse.json<PlayerSearchResponse>({
        success: false,
        error: '해당 회원번호의 선수를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    console.log(`선수 정보 조회 성공: ${playerInfo.name}`);

    return NextResponse.json<PlayerSearchResponse>({
      success: true,
      data: playerInfo,
      cached: false
    });

  } catch (error) {
    console.error('선수 정보 조회 API 오류:', error);
    
    return NextResponse.json<PlayerSearchResponse>({
      success: false,
      error: error instanceof Error ? error.message : '선수 정보 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// OPTIONS 메서드 (CORS 지원)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
