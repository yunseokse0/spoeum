import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// GET - 골프장 목록 조회 (인증 불필요)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const region = searchParams.get('region') || 'all';

    // 골프장 데이터 파일 읽기
    const golfCoursesPath = path.join(process.cwd(), 'data', 'golf-courses.json');
    
    if (!fs.existsSync(golfCoursesPath)) {
      const response: ApiResponse = {
        success: false,
        error: '골프장 데이터 파일을 찾을 수 없습니다.'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const golfCoursesData = JSON.parse(fs.readFileSync(golfCoursesPath, 'utf8'));

    // 필터링
    let filteredGolfCourses = golfCoursesData;

    if (search) {
      const query = search.toLowerCase();
      filteredGolfCourses = filteredGolfCourses.filter((course: any) =>
        course.name.toLowerCase().includes(query) ||
        course.city.toLowerCase().includes(query) ||
        course.region.toLowerCase().includes(query)
      );
    }

    if (region !== 'all') {
      filteredGolfCourses = filteredGolfCourses.filter((course: any) => course.region === region);
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGolfCourses = filteredGolfCourses.slice(startIndex, endIndex);

    const response: ApiResponse = {
      success: true,
      data: paginatedGolfCourses,
      message: '골프장 목록을 성공적으로 조회했습니다.',
      pagination: {
        page,
        limit,
        total: filteredGolfCourses.length,
        totalPages: Math.ceil(filteredGolfCourses.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch golf courses:', error);
    const response: ApiResponse = {
      success: false,
      error: '골프장 목록 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
