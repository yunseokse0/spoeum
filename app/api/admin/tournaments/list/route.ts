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
당신은 한국 골프 대회 전문가입니다. ${year}년 ${association} 골프 대회 정보를 정확히 제공해주세요.

**응답 형식**: 반드시 아래 JSON 형식으로만 응답하세요. 다른 설명이나 텍스트는 절대 포함하지 마세요.

{
  "tournaments": [
    {
      "id": "고유식별자",
      "name": "대회명",
      "association": "${association}",
      "start_date": "${year}-MM-DD",
      "end_date": "${year}-MM-DD",
      "location": "시/도명",
      "golf_course": "골프장 정확한 이름",
      "prize_money": 숫자,
      "max_participants": 숫자,
      "status": "upcoming",
      "description": "대회 간단 설명"
    }
  ]
}

**필수 요구사항**:
1. **날짜 형식**: start_date와 end_date는 반드시 "${year}-MM-DD" 형식 (예: "${year}-11-15")
2. **골프장 이름**: golf_course는 구체적이고 정확한 골프장 이름 (예: "제주 핀크스 골프클럽", "스카이72 골프클럽", "나인브릿지", "레이크우드 컨트리클럽")
3. **상금**: prize_money는 숫자만 (예: 1000000000, 1500000000, 2000000000)
4. **지역**: location은 시/도 단위 (예: "제주", "인천", "경기", "부산", "강원")
5. **참가자 수**: max_participants는 현실적인 숫자 (예: 120, 144, 156)
6. **대회 수**: 최대 8개의 실제 ${association} 대회 정보 제공

**실제 대회 예시** (참고용):
- KLPGA: 한화클래식, BMW 레이디스 챔피언십, 롯데 챔피언십, 신한동해오픈
- KPGA: 제네시스 챔피언십, 코리안 오픈, GS칼텍스 매경오픈, 현대해상 오픈

**응답 예시**:
{
  "tournaments": [
    {
      "id": "${year.toLowerCase()}-${association.toLowerCase()}-001",
      "name": "${year} ${association} 시즌 개막전",
      "association": "${association}",
      "start_date": "${year}-03-15",
      "end_date": "${year}-03-18",
      "location": "제주",
      "golf_course": "제주 핀크스 골프클럽",
      "prize_money": 1000000000,
      "max_participants": 120,
      "status": "upcoming",
      "description": "${association} 투어 ${year}년 시즌 개막전"
    }
  ]
}
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

