import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 예정된 대회 목록 조회
// 실제 환경에서는 KPGA/KLPGA 웹사이트에서 크롤링하거나 공식 API를 사용
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    const association = searchParams.get('association') || 'KLPGA';

    console.log(`예정된 대회 조회: ${year}년 ${association}`);

    // Mock 예정된 대회 데이터 생성
    const upcomingTournaments = generateUpcomingTournaments(year, association as 'KPGA' | 'KLPGA');

    return NextResponse.json({
      success: true,
      data: upcomingTournaments,
      year,
      association,
      message: `${upcomingTournaments.length}개의 예정된 대회를 찾았습니다.`
    });

  } catch (error) {
    console.error('예정된 대회 조회 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      data: []
    }, { status: 500 });
  }
}

// Mock 예정된 대회 데이터 생성
function generateUpcomingTournaments(year: string, association: 'KPGA' | 'KLPGA') {
  const currentDate = new Date();
  const currentYear = new Date().getFullYear();
  const selectedYear = parseInt(year);
  
  const tournaments = [];
  
  if (association === 'KLPGA') {
    // KLPGA 예정 대회 (현재 날짜 이후)
    const klpgaTournaments = [
      {
        id: `${year}-klpga-upcoming-001`,
        name: `${year} KLPGA 시즌 개막전`,
        association: 'KLPGA',
        start_date: `${year}-11-15`,
        end_date: `${year}-11-18`,
        location: '제주 핀크스',
        golf_course: '제주 핀크스 골프클럽',
        prize_money: 1000000000, // 10억원
        max_participants: 120,
        status: 'upcoming',
        registration_deadline: `${year}-11-01`,
        description: 'KLPGA 투어 ${year}년 시즌 개막전. 한국 여자 프로골프의 시작을 알리는 대회입니다.'
      },
      {
        id: `${year}-klpga-upcoming-002`,
        name: `${year} 롯데 챔피언십`,
        association: 'KLPGA',
        start_date: `${year}-11-28`,
        end_date: `${year}-12-01`,
        location: '제주 서귀포',
        golf_course: '롯데 스카이힐',
        prize_money: 1500000000, // 15억원
        max_participants: 144,
        status: 'upcoming',
        registration_deadline: `${year}-11-14`,
        description: '롯데그룹이 후원하는 프리미엄 골프 대회. 상금 규모가 큰 메이저 대회입니다.'
      },
      {
        id: `${year}-klpga-upcoming-003`,
        name: `${year} BMW 레이디스 챔피언십`,
        association: 'KLPGA',
        start_date: `${year}-12-12`,
        end_date: `${year}-12-15`,
        location: '인천 송도',
        golf_course: 'BMW 챔피언십 코스',
        prize_money: 1800000000, // 18억원
        max_participants: 100,
        status: 'upcoming',
        registration_deadline: `${year}-11-28`,
        description: 'BMW 코리아가 타이틀 스폰서로 참여하는 프리미엄 대회. 세계 랭킹 포인트 부여.'
      }
    ];
    
    // 내년 대회 추가
    if (selectedYear > currentYear) {
      klpgaTournaments.push(
        {
          id: `${year}-klpga-upcoming-004`,
          name: `${year} 신한동해오픈`,
          association: 'KLPGA',
          start_date: `${year}-04-10`,
          end_date: `${year}-04-13`,
          location: '강원 평창',
          golf_course: '알펜시아 골프클럽',
          prize_money: 800000000,
          max_participants: 120,
          status: 'upcoming',
          registration_deadline: `${year}-03-27`,
          description: '강원도에서 열리는 KLPGA 투어 초중반 대회.'
        },
        {
          id: `${year}-klpga-upcoming-005`,
          name: `${year} 한화클래식`,
          association: 'KLPGA',
          start_date: `${year}-05-22`,
          end_date: `${year}-05-25`,
          location: '인천 영종도',
          golf_course: '스카이72 골프클럽',
          prize_money: 1200000000,
          max_participants: 144,
          status: 'upcoming',
          registration_deadline: `${year}-05-08`,
          description: '한화그룹이 후원하는 전통 있는 KLPGA 대회.'
        }
      );
    }
    
    tournaments.push(...klpgaTournaments);
  } else if (association === 'KPGA') {
    // KPGA 예정 대회
    const kpgaTournaments = [
      {
        id: `${year}-kpga-upcoming-001`,
        name: `${year} KPGA 코리안 투어 챔피언십`,
        association: 'KPGA',
        start_date: `${year}-11-20`,
        end_date: `${year}-11-23`,
        location: '경기 용인',
        golf_course: '레이크우드 컨트리클럽',
        prize_money: 2000000000, // 20억원
        max_participants: 120,
        status: 'upcoming',
        registration_deadline: `${year}-11-06`,
        description: 'KPGA 코리안 투어 최종 챔피언십. 상금왕 확정 대회.'
      },
      {
        id: `${year}-kpga-upcoming-002`,
        name: `${year} 제네시스 챔피언십`,
        association: 'KPGA',
        start_date: `${year}-12-05`,
        end_date: `${year}-12-08`,
        location: '인천 송도',
        golf_course: 'Jack Nicklaus GC Korea',
        prize_money: 2500000000, // 25억원
        max_participants: 78,
        status: 'upcoming',
        registration_deadline: `${year}-11-21`,
        description: '제네시스가 타이틀 스폰서인 프리미엄 대회. 초청 선수만 출전 가능.'
      },
      {
        id: `${year}-kpga-upcoming-003`,
        name: `${year} 현대해상 오픈`,
        association: 'KPGA',
        start_date: `${year}-12-18`,
        end_date: `${year}-12-21`,
        location: '경남 거제',
        golf_course: '거제 베이힐스 골프클럽',
        prize_money: 1000000000,
        max_participants: 132,
        status: 'upcoming',
        registration_deadline: `${year}-12-04`,
        description: '현대해상이 후원하는 연말 대회. 시즌 마지막 대회.'
      }
    ];
    
    // 내년 대회 추가
    if (selectedYear > currentYear) {
      kpgaTournaments.push(
        {
          id: `${year}-kpga-upcoming-004`,
          name: `${year} GS칼텍스 매경오픈`,
          association: 'KPGA',
          start_date: `${year}-04-17`,
          end_date: `${year}-04-20`,
          location: '제주 서귀포',
          golf_course: '나인브릿지',
          prize_money: 1500000000,
          max_participants: 144,
          status: 'upcoming',
          registration_deadline: `${year}-04-03`,
          description: 'GS칼텍스와 매일경제가 공동 주최하는 봄 시즌 메이저 대회.'
        },
        {
          id: `${year}-kpga-upcoming-005`,
          name: `${year} 코리안 오픈`,
          association: 'KPGA',
          start_date: `${year}-06-19`,
          end_date: `${year}-06-22`,
          location: '경기 여주',
          golf_course: '여주 골프클럽',
          prize_money: 1800000000,
          max_participants: 156,
          status: 'upcoming',
          registration_deadline: `${year}-06-05`,
          description: '한국 남자 골프의 가장 권위 있는 내셔널 오픈 대회.'
        }
      );
    }
    
    tournaments.push(...kpgaTournaments);
  }

  // 날짜 기준으로 정렬 (가까운 날짜순)
  return tournaments.sort((a, b) => {
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
  });
}

