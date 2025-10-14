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
    
    // Vercel 환경에서는 Mock 데이터 반환 (504 Timeout 방지)
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      console.log('Vercel 환경 감지, Mock 데이터 반환');
      
      const mockTournaments = [
        {
          id: `${association.toLowerCase()}-${year}-1`,
          name: `${year} ${association} 챔피언십`,
          association,
          start_date: `${year}-03-15`,
          end_date: `${year}-03-17`,
          location: '경기도',
          golf_course: '스카이72 골프클럽',
          prize_money: 1500000000,
          max_participants: 132,
          status: 'upcoming',
          description: `${association} 메이저 대회`
        },
        {
          id: `${association.toLowerCase()}-${year}-2`,
          name: `${year} ${association} 오픈`,
          association,
          start_date: `${year}-04-10`,
          end_date: `${year}-04-13`,
          location: '제주도',
          golf_course: '핀크스 골프클럽',
          prize_money: 2000000000,
          max_participants: 144,
          status: 'upcoming',
          description: `${association} 정규투어 대회`
        },
        {
          id: `${association.toLowerCase()}-${year}-3`,
          name: `${year} ${association} 클래식`,
          association,
          start_date: `${year}-05-20`,
          end_date: `${year}-05-22`,
          location: '강원도',
          golf_course: '오크밸리 컨트리클럽',
          prize_money: 1200000000,
          max_participants: 120,
          status: 'upcoming',
          description: `${association} 투어 대회`
        },
        {
          id: `${association.toLowerCase()}-${year}-4`,
          name: `${year} ${association} 투어`,
          association,
          start_date: `${year}-06-15`,
          end_date: `${year}-06-18`,
          location: '경상남도',
          golf_course: '거제 드비치 골프클럽',
          prize_money: 1800000000,
          max_participants: 128,
          status: 'upcoming',
          description: `${association} 투어 대회`
        },
        {
          id: `${association.toLowerCase()}-${year}-5`,
          name: `${year} ${association} 프리미어`,
          association,
          start_date: `${year}-07-20`,
          end_date: `${year}-07-23`,
          location: '경기도',
          golf_course: '남촌 컨트리클럽',
          prize_money: 2200000000,
          max_participants: 156,
          status: 'upcoming',
          description: `${association} 프리미어 대회`
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockTournaments,
        association,
        message: `Vercel 환경: ${mockTournaments.length}개의 대회를 제공합니다.`
      });
    }

    console.log('환경변수 확인:', {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '설정됨' : '설정되지 않음',
      geminiAPI: process.env.geminiAPI ? '설정됨' : '설정되지 않음'
    });

    // Gemini API 키 확인 (더 강력한 체크)
    const apiKey = process.env.GEMINI_API_KEY || process.env.geminiAPI;
    console.log('API 키 상태:', apiKey ? '설정됨' : '미설정');
    console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '있음' : '없음');
    console.log('geminiAPI:', process.env.geminiAPI ? '있음' : '없음');
    
    if (!apiKey) {
      console.error('Gemini API 키가 설정되지 않음');
      // API 키가 없어도 기본 데이터는 제공
      const fallbackTournaments = [
        {
          id: 'fallback-1',
          name: '2025 KLPGA 시즌 개막전',
          association: association,
          start_date: `${year}-03-15`,
          end_date: `${year}-03-18`,
          golf_course: '제주 핀크스 골프클럽',
          prize_money: 1000000000,
          max_participants: 120,
          description: 'KLPGA 시즌 첫 대회'
        },
        {
          id: 'fallback-2',
          name: '2025 롯데 챔피언십',
          association: association,
          start_date: `${year}-05-20`,
          end_date: `${year}-05-23`,
          golf_course: '롯데 스카이힐',
          prize_money: 1500000000,
          max_participants: 144,
          description: '롯데 후원 대회'
        }
      ];
      
      return NextResponse.json({
        success: true,
        data: fallbackTournaments,
        year,
        association,
        message: `API 키 없음: ${fallbackTournaments.length}개의 기본 대회를 제공합니다.`
      });
    }

    // Gemini API를 통한 대회 정보 조회 (최대 5번 호출)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const allTournaments: any[] = [];
    const maxAttempts = 5;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`=== Gemini API 호출 시도 ${attempt}/${maxAttempts} ===`);
      
      const prompt = `
당신은 한국 골프 대회 전문가입니다. ${year}년 ${association}에서 주최하는 **모든 공식 대회** 정보를 제공해주세요.

**중요**: ${association}의 ${year}년 **전체 시즌 대회**를 모두 찾아주세요. **반드시 20개 이상의 대회**를 제공해야 합니다.

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
      "golf_course": "실제 골프장명 (예: 스카이72 골프클럽, 핀크스 골프클럽, 제주CC 등)",
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
- KB금융스타 챔피언십, SK네트웍스 챔피언십, OK금융그룹 챔피언십, NH투자증권 챔피언십, KG모빌리언스 챔피언십
- KLPGA 투어 챔피언십, 현대해상 오픈, 삼성생명 챔피언십, 신세계 챔피언십, CJ 오픈, KB금융그룹 챔피언십
- KLPGA 프리미어, KLPGA 메이저, KLPGA 투어, KLPGA 챔피언십, KLPGA 오픈
` : `
- 제네시스 챔피언십, 코리안 오픈, GS칼텍스 매경오픈, 현대해상 오픈, KPGA 코리안 투어 챔피언십, KPGA 챔피언십
- SK텔레콤 오픈, DGB금융그룹 챔피언십, KB금융스타 챔피언십, SK텔레콤 챔피언십, DGB금융그룹 챔피언십
- KPGA 투어 챔피언십, KPGA 메이저, KPGA 투어, KPGA 오픈, KPGA 프리미어, KPGA 그랜드슬램
- 코리안 투어 챔피언십, 코리안 투어 오픈, 코리안 투어 메이저, 코리안 투어 프리미어
`}

**필수 요구사항**:
1. **날짜**: ${year}-MM-DD 형식 (예: ${year}-03-15)
2. **골프장**: 반드시 실제 존재하는 골프장명 사용 (예: "제주 핀크스 골프클럽", "스카이72 골프클럽", "롯데 스카이힐", "오크밸리 컨트리클럽", "남촌 컨트리클럽", "거제 드비치 골프클럽")
3. **상금**: 실제 상금 규모 (5억원~25억원 범위)
4. **참가자**: 현실적인 참가자 수 (120~156명)
5. **지역**: 골프장이 위치한 시/도
6. **대회 수**: 각 호출마다 **5-8개의 서로 다른 대회** 정보 제공

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
        if (allTournaments.length >= 25) { // 20개 + 여유분 5개
          console.log('충분한 대회 수집 완료, API 호출 중단');
          break;
        }
        
        // API 호출 간 간격 (Rate Limiting 방지)
                if (attempt < maxAttempts) {
                  await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기로 할당량 문제 방지
                }
        
      } catch (error) {
        console.error(`Gemini API 호출 오류 ${attempt}:`, error);
        
        // 할당량 초과 에러인 경우 더 긴 대기
        if (error instanceof Error && error.message.includes('429')) {
          console.log('할당량 초과 감지, 10초 대기...');
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        
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


