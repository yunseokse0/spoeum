import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface TournamentResult {
  player_name: string;
  rank: number;
  score: number;
  prize_amount: number;
}

// Gemini API를 사용한 골프 대회 결과 파싱
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.geminiAPI;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API 키가 설정되지 않았습니다.'
      }, { status: 500 });
    }

    const body = await request.json();
    const { tournamentName, rawResults } = body;

    if (!tournamentName || !rawResults) {
      return NextResponse.json({
        success: false,
        error: '대회명과 결과 데이터가 필요합니다.'
      }, { status: 400 });
    }

    console.log(`골프 대회 결과 파싱 시작: ${tournamentName}`);

    // Gemini API에 보낼 프롬프트
    const prompt = `
다음은 "${tournamentName}" 골프 대회의 결과 데이터입니다. 
이 데이터를 분석하여 각 선수의 순위, 스코어, 상금을 추출해주세요.

결과 데이터:
${rawResults}

다음 JSON 형식으로 응답해주세요:
{
  "tournament_name": "${tournamentName}",
  "results": [
    {
      "player_name": "선수명",
      "rank": 순위번호,
      "score": 스코어,
      "prize_amount": 상금금액
    }
  ]
}

주의사항:
- 순위는 숫자로만 표시
- 상금은 원화 기준으로 숫자만 표시 (예: 100000000)
- 스코어가 없는 경우 0으로 설정
- 최소 5명 이상의 선수 결과를 추출
- 실제 골프 대회 결과처럼 현실적인 데이터로 생성
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API 오류:', response.status, errorText);
      
      return NextResponse.json({
        success: false,
        error: `Gemini API 호출 실패: ${response.status}`,
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('Gemini API 응답:', data);

    // Gemini 응답에서 텍스트 추출
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API에서 유효한 응답을 받지 못했습니다.',
        rawResponse: data
      }, { status: 500 });
    }

    try {
      // JSON 파싱 시도
      const parsedResults = JSON.parse(generatedText);
      
      return NextResponse.json({
        success: true,
        message: '골프 대회 결과 파싱 성공!',
        tournament_name: parsedResults.tournament_name,
        results: parsedResults.results || [],
        raw_gemini_response: generatedText,
        timestamp: new Date().toISOString()
      });

    } catch (parseError) {
      // JSON 파싱 실패 시 텍스트 그대로 반환
      return NextResponse.json({
        success: true,
        message: 'Gemini API 응답을 받았지만 JSON 파싱에 실패했습니다.',
        raw_response: generatedText,
        parse_error: parseError instanceof Error ? parseError.message : '알 수 없는 파싱 오류',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('골프 대회 결과 파싱 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET 요청으로 간단한 테스트
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.geminiAPI;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API 키가 설정되지 않았습니다.',
        envCheck: {
          geminiAPI: process.env.geminiAPI ? '설정됨' : '설정되지 않음'
        }
      }, { status: 500 });
    }

    // 샘플 골프 대회 결과 데이터
    const sampleResults = `
2024 KLPGA 챔피언십 최종 결과

1위 김선수 - 12언더파 (상금 1억원)
2위 이선수 - 10언더파 (상금 7천만원)
3위 박선수 - 8언더파 (상금 5천만원)
4위 정선수 - 6언더파 (상금 3천만원)
5위 최선수 - 4언더파 (상금 2천만원)
6위 강선수 - 2언더파 (상금 1천5백만원)
7위 윤선수 - 1언더파 (상금 1천만원)
8위 조선수 - 이븐파 (상금 8백만원)
9위 임선수 - 1오버파 (상금 6백만원)
10위 한선수 - 2오버파 (상금 4백만원)
`;

    const prompt = `
다음은 골프 대회의 결과 데이터입니다. 
이 데이터를 분석하여 각 선수의 순위, 스코어, 상금을 추출해주세요.

결과 데이터:
${sampleResults}

다음 JSON 형식으로 응답해주세요:
{
  "tournament_name": "2024 KLPGA 챔피언십",
  "results": [
    {
      "player_name": "선수명",
      "rank": 순위번호,
      "score": 스코어,
      "prize_amount": 상금금액
    }
  ]
}

주의사항:
- 순위는 숫자로만 표시
- 상금은 원화 기준으로 숫자만 표시 (예: 100000000)
- 스코어는 언더파/오버파를 숫자로 변환 (예: 12언더파 = -12)
- 최소 10명의 선수 결과를 추출
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: `Gemini API 호출 실패: ${response.status}`,
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({
      success: true,
      message: 'Gemini API 골프 대회 결과 파싱 테스트 성공!',
      sample_data: sampleResults,
      gemini_response: generatedText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API 테스트 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
