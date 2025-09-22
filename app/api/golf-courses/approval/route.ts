import { NextRequest, NextResponse } from 'next/server';
import { GolfCourseApprovalRequest } from '@/types';

// 임시 저장소 (실제 운영 시 DB 연동)
const pendingApprovals: GolfCourseApprovalRequest[] = [];

// 샘플 데이터 (개발용)
const sampleApprovals: GolfCourseApprovalRequest[] = [
  {
    name: '서귀포 골프클럽',
    region: '제주',
    city: '서귀포시',
    address: '제주특별자치도 서귀포시 중문동 123-45',
    phone: '064-1234-5678',
    website: 'https://seogwipogc.co.kr',
    requestedBy: 'user123',
    status: 'pending',
    approvedAt: new Date('2024-01-15')
  },
  {
    name: '강릉 리조트 골프장',
    region: '강원',
    city: '강릉시',
    address: '강원도 강릉시 사천면 해안로 456-78',
    phone: '033-2345-6789',
    requestedBy: 'user456',
    status: 'pending',
    approvedAt: new Date('2024-01-14')
  },
  {
    name: '부산 해운대 골프클럽',
    region: '경남',
    city: '부산시',
    address: '부산광역시 해운대구 우동 789-01',
    phone: '051-3456-7890',
    website: 'https://busanhaewoondae.co.kr',
    requestedBy: 'user789',
    status: 'approved',
    approvedBy: 'admin001',
    approvedAt: new Date('2024-01-13')
  }
];

// 샘플 데이터 초기화
if (pendingApprovals.length === 0) {
  pendingApprovals.push(...sampleApprovals);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      region,
      city,
      address,
      phone,
      website,
      requestedBy
    } = body;

    // 필수 필드 검증
    if (!name || !region || !city || !address || !requestedBy) {
      return NextResponse.json({
        success: false,
        error: '필수 필드가 누락되었습니다.'
      }, { status: 400 });
    }

    // 승인 요청 생성
    const approvalRequest: GolfCourseApprovalRequest = {
      name: name.trim(),
      region: region.trim(),
      city: city.trim(),
      address: address.trim(),
      phone: phone?.trim(),
      website: website?.trim(),
      requestedBy: requestedBy.trim(),
      status: 'pending',
      approvedAt: new Date()
    };

    // 임시 저장소에 추가
    pendingApprovals.push(approvalRequest);

    console.log(`골프장 승인 요청: ${name} (${region} ${city})`);

    return NextResponse.json({
      success: true,
      data: {
        id: `pending_${Date.now()}`,
        ...approvalRequest
      },
      message: '골프장 승인 요청이 제출되었습니다. 관리자 검토 후 승인됩니다.'
    });

  } catch (error) {
    console.error('골프장 승인 요청 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '골프장 승인 요청 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// 관리자용: 승인 요청 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const filteredApprovals = pendingApprovals.filter(
      approval => approval.status === status
    );

    return NextResponse.json({
      success: true,
      data: filteredApprovals
    });

  } catch (error) {
    console.error('승인 요청 목록 조회 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '승인 요청 목록 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// OPTIONS 메서드 (CORS 지원)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
