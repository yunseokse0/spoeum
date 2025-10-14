// Gemini AI를 사용한 데이터 파싱

interface PlayerData {
  "이름": string;
  "회원번호": string;
  "생년월일": string;
  "입회년도": string;
  "시즌기록": any;
  "통산기록": any;
  "대회기록": any;
}

/**
 * Gemini AI로 선수 데이터 파싱
 */
export async function parsePlayerData(
  html: string,
  type: "KLPGA" | "KPGA"
): Promise<PlayerData | null> {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.geminiAPI;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY 또는 geminiAPI가 설정되지 않았습니다.");
    }

    const prompt = `
다음 HTML에서 골프 선수의 정보를 추출해주세요.
추출할 정보:
- 이름
- 회원번호
- 생년월일
- 입회년도
- 시즌기록 (JSON 객체로)
- 통산기록 (JSON 객체로)
- 대회기록 (JSON 배열로)

JSON 형식으로만 응답해주세요.

HTML:
${html.substring(0, 10000)}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API 오류: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Gemini 응답이 비어있습니다.");
    }

    // JSON 추출 (코드 블록 제거)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON을 찾을 수 없습니다.");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed as PlayerData;
  } catch (error) {
    console.error("Gemini 파싱 실패:", error);
    return null;
  }
}

