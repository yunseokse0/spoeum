import { NextResponse } from 'next/server';
import { ContractTemplateGenerator } from '@/lib/contracts/contract-template';

export async function GET() {
  try {
    // 테스트 데이터
    const tourPro = {
      id: 'tp001',
      name: '김여프로',
      tourProInfo: {
        association: 'KLPGA',
        memberId: 'KLPGA12345'
      }
    };

    const caddy = {
      id: 'cd001',
      name: '이캐디',
      caddyInfo: {
        experience: '3-5',
        mainGolfCourse: 'jeju_blueone'
      }
    };

    const tournament = {
      id: 'tn001',
      name: '2025 KLPGA 챔피언십',
      location: '제주 블루원 골프클럽',
      startDate: '2025-03-01',
      endDate: '2025-03-03',
      prize: 100000000 // 1억원
    };

    // 투어프로-캐디 계약서 생성
    const contract = ContractTemplateGenerator.generateTourProCaddyContract(
      tourPro,
      caddy,
      tournament
    );

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
    console.error('테스트 계약서 생성 오류:', error);
    return NextResponse.json({
      success: false,
      error: '테스트 계약서 생성 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}
