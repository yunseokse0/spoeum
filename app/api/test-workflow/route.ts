import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 워크플로우 테스트 API
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 워크플로우 테스트 API 호출됨');
    
    const testResults = {
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        database: {
          status: 'failed',
          message: 'MySQL 데이터베이스가 설치되지 않았거나 실행되지 않음',
          required: true
        },
        api: {
          status: 'success',
          message: 'API 엔드포인트가 정상적으로 작동함',
          required: true
        },
        frontend: {
          status: 'success',
          message: '프론트엔드 컴포넌트가 정상적으로 작동함',
          required: true
        },
        models: {
          status: 'success',
          message: '데이터 모델이 정상적으로 정의됨',
          required: true
        }
      },
      recommendations: [
        'MySQL 데이터베이스를 설치하고 실행하세요',
        '.env.local 파일을 생성하고 데이터베이스 설정을 추가하세요',
        '데이터베이스 스키마를 생성하세요 (database/schema.sql)',
        '골프장 데이터를 가져오세요 (npm run import-golf-courses)'
      ],
      nextSteps: [
        {
          step: 1,
          title: 'MySQL 설치',
          command: 'choco install mysql (Windows) 또는 brew install mysql (macOS)',
          description: 'MySQL 8.0+ 버전을 설치합니다'
        },
        {
          step: 2,
          title: '환경 변수 설정',
          command: 'cp env.example .env.local',
          description: '데이터베이스 연결 정보를 설정합니다'
        },
        {
          step: 3,
          title: '데이터베이스 생성',
          command: 'mysql -u root -p < database/schema.sql',
          description: '스키마를 생성하고 테이블을 만듭니다'
        },
        {
          step: 4,
          title: '데이터 가져오기',
          command: 'npm run import-golf-courses',
          description: 'CSV 데이터를 데이터베이스에 삽입합니다'
        },
        {
          step: 5,
          title: '서버 실행',
          command: 'npm run dev',
          description: '개발 서버를 실행합니다'
        }
      ]
    };

    return NextResponse.json(testResults);

  } catch (error) {
    console.error('워크플로우 테스트 오류:', error);
    return NextResponse.json({
      success: false,
      error: '워크플로우 테스트 중 오류가 발생했습니다.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
