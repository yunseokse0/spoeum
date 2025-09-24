import { NextRequest, NextResponse } from 'next/server';
import { GolfCourseModel, CreateGolfCourseData } from '@/lib/models/GolfCourse';
import { testConnection } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';

// 골프장 목록 조회
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
    const region = searchParams.get('region') || undefined;
    const city = searchParams.get('city') || undefined;
    const courseType = searchParams.get('type') as '회원제' | '대중제' | undefined;

    const result = await GolfCourseModel.findMany(page, limit, region, city, courseType);

    return NextResponse.json({
      success: true,
      data: result.courses,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    });

  } catch (error) {
    console.error('골프장 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '골프장 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 골프장 생성
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
    const courseData: CreateGolfCourseData = {
      name: body.name,
      region: body.region,
      city: body.city,
      address: body.address,
      phone: body.phone,
      website: body.website,
      total_area: body.total_area,
      holes: body.holes,
      course_type: body.course_type,
      owner: body.owner
    };

    const course = await GolfCourseModel.create(courseData);

    return NextResponse.json({
      success: true,
      data: course,
      message: '골프장이 성공적으로 생성되었습니다.'
    });

  } catch (error) {
    console.error('골프장 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '골프장 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
