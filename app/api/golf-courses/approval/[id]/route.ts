import { NextRequest, NextResponse } from 'next/server';

// 임시 저장소 (실제 운영 시 DB 연동)
const pendingApprovals: any[] = [];

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, approvedBy, rejectionReason } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({
        success: false,
        error: '올바른 액션을 선택해주세요. (approve 또는 reject)'
      }, { status: 400 });
    }

    // TODO: 실제 DB에서 승인 요청 조회 및 업데이트
    console.log(`골프장 승인 처리: ${id} - ${action}`);

    if (action === 'approve') {
      // 승인 처리
      return NextResponse.json({
        success: true,
        data: {
          id,
          status: 'approved',
          approvedBy: approvedBy || 'admin',
          approvedAt: new Date()
        },
        message: '골프장이 승인되었습니다.'
      });
    } else {
      // 거부 처리
      return NextResponse.json({
        success: true,
        data: {
          id,
          status: 'rejected',
          rejectionReason: rejectionReason || '승인 거부',
          rejectedBy: approvedBy || 'admin',
          rejectedAt: new Date()
        },
        message: '골프장 승인이 거부되었습니다.'
      });
    }

  } catch (error) {
    console.error('골프장 승인 처리 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '골프장 승인 처리 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: 실제 DB에서 승인 요청 삭제
    console.log(`골프장 승인 요청 삭제: ${id}`);

    return NextResponse.json({
      success: true,
      message: '골프장 승인 요청이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('골프장 승인 요청 삭제 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '골프장 승인 요청 삭제 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// OPTIONS 메서드 (CORS 지원)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
