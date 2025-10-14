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
      console.error('Gemini API 키가 설정되지 않았습니다.');
      return NextResponse.json({
        success: false,
        error: 'Gemini API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.',
        data: []
      }, { status: 500 });
    }

    // Gemini API를 통한 대회 정보 조회
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
당신은 한국 골프 대회 전문가입니다. ${year}년 ${association}에서 주최하는 **모든 공식 대회**의 완전한 정보를 제공해주세요.

**중요**: ${association}의 전체 시즌 대회를 모두 포함해야 합니다. 3월부터 12월까지의 모든 공식 대회를 찾아주세요.

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

**${association} 전체 대회 목록** (반드시 포함해야 할 대회들):

${association === 'KLPGA' ? `
- 한화클래식 (${year}-05월, 스카이72 골프클럽)
- BMW 레이디스 챔피언십 (${year}-08월, BMW 챔피언십 코스)
- 롯데 챔피언십 (${year}-11월, 롯데 스카이힐)
- 신한동해오픈 (${year}-04월, 알펜시아 골프클럽)
- KLPGA 챔피언십 (${year}-10월, 여주 골프클럽)
- 하이트진로 챔피언십 (${year}-07월, 인천 골프클럽)
- 롯데 오픈 (${year}-06월, 제주 골프클럽)
- KLPGA 시즌 개막전 (${year}-03월, 제주 핀크스 골프클럽)
- KLPGA 시즌 마감전 (${year}-12월, 스카이72 골프클럽)
` : `
- 제네시스 챔피언십 (${year}-04월, Jack Nicklaus GC Korea)
- 코리안 오픈 (${year}-06월, 여주 골프클럽)
- GS칼텍스 매경오픈 (${year}-05월, 나인브릿지)
- 현대해상 오픈 (${year}-12월, 거제 베이힐스 골프클럽)
- KPGA 코리안 투어 챔피언십 (${year}-11월, 레이크우드 컨트리클럽)
- KPGA 시즌 개막전 (${year}-03월, 제주 핀크스 골프클럽)
- KPGA 시즌 마감전 (${year}-12월, 스카이72 골프클럽)
- KPGA 챔피언십 (${year}-10월, 용인 골프클럽)
`}

**필수 요구사항**:
1. **전체 대회**: 위에 나열된 모든 대회를 포함해야 합니다 (최소 8-10개)
2. **날짜**: 각 대회의 정확한 개최일 (${year}-MM-DD 형식)
3. **골프장**: 구체적인 골프장 이름 (예: "제주 핀크스 골프클럽", "스카이72 골프클럽")
4. **상금**: 실제 상금 규모 (5억원~25억원 범위)
5. **참가자**: 현실적인 참가자 수 (120~156명)
6. **지역**: 골프장이 위치한 시/도

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
    
    console.log('=== Gemini API 응답 시작 ===');
    console.log('전체 응답 길이:', text.length);
    console.log('응답 내용:', text);
    console.log('=== Gemini API 응답 끝 ===');

    // JSON 파싱
    let geminiData;
    try {
      // JSON 부분만 추출 (더 정확한 정규식 사용)
      const jsonMatch = text.match(/\{[\s\S]*"tournaments"[\s\S]*\}/);
      if (jsonMatch) {
        console.log('추출된 JSON:', jsonMatch[0]);
        geminiData = JSON.parse(jsonMatch[0]);
        console.log('파싱된 데이터:', JSON.stringify(geminiData, null, 2));
      } else {
        console.log('JSON 패턴을 찾을 수 없음, 전체 텍스트에서 JSON 추출 시도');
        // 전체 텍스트에서 JSON 추출 시도
        const fullJsonMatch = text.match(/\{[\s\S]*\}/);
        if (fullJsonMatch) {
          geminiData = JSON.parse(fullJsonMatch[0]);
          console.log('전체 텍스트에서 파싱된 데이터:', JSON.stringify(geminiData, null, 2));
        } else {
          throw new Error('JSON 형식을 찾을 수 없습니다');
        }
      }
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      console.log('파싱 실패한 원본 응답:', text);
      
      return NextResponse.json({
        success: false,
        error: `Gemini API 응답 파싱 실패: ${parseError instanceof Error ? parseError.message : '알 수 없는 오류'}`,
        data: []
      }, { status: 500 });
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
    console.error('Gemini API 호출 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: `Gemini API 호출 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      data: []
    }, { status: 500 });
  }
}


