import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 개별 대회의 결과를 Gemini API로 가져오기
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tournamentName, tournamentId } = body;

    if (!tournamentName) {
      return NextResponse.json({
        success: false,
        error: '대회명이 필요합니다.'
      }, { status: 400 });
    }

    console.log(`개별 대회 결과 조회: ${tournamentName}`);

    // Gemini API 키 확인
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API 키가 설정되지 않았습니다.'
      }, { status: 500 });
    }

    // Gemini API를 통한 대회 결과 조회
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
당신은 한국 골프 대회 전문가입니다. "${tournamentName}" 대회의 최근 결과를 정확히 제공해주세요.

**응답 형식**: 반드시 아래 JSON 형식으로만 응답하세요. 다른 설명이나 텍스트는 절대 포함하지 마세요.

{
  "tournament_name": "${tournamentName}",
  "results": [
    {
      "rank": 1,
      "player_name": "선수명",
      "score": -15,
      "prize_amount": 200000000
    }
  ]
}

**필수 요구사항**:
1. **순위**: 1위부터 30위까지 제공
2. **선수명**: 실제 선수 이름 (예: "김효주", "박민지", "이정은")
3. **스코어**: 언더파는 음수, 오버파는 양수 (예: -15, +2)
4. **상금**: 숫자만 (예: 200000000, 150000000)
5. **데이터**: 실제 대회 결과를 바탕으로 정확한 정보 제공

**응답 예시**:
{
  "tournament_name": "${tournamentName}",
  "results": [
    {
      "rank": 1,
      "player_name": "김효주",
      "score": -14,
      "prize_amount": 200000000
    },
    {
      "rank": 2,
      "player_name": "박민지",
      "score": -12,
      "prize_amount": 120000000
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`=== ${tournamentName} 대회 결과 응답 ===`);
    console.log('응답 내용:', text);

    // JSON 파싱
    let geminiData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*"results"[\s\S]*\}/);
      if (jsonMatch) {
        geminiData = JSON.parse(jsonMatch[0]);
      } else {
        const fullJsonMatch = text.match(/\{[\s\S]*\}/);
        if (fullJsonMatch) {
          geminiData = JSON.parse(fullJsonMatch[0]);
        } else {
          throw new Error('JSON 형식을 찾을 수 없습니다');
        }
      }
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return NextResponse.json({
        success: false,
        error: `대회 결과 파싱 실패: ${parseError instanceof Error ? parseError.message : '알 수 없는 오류'}`
      }, { status: 500 });
    }

    const results = geminiData.results || [];
    
    return NextResponse.json({
      success: true,
      tournament_name: tournamentName,
      tournament_id: tournamentId,
      data: results,
      message: `${results.length}개의 결과를 찾았습니다.`
    });

  } catch (error) {
    console.error('개별 대회 결과 조회 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: `대회 결과 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    }, { status: 500 });
  }
}
