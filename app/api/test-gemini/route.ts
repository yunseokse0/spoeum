import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Gemini API 테스트 엔드포인트
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.geminiAPI;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API 키가 설정되지 않았습니다.',
        envCheck: {
          geminiAPI: process.env.geminiAPI ? '설정됨' : '설정되지 않음',
          allEnvKeys: Object.keys(process.env).filter(key => key.includes('gemini') || key.includes('GEMINI'))
        }
      }, { status: 500 });
    }

    console.log('Gemini API 테스트 시작...');
    console.log('API 키 길이:', apiKey.length);

    // Gemini API 호출
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "안녕하세요! 골프 대회 결과를 파싱하는 AI입니다. 간단한 테스트 메시지를 보내주세요."
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
        details: errorText,
        apiKeyLength: apiKey.length,
        apiKeyPrefix: apiKey.substring(0, 10) + '...'
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('Gemini API 응답:', data);

    return NextResponse.json({
      success: true,
      message: 'Gemini API 연동 성공!',
      response: data,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API 테스트 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST 요청으로 더 복잡한 테스트
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
    const prompt = body.prompt || "골프 대회 결과를 분석해주세요.";

    console.log('Gemini API POST 테스트:', prompt);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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

    return NextResponse.json({
      success: true,
      message: 'Gemini API POST 요청 성공!',
      prompt: prompt,
      response: data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API POST 테스트 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
