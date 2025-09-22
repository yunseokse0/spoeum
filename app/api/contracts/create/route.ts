import { NextRequest, NextResponse } from 'next/server';
import { ContractTemplateGenerator, ContractValidator } from '@/lib/contracts/contract-template';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userType1, 
      userType2, 
      user1, 
      user2, 
      tournament, 
      customTerms 
    } = body;

    // 필수 파라미터 검증
    if (!userType1 || !userType2 || !user1 || !user2) {
      return NextResponse.json({
        success: false,
        error: '필수 파라미터가 누락되었습니다.'
      }, { status: 400 });
    }

    // 계약서 생성
    const contract = ContractTemplateGenerator.generateContract(
      userType1,
      userType2,
      user1,
      user2,
      tournament,
      customTerms
    );

    // 계약서 유효성 검사
    const validation = ContractValidator.validateContract(contract);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: '계약서 유효성 검사 실패',
        details: validation.errors
      }, { status: 400 });
    }

    // 계약서 요약 생성
    const summary = ContractTemplateGenerator.generateContractSummary(contract);

    return NextResponse.json({
      success: true,
      data: {
        contract,
        summary
      }
    });

  } catch (error) {
    console.error('계약서 생성 오류:', error);
    return NextResponse.json({
      success: false,
      error: '계약서 생성 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}
