'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface KPGAPlayer {
  memberId: string;
  name: string;
  association: string;
  birth: string;
  currentRanking: number;
  totalPrize: number;
  isActive: boolean;
  profileUrl?: string;
}

interface TestResult {
  success: boolean;
  message: string;
  data: {
    players: KPGAPlayer[];
    count: number;
    totalFound?: number;
    testMode?: boolean;
  };
  timestamp: string;
}

export default function TestDynamicLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testMode, setTestMode] = useState(true);

  const runKPGAAdvancedTest = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const url = testMode 
        ? '/api/etl/test-kpga?test=true'
        : '/api/etl/test-kpga';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      console.error('테스트 실행 실패:', error);
      setTestResult({
        success: false,
        message: '테스트 실행 중 오류가 발생했습니다.',
        data: { players: [], count: 0 },
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runBasicTest = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/etl/test-kpga');
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      console.error('기본 테스트 실행 실패:', error);
      setTestResult({
        success: false,
        message: '기본 테스트 실행 중 오류가 발생했습니다.',
        data: { players: [], count: 0 },
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 동적 로딩 크롤링 테스트
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            KPGA 선수 목록의 동적 로딩을 테스트하고 고급 크롤링 기능을 검증합니다.
          </p>
        </div>

        {/* 테스트 설정 */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ⚙️ 테스트 설정
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  테스트 모드 (처음 5명만 크롤링)
                </span>
              </label>
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={runKPGAAdvancedTest}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? '🔄 고급 크롤링 테스트 중...' : '🚀 고급 크롤링 테스트'}
              </Button>
              
              <Button
                onClick={runBasicTest}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? '🔄 기본 테스트 중...' : '📋 기본 테스트'}
              </Button>
            </div>
          </div>
        </Card>

        {/* 테스트 결과 */}
        {testResult && (
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📊 테스트 결과
            </h2>
            
            {/* 상태 표시 */}
            <div className="mb-6">
              <Badge 
                className={`text-lg px-4 py-2 ${
                  testResult.success 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-100' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-100'
                }`}
              >
                {testResult.success ? '✅ 성공' : '❌ 실패'}
              </Badge>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {testResult.message}
              </p>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {testResult.data.count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">크롤링된 선수</div>
              </div>
              
              {testResult.data.totalFound && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {testResult.data.totalFound}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">전체 발견된 선수</div>
                </div>
              )}
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {testResult.data.testMode ? '테스트' : '전체'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">모드</div>
              </div>
            </div>

            {/* 선수 목록 */}
            {testResult.data.players.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  👥 크롤링된 선수 목록
                </h3>
                <div className="space-y-2">
                  {testResult.data.players.map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {player.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {player.memberId} • {player.association}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900 dark:text-white">
                          랭킹: {player.currentRanking || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          상금: {player.totalPrize?.toLocaleString() || 'N/A'}원
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 타임스탬프 */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                테스트 시간: {new Date(testResult.timestamp).toLocaleString('ko-KR')}
              </p>
            </div>
          </Card>
        )}

        {/* 사용법 안내 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📖 동적 로딩 크롤링 기능
          </h2>
          
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">🔄 동적 로딩 처리</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• 네트워크 안정화 대기 (networkidle)</li>
                <li>• 스크롤을 통한 콘텐츠 로딩</li>
                <li>• 커스텀 셀렉터 대기</li>
                <li>• 이미지/폰트 로딩 대기</li>
                <li>• AJAX 요청 완료 대기</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">🎯 고급 크롤링 기능</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• 봇 탐지 우회 (User-Agent, Chrome 객체)</li>
                <li>• 다중 셀렉터 시도</li>
                <li>• 상세 정보 자동 수집</li>
                <li>• 요청 간 지연 처리</li>
                <li>• 에러 핸들링 및 재시도</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">📊 데이터 품질</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• 선수 기본 정보 (이름, 회원번호, 소속)</li>
                <li>• 랭킹 및 상금 정보</li>
                <li>• 프로필 URL 수집</li>
                <li>• 데이터 검증 및 정리</li>
                <li>• 중복 제거</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
