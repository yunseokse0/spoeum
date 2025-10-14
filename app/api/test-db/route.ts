import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('데이터베이스 연결 테스트 시작...');
    
    const isConnected = await testConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: '✅ 데이터베이스 연결 성공',
        timestamp: new Date().toISOString(),
        environment: {
          DB_HOST: process.env.DB_HOST ? '설정됨' : '미설정',
          DB_PORT: process.env.DB_PORT || '3306',
          DB_NAME: process.env.DB_NAME ? '설정됨' : '미설정',
          DB_USER: process.env.DB_USER ? '설정됨' : '미설정',
          DB_PASSWORD: process.env.DB_PASSWORD ? '설정됨' : '미설정'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ 데이터베이스 연결 실패',
        timestamp: new Date().toISOString(),
        environment: {
          DB_HOST: process.env.DB_HOST || '미설정',
          DB_PORT: process.env.DB_PORT || '3306',
          DB_NAME: process.env.DB_NAME || '미설정',
          DB_USER: process.env.DB_USER || '미설정',
          DB_PASSWORD: process.env.DB_PASSWORD || '미설정'
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('데이터베이스 연결 테스트 오류:', error);
    
    return NextResponse.json({
      success: false,
      message: '❌ 데이터베이스 연결 테스트 중 오류 발생',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString(),
      environment: {
        DB_HOST: process.env.DB_HOST || '미설정',
        DB_PORT: process.env.DB_PORT || '3306',
        DB_NAME: process.env.DB_NAME || '미설정',
        DB_USER: process.env.DB_USER || '미설정',
        DB_PASSWORD: process.env.DB_PASSWORD || '미설정'
      }
    }, { status: 500 });
  }
}
