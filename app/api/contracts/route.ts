import { NextRequest, NextResponse } from 'next/server';
import { ContractModel, CreateContractData } from '@/lib/models/Contract';
import { testConnection } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';

// 계약 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '데이터베이스 연결 실패' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const contractType = searchParams.get('type') as any;
    const status = searchParams.get('status') as any;
    const userId = searchParams.get('userId');

    const result = await ContractModel.findMany(page, limit, contractType, status, userId || undefined);

    return NextResponse.json({
      success: true,
      data: result.contracts,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    });

  } catch (error) {
    console.error('계약 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '계약 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 계약 생성
export async function POST(request: NextRequest) {
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
    const contractData: CreateContractData = {
      contract_type: body.contract_type,
      tour_pro_id: body.tour_pro_id,
      caddy_id: body.caddy_id,
      amateur_id: body.amateur_id,
      sponsor_id: body.sponsor_id,
      base_salary: body.base_salary,
      tournament_count: body.tournament_count,
      win_bonus_percentage: body.win_bonus_percentage,
      win_bonus_min_amount: body.win_bonus_min_amount,
      win_bonus_max_amount: body.win_bonus_max_amount,
      tournament_bonus_first: body.tournament_bonus_first,
      tournament_bonus_second: body.tournament_bonus_second,
      tournament_bonus_third: body.tournament_bonus_third,
      tournament_bonus_top10: body.tournament_bonus_top10,
      tournament_bonus_participation: body.tournament_bonus_participation,
      domestic_transportation: body.domestic_transportation,
      domestic_accommodation: body.domestic_accommodation,
      domestic_meals: body.domestic_meals,
      jeju_transportation: body.jeju_transportation,
      jeju_accommodation: body.jeju_accommodation,
      jeju_meals: body.jeju_meals,
      overseas_transportation: body.overseas_transportation,
      overseas_accommodation: body.overseas_accommodation,
      overseas_meals: body.overseas_meals,
      overseas_visa: body.overseas_visa,
      duration_months: body.duration_months,
      penalty_rate: body.penalty_rate,
      termination_notice_period_days: body.termination_notice_period_days,
      start_date: new Date(body.start_date),
      end_date: new Date(body.end_date)
    };

    const contract = await ContractModel.create(contractData);

    return NextResponse.json({
      success: true,
      data: contract,
      message: '계약이 성공적으로 생성되었습니다.'
    });

  } catch (error) {
    console.error('계약 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '계약 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
