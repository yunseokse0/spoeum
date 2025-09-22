import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// POST - 시드 데이터 초기화
export async function POST(request: NextRequest) {
  try {
    const { dataType } = await request.json();

    let result: any = {};

    switch (dataType) {
      case 'golf-courses':
        try {
          const golfCoursesPath = path.join(process.cwd(), 'data', 'golf-courses.json');
          const golfCoursesData = JSON.parse(fs.readFileSync(golfCoursesPath, 'utf8'));
          
          // Mock: 실제 구현에서는 데이터베이스에 저장
          console.log(`Seeding ${golfCoursesData.length} golf courses`);
          result = {
            type: 'golf-courses',
            count: golfCoursesData.length,
            message: '골프장 데이터가 성공적으로 초기화되었습니다.'
          };
        } catch (error) {
          console.error('Failed to seed golf courses:', error);
          throw new Error('골프장 데이터 초기화에 실패했습니다.');
        }
        break;

      case 'players':
        try {
          const playersPath = path.join(process.cwd(), 'data', 'players.json');
          const playersData = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
          
          // Mock: 실제 구현에서는 데이터베이스에 저장
          console.log(`Seeding ${playersData.length} players`);
          result = {
            type: 'players',
            count: playersData.length,
            message: '투어프로 선수 데이터가 성공적으로 초기화되었습니다.'
          };
        } catch (error) {
          console.error('Failed to seed players:', error);
          throw new Error('투어프로 선수 데이터 초기화에 실패했습니다.');
        }
        break;

      case 'all':
        try {
          const golfCoursesPath = path.join(process.cwd(), 'data', 'golf-courses.json');
          const playersPath = path.join(process.cwd(), 'data', 'players.json');
          
          const golfCoursesData = JSON.parse(fs.readFileSync(golfCoursesPath, 'utf8'));
          const playersData = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
          
          // Mock: 실제 구현에서는 데이터베이스에 저장
          console.log(`Seeding ${golfCoursesData.length} golf courses and ${playersData.length} players`);
          result = {
            type: 'all',
            golfCourses: golfCoursesData.length,
            players: playersData.length,
            message: '모든 시드 데이터가 성공적으로 초기화되었습니다.'
          };
        } catch (error) {
          console.error('Failed to seed all data:', error);
          throw new Error('전체 데이터 초기화에 실패했습니다.');
        }
        break;

      default:
        const response: ApiResponse = {
          success: false,
          error: '지원하지 않는 데이터 타입입니다. (golf-courses, players, all)'
        };
        return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      data: result,
      message: result.message
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to seed data:', error);
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : '데이터 초기화 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// GET - 시드 데이터 상태 확인
export async function GET(request: NextRequest) {
  try {
    const golfCoursesPath = path.join(process.cwd(), 'data', 'golf-courses.json');
    const playersPath = path.join(process.cwd(), 'data', 'players.json');
    
    let golfCoursesCount = 0;
    let playersCount = 0;
    let golfCoursesExists = false;
    let playersExists = false;

    try {
      if (fs.existsSync(golfCoursesPath)) {
        const golfCoursesData = JSON.parse(fs.readFileSync(golfCoursesPath, 'utf8'));
        golfCoursesCount = golfCoursesData.length;
        golfCoursesExists = true;
      }
    } catch (error) {
      console.error('Failed to read golf courses data:', error);
    }

    try {
      if (fs.existsSync(playersPath)) {
        const playersData = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
        playersCount = playersData.length;
        playersExists = true;
      }
    } catch (error) {
      console.error('Failed to read players data:', error);
    }

    const response: ApiResponse = {
      success: true,
      data: {
        golfCourses: {
          exists: golfCoursesExists,
          count: golfCoursesCount,
          path: golfCoursesPath
        },
        players: {
          exists: playersExists,
          count: playersCount,
          path: playersPath
        }
      },
      message: '시드 데이터 상태를 성공적으로 조회했습니다.'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to get seed data status:', error);
    const response: ApiResponse = {
      success: false,
      error: '시드 데이터 상태 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
