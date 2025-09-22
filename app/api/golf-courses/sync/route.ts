import { NextRequest, NextResponse } from 'next/server';
import { GolfCourseScraper } from '@/lib/scraper/golf-course-scraper';
import { GolfCourse } from '@/types';

// 임시 저장소 (실제 운영 시 DB 연동)
let golfCourses: GolfCourse[] = [];
let lastSyncTime: Date | null = null;
let isSyncing = false;

export async function POST(request: NextRequest) {
  try {
    // 이미 동기화 중인지 확인
    if (isSyncing) {
      return NextResponse.json({
        success: false,
        error: '골프장 목록 동기화가 이미 진행 중입니다.'
      }, { status: 409 });
    }

    isSyncing = true;
    console.log('골프장 목록 자동 동기화 시작...');

    const scraper = new GolfCourseScraper();
    const scrapedCourses = await scraper.collectAllCourses();

    // 스크래핑된 데이터를 GolfCourse 형식으로 변환
    const newGolfCourses: GolfCourse[] = scrapedCourses.map((course, index) => ({
      id: `gc_auto_${Date.now()}_${index}`,
      name: course.name,
      region: course.region,
      city: course.city,
      code: this.generateCode(course.name),
      address: course.address,
      phone: course.phone,
      website: course.website,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // 기존 데이터와 병합 (중복 제거)
    const mergedCourses = mergeGolfCourses(golfCourses, newGolfCourses);
    golfCourses = mergedCourses;
    lastSyncTime = new Date();

    console.log(`골프장 목록 동기화 완료: ${newGolfCourses.length}개 새로 추가, 총 ${golfCourses.length}개`);

    return NextResponse.json({
      success: true,
      data: {
        totalCourses: golfCourses.length,
        newCourses: newGolfCourses.length,
        lastSyncTime: lastSyncTime,
        courses: newGolfCourses
      },
      message: '골프장 목록이 성공적으로 동기화되었습니다.'
    });

  } catch (error) {
    console.error('골프장 목록 동기화 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '골프장 목록 동기화 중 오류가 발생했습니다.'
    }, { status: 500 });
  } finally {
    isSyncing = false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('stats') === 'true';

    const response: any = {
      success: true,
      data: golfCourses
    };

    if (includeStats) {
      response.stats = {
        totalCourses: golfCourses.length,
        lastSyncTime: lastSyncTime,
        isSyncing: isSyncing,
        activeCourses: golfCourses.filter(course => course.isActive).length
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('골프장 목록 조회 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '골프장 목록 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// 골프장 코드 생성
function generateCode(name: string): string {
  // 골프장 이름에서 영문자 추출하여 코드 생성
  const cleanName = name.replace(/[^a-zA-Z가-힣]/g, '');
  const firstLetters = cleanName.slice(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-3);
  return `${firstLetters}${timestamp}`;
}

// 골프장 데이터 병합 (중복 제거)
function mergeGolfCourses(existing: GolfCourse[], newCourses: GolfCourse[]): GolfCourse[] {
  const existingMap = new Map(existing.map(course => [course.name.toLowerCase(), course]));
  
  newCourses.forEach(newCourse => {
    const key = newCourse.name.toLowerCase();
    if (!existingMap.has(key)) {
      existingMap.set(key, newCourse);
    } else {
      // 기존 데이터 업데이트
      const existing = existingMap.get(key)!;
      existingMap.set(key, {
        ...existing,
        ...newCourse,
        id: existing.id, // ID는 유지
        updatedAt: new Date()
      });
    }
  });

  return Array.from(existingMap.values());
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
