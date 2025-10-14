const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function fetchTournaments() {
  try {
    const prompt = `당신은 한국 골프 대회 전문가입니다. 2025년 KLPGA에서 주최하는 모든 공식 대회 정보를 제공해주세요.

**중요**: KLPGA의 2025년 전체 시즌 대회를 모두 찾아주세요. 15개 이상의 대회를 제공해야 합니다.

**응답 형식**: 반드시 아래 JSON 형식으로만 응답하세요.

{
  "tournaments": [
    {
      "id": "고유식별자",
      "name": "정확한 대회명",
      "association": "KLPGA",
      "start_date": "2025-MM-DD",
      "end_date": "2025-MM-DD",
      "location": "시/도명",
      "golf_course": "실제 골프장명",
      "prize_money": 숫자,
      "max_participants": 숫자,
      "status": "upcoming",
      "description": "대회 설명"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('=== KLPGA 2025 대회 데이터 ===');
    console.log(text);
  } catch (error) {
    console.error('오류:', error);
  }
}

fetchTournaments();
