import { NextRequest, NextResponse } from "next/server";
import { getKLPGAPlayerList, fetchHTML } from "@/lib/scraper";
import { parsePlayerData } from "@/lib/gemini";
import { executeQuery } from "@/lib/database/connection";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const season = searchParams.get("season") || "2025";
  const type = searchParams.get("type") || "KLPGA";

  try {
    // 선수 ID 목록 가져오기
    const ids = await getKLPGAPlayerList(season);
    let total = ids.length;
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    console.log(`🏌️‍♀️ ${total}명의 선수 데이터 수집 시작...`);

    // 병렬(동시) 10개 단위 실행
    for (let i = 0; i < ids.length; i += 10) {
      const batch = ids.slice(i, i + 10);
      console.log(`📦 배치 ${Math.floor(i / 10) + 1}/${Math.ceil(ids.length / 10)} 처리 중...`);

      await Promise.all(
        batch.map(async (id) => {
          try {
            // HTML 가져오기
            const html = await fetchHTML(
              `https://www.klpga.co.kr/web/player/moverProfile.do?playerId=${id}`
            );

            // Gemini로 파싱
            const parsed = await parsePlayerData(html, type as "KLPGA");
            if (!parsed) {
              throw new Error("Gemini parsing failed");
            }

            // DB에 저장 (upsert)
            const existingPlayer = await executeQuery(
              `SELECT id FROM players WHERE name = ? AND association = ? LIMIT 1`,
              [parsed["이름"], type]
            );

            if (existingPlayer && existingPlayer.length > 0) {
              // 업데이트
              await executeQuery(
                `UPDATE players SET 
                  member_number = ?,
                  birth_date = ?,
                  join_year = ?,
                  season_records = ?,
                  career_records = ?,
                  tournament_stats = ?,
                  season = ?,
                  updated_at = NOW()
                WHERE name = ? AND association = ?`,
                [
                  parsed["회원번호"],
                  parsed["생년월일"],
                  parsed["입회년도"],
                  JSON.stringify(parsed["시즌기록"]),
                  JSON.stringify(parsed["통산기록"]),
                  JSON.stringify(parsed["대회기록"]),
                  season,
                  parsed["이름"],
                  type,
                ]
              );
            } else {
              // 새로 생성
              await executeQuery(
                `INSERT INTO players 
                  (name, member_number, birth_date, join_year, season_records, career_records, tournament_stats, association, season, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [
                  parsed["이름"],
                  parsed["회원번호"],
                  parsed["생년월일"],
                  parsed["입회년도"],
                  JSON.stringify(parsed["시즌기록"]),
                  JSON.stringify(parsed["통산기록"]),
                  JSON.stringify(parsed["대회기록"]),
                  type,
                  season,
                ]
              );
            }

            success++;
            console.log(`✅ 성공: ${parsed["이름"]} (${id})`);
          } catch (err) {
            const errorMsg = `Player ID ${id}: ${err instanceof Error ? err.message : String(err)}`;
            console.error("❌ 실패:", errorMsg);
            errors.push(errorMsg);
            failed++;
          }
        })
      );
    }

    return NextResponse.json({
      message: `🏌️‍♀️ ${season} 시즌 전체 수집 완료`,
      total,
      success,
      failed,
      errors: errors.slice(0, 10), // 처음 10개 에러만 반환
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { 
        error: "전체 데이터 수집 실패",
        details: e instanceof Error ? e.message : String(e)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // POST도 같은 로직 사용
  return GET(request);
}

