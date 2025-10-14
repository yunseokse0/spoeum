import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// KPGA/KLPGA 대회 목록 조회 - Gemini API 사용
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    const association = searchParams.get('association') || 'KLPGA';

    console.log(`Gemini API로 대회 목록 조회: ${year}년 ${association}`);

    // Gemini API 키 확인
    if (!process.env.GEMINI_API_KEY) {
      console.log('Gemini API 키가 없어 Mock 데이터 사용');
      const mockTournaments = generateMockTournaments(year, association as 'KPGA' | 'KLPGA');
      return NextResponse.json({
        success: true,
        data: mockTournaments,
        year,
        association,
        message: `Mock 데이터: ${mockTournaments.length}개의 대회를 찾았습니다.`
      });
    }

    // Gemini API를 통한 대회 정보 조회
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
${year}년 ${association} 골프 대회 일정과 정보를 알려주세요.
다음 정보를 포함한 JSON 형태로 응답해주세요:

{
  "tournaments": [
    {
      "id": "고유ID",
      "name": "대회명",
      "association": "${association}",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD", 
      "location": "장소",
      "golf_course": "골프장명",
      "prize_money": 상금숫자,
      "max_participants": 참가자수,
      "status": "upcoming",
      "description": "대회 설명"
    }
  ]
}

실제 ${association} 공식 대회 정보를 바탕으로 최대 10개의 대회 정보를 제공해주세요.
상금은 숫자로만 표시하고, 날짜는 YYYY-MM-DD 형식으로 해주세요.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini API 응답:', text);

    // JSON 파싱
    let geminiData;
    try {
      // JSON 부분만 추출
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        geminiData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON 형식을 찾을 수 없습니다');
      }
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      console.log('원본 응답:', text);
      
      // 파싱 실패 시 Mock 데이터 사용
      const mockTournaments = generateMockTournaments(year, association as 'KPGA' | 'KLPGA');
      return NextResponse.json({
        success: true,
        data: mockTournaments,
        year,
        association,
        message: `Gemini 파싱 실패로 Mock 데이터 사용: ${mockTournaments.length}개의 대회를 찾았습니다.`
      });
    }

    const tournaments = geminiData.tournaments || [];
    
    return NextResponse.json({
      success: true,
      data: tournaments,
      year,
      association,
      message: `Gemini API: ${tournaments.length}개의 대회를 찾았습니다.`
    });

  } catch (error) {
    console.error('대회 목록 조회 오류:', error);
    
    // 오류 발생 시 Mock 데이터 반환
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    const association = searchParams.get('association') || 'KLPGA';
    
    const mockTournaments = generateMockTournaments(year, association as 'KPGA' | 'KLPGA');
    
    return NextResponse.json({
      success: true,
      data: mockTournaments,
      year,
      association,
      message: `오류로 인해 Mock 데이터 사용: ${mockTournaments.length}개의 대회를 찾았습니다.`,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
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

