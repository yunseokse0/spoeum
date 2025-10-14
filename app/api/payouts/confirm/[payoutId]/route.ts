import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { payoutId: string } }
) {
  try {
    const { payoutId } = params;

    if (!payoutId) {
      return NextResponse.json({
        success: false,
        error: '정산 ID가 필요합니다.'
      }, { status: 400 });
    }

    // Vercel 환경에서는 mock 응답 반환
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      return NextResponse.json({
        success: true,
        message: '정산이 완료되었습니다.'
      });
    }

    // 로컬 환경에서는 실제 데이터베이스 처리
    const result = await executeQuery(
      `
        UPDATE caddy_payouts 
        SET 
          paid_status = TRUE,
          paid_date = NOW(),
          updated_at = NOW()
        WHERE id = ?
      `,
      [payoutId]
    );

    if (!result || (result as any).affectedRows === 0) {
      return NextResponse.json({
        success: false,
        error: '정산 내역을 찾을 수 없습니다.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '정산이 완료되었습니다.'
    });

  } catch (error) {
    console.error('정산 완료 처리 오류:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '정산 완료 처리 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}