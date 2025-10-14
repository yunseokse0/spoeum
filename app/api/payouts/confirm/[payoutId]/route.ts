import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 캐디 정산 완료 처리 API
export async function POST(
  request: NextRequest,
  { params }: { params: { payoutId: string } }
) {
  try {
    const payoutId = params.payoutId;

    console.log(`캐디 정산 완료 처리: ${payoutId}`);

    // TODO: 실제 데이터베이스 연동
    // UPDATE caddy_payouts 
    // SET paid_status = true, paid_date = NOW() 
    // WHERE id = ?

    // Mock 응답 (데모용)
    const updatedPayout = {
      id: payoutId,
      paid_status: true,
      paid_date: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      payout: updatedPayout,
      message: '정산이 완료 처리되었습니다.'
    });

  } catch (error) {
    console.error('정산 완료 처리 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '정산 완료 처리 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

