import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.geminiAPI || '');

// KPGA/KLPGA 대회 목록 조회 - Gemini API 사용
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    const association = searchParams.get('association') || 'KLPGA';

    console.log(`Gemini API로 대회 목록 조회: ${year}년 ${association}`);
    console.log('환경변수 확인:', {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '설정됨' : '설정되지 않음',
      geminiAPI: process.env.geminiAPI ? '설정됨' : '설정되지 않음'
    });

    // Gemini API 키 확인
    const apiKey = process.env.GEMINI_API_KEY || process.env.geminiAPI;
    if (!apiKey) {
      console.error('Gemini API 키가 설정되지 않았습니다.');
      return NextResponse.json({
        success: false,
        error: 'Gemini API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.',
        data: []
      }, { status: 500 });
    }

    // Gemini API를 통한 대회 정보 조회 (최대 5번 호출)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const allTournaments: any[] = [];
    const maxAttempts = 5;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`=== Gemini API 호출 시도 ${attempt}/${maxAttempts} ===`);
      
      const prompt = `
당신은 한국 골프 대회 전문가입니다. ${year}년 ${association}에서 주최하는 **공식 대회** 정보를 제공해주세요.

**호출 번호**: ${attempt}/${maxAttempts}

**응답 형식**: 반드시 아래 JSON 형식으로만 응답하세요. 다른 설명이나 텍스트는 절대 포함하지 마세요.

{
  "tournaments": [
    {
      "id": "고유식별자",
      "name": "정확한 대회명",
      "association": "${association}",
      "start_date": "${year}-MM-DD",
      "end_date": "${year}-MM-DD",
      "location": "시/도명",
      "golf_course": "정확한 골프장 이름",
      "prize_money": 숫자,
      "max_participants": 숫자,
      "status": "upcoming",
      "description": "대회 설명"
    }
  ]
}

**${association} 대회 예시** (참고용):
${association === 'KLPGA' ? `
- 한화클래식, BMW 레이디스 챔피언십, 롯데 챔피언십, 신한동해오픈, KLPGA 챔피언십, 하이트진로 챔피언십, 롯데 오픈
` : `
- 제네시스 챔피언십, 코리안 오픈, GS칼텍스 매경오픈, 현대해상 오픈, KPGA 코리안 투어 챔피언십, KPGA 챔피언십
`}

**필수 요구사항**:
1. **날짜**: ${year}-MM-DD 형식 (예: ${year}-03-15)
2. **골프장**: 구체적인 골프장 이름 (예: "제주 핀크스 골프클럽", "스카이72 골프클럽")
3. **상금**: 실제 상금 규모 (5억원~25억원 범위)
4. **참가자**: 현실적인 참가자 수 (120~156명)
5. **지역**: 골프장이 위치한 시/도
6. **대회 수**: 각 호출마다 2-3개의 서로 다른 대회 정보 제공

**중복 방지**: 이전에 제공한 대회와 중복되지 않는 새로운 대회 정보를 제공하세요.
`;

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`=== Gemini API 응답 ${attempt} 시작 ===`);
        console.log('응답 길이:', text.length);
        console.log('응답 내용:', text);
        console.log(`=== Gemini API 응답 ${attempt} 끝 ===`);

        // JSON 파싱
        let geminiData;
        try {
          const jsonMatch = text.match(/\{[\s\S]*"tournaments"[\s\S]*\}/);
          if (jsonMatch) {
            geminiData = JSON.parse(jsonMatch[0]);
            console.log(`파싱된 데이터 ${attempt}:`, JSON.stringify(geminiData, null, 2));
          } else {
            const fullJsonMatch = text.match(/\{[\s\S]*\}/);
            if (fullJsonMatch) {
              geminiData = JSON.parse(fullJsonMatch[0]);
              console.log(`전체 텍스트에서 파싱된 데이터 ${attempt}:`, JSON.stringify(geminiData, null, 2));
            } else {
              throw new Error('JSON 형식을 찾을 수 없습니다');
            }
          }
        } catch (parseError) {
          console.error(`JSON 파싱 오류 ${attempt}:`, parseError);
          continue; // 다음 시도로 넘어감
        }

        const tournaments = geminiData.tournaments || [];
        
        // 중복 제거를 위해 기존 대회와 비교
        const newTournaments = tournaments.filter((newTournament: any) => {
          return !allTournaments.some(existing => 
            existing.name === newTournament.name || 
            existing.id === newTournament.id
          );
        });
        
        allTournaments.push(...newTournaments);
        console.log(`${attempt}번째 호출에서 ${newTournaments.length}개의 새 대회 추가. 총 ${allTournaments.length}개`);
        
        // 충분한 대회를 수집했으면 중단
        if (allTournaments.length >= 8) {
          console.log('충분한 대회 수집 완료, API 호출 중단');
          break;
        }
        
        // API 호출 간 간격 (Rate Limiting 방지)
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`Gemini API 호출 오류 ${attempt}:`, error);
        continue; // 다음 시도로 넘어감
      }
    }

    const tournaments = allTournaments;
    
    // 대회가 하나도 없으면 기본 Mock 데이터 반환
    if (tournaments.length === 0) {
      console.log('Gemini API에서 대회를 가져오지 못해 기본 데이터 반환');
      const fallbackTournaments = [
        {
          id: `${year}-${association.toLowerCase()}-001`,
          name: `${year} ${association} 시즌 개막전`,
          association: association,
          start_date: `${year}-03-15`,
          end_date: `${year}-03-18`,
          location: '제주',
          golf_course: '제주 핀크스 골프클럽',
          prize_money: 1000000000,
          max_participants: 120,
          status: 'upcoming',
          description: `${association} 투어 ${year}년 시즌 개막전`
        },
        {
          id: `${year}-${association.toLowerCase()}-002`,
          name: `${year} ${association} 챔피언십`,
          association: association,
          start_date: `${year}-10-15`,
          end_date: `${year}-10-18`,
          location: '경기',
          golf_course: '스카이72 골프클럽',
          prize_money: 1500000000,
          max_participants: 144,
          status: 'upcoming',
          description: `${association} 최고 권위 대회`
        },
        {
          id: `${year}-${association.toLowerCase()}-003`,
          name: `${year} ${association} 마스터즈`,
          association: association,
          start_date: `${year}-11-20`,
          end_date: `${year}-11-23`,
          location: '인천',
          golf_course: '나인브릿지',
          prize_money: 2000000000,
          max_participants: 156,
          status: 'upcoming',
          description: `${association} 마스터즈 대회`
        }
      ];
      
      return NextResponse.json({
        success: true,
        data: fallbackTournaments,
        year,
        association,
        message: `기본 데이터: ${fallbackTournaments.length}개의 대회를 표시합니다.`
      });
    }
    
    return NextResponse.json({
      success: true,
      data: tournaments,
      year,
      association,
      message: `Gemini API: ${tournaments.length}개의 대회를 찾았습니다.`
    });

  } catch (error) {
    console.error('Gemini API 호출 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: `Gemini API 호출 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      data: []
    }, { status: 500 });
  }
}


