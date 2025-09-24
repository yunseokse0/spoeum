import { NextRequest, NextResponse } from 'next/server';
import { ContractModel, UpdateContractData } from '@/lib/models/Contract';
import { testConnection } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';

// 계약 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '데이터베이스 연결 실패' },
        { status: 500 }
      );
    }

    const contract = await ContractModel.findById(params.id);

    if (!contract) {
      return NextResponse.json(
        { success: false, error: '계약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contract
    });

  } catch (error) {
    console.error('계약 상세 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '계약 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 계약 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '데이터베이스 연결 실패' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const updateData: UpdateContractData = {};

    // 업데이트할 필드만 포함
    if (body.status !== undefined) updateData.status = body.status;
    if (body.base_salary !== undefined) updateData.base_salary = body.base_salary;
    if (body.tournament_count !== undefined) updateData.tournament_count = body.tournament_count;
    if (body.win_bonus_percentage !== undefined) updateData.win_bonus_percentage = body.win_bonus_percentage;
    if (body.win_bonus_min_amount !== undefined) updateData.win_bonus_min_amount = body.win_bonus_min_amount;
    if (body.win_bonus_max_amount !== undefined) updateData.win_bonus_max_amount = body.win_bonus_max_amount;
    if (body.tournament_bonus_first !== undefined) updateData.tournament_bonus_first = body.tournament_bonus_first;
    if (body.tournament_bonus_second !== undefined) updateData.tournament_bonus_second = body.tournament_bonus_second;
    if (body.tournament_bonus_third !== undefined) updateData.tournament_bonus_third = body.tournament_bonus_third;
    if (body.tournament_bonus_top10 !== undefined) updateData.tournament_bonus_top10 = body.tournament_bonus_top10;
    if (body.tournament_bonus_participation !== undefined) updateData.tournament_bonus_participation = body.tournament_bonus_participation;
    if (body.domestic_transportation !== undefined) updateData.domestic_transportation = body.domestic_transportation;
    if (body.domestic_accommodation !== undefined) updateData.domestic_accommodation = body.domestic_accommodation;
    if (body.domestic_meals !== undefined) updateData.domestic_meals = body.domestic_meals;
    if (body.jeju_transportation !== undefined) updateData.jeju_transportation = body.jeju_transportation;
    if (body.jeju_accommodation !== undefined) updateData.jeju_accommodation = body.jeju_accommodation;
    if (body.jeju_meals !== undefined) updateData.jeju_meals = body.jeju_meals;
    if (body.overseas_transportation !== undefined) updateData.overseas_transportation = body.overseas_transportation;
    if (body.overseas_accommodation !== undefined) updateData.overseas_accommodation = body.overseas_accommodation;
    if (body.overseas_meals !== undefined) updateData.overseas_meals = body.overseas_meals;
    if (body.overseas_visa !== undefined) updateData.overseas_visa = body.overseas_visa;
    if (body.duration_months !== undefined) updateData.duration_months = body.duration_months;
    if (body.penalty_rate !== undefined) updateData.penalty_rate = body.penalty_rate;
    if (body.termination_notice_period_days !== undefined) updateData.termination_notice_period_days = body.termination_notice_period_days;
    if (body.start_date !== undefined) updateData.start_date = new Date(body.start_date);
    if (body.end_date !== undefined) updateData.end_date = new Date(body.end_date);

    const contract = await ContractModel.update(params.id, updateData);

    if (!contract) {
      return NextResponse.json(
        { success: false, error: '계약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contract,
      message: '계약이 성공적으로 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('계약 업데이트 오류:', error);
    return NextResponse.json(
      { success: false, error: '계약 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 계약 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '데이터베이스 연결 실패' },
        { status: 500 }
      );
    }

    const success = await ContractModel.delete(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: '계약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '계약이 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('계약 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '계약 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
