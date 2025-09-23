'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface DebugResult {
  success: boolean;
  message: string;
  data: {
    pageStructure?: {
      allClasses: [string, number][];
      playerClasses: string[];
      playerLinks: any[];
      tables: any[];
      lists: any[];
    };
    playerData?: Record<string, any>;
    players?: any[];
    count?: number;
  };
  timestamp: string;
}

export default function DebugKPGA() {
  const [isLoading, setIsLoading] = useState(false);
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null);
  const [activeTab, setActiveTab] = useState<'structure' | 'players'>('structure');

  const runStructureDebug = async () => {
    setIsLoading(true);
    setDebugResult(null);

    try {
      const response = await fetch('/api/etl/debug-kpga');
      const result = await response.json();
      setDebugResult(result);
      setActiveTab('structure');
    } catch (error) {
      console.error('구조 디버깅 실패:', error);
      setDebugResult({
        success: false,
        message: '구조 디버깅 중 오류가 발생했습니다.',
        data: {},
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runPlayerCrawling = async () => {
    setIsLoading(true);
    setDebugResult(null);

    try {
      const response = await fetch('/api/etl/debug-kpga', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      setDebugResult(result);
      setActiveTab('players');
    } catch (error) {
      console.error('선수 크롤링 실패:', error);
      setDebugResult({
        success: false,
        message: '선수 크롤링 중 오류가 발생했습니다.',
        data: {},
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🔍 KPGA 사이트 구조 디버깅
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            KPGA 사이트의 실제 구조를 분석하고 올바른 셀렉터를 찾습니다.
          </p>
        </div>

        {/* 테스트 버튼 */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🧪 디버깅 테스트
          </h2>
          
          <div className="flex space-x-4">
            <Button
              onClick={runStructureDebug}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? '🔄 구조 분석 중...' : '🔍 사이트 구조 분석'}
            </Button>
            
            <Button
              onClick={runPlayerCrawling}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? '🔄 크롤링 중...' : '🚀 선수 데이터 크롤링'}
            </Button>
          </div>
        </Card>

        {/* 결과 표시 */}
        {debugResult && (
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📊 디버깅 결과
            </h2>
            
            {/* 상태 표시 */}
            <div className="mb-6">
              <Badge 
                className={`text-lg px-4 py-2 ${
                  debugResult.success 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-100' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-100'
                }`}
              >
                {debugResult.success ? '✅ 성공' : '❌ 실패'}
              </Badge>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {debugResult.message}
              </p>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('structure')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'structure'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-100'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                🏗️ 사이트 구조
              </button>
              <button
                onClick={() => setActiveTab('players')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'players'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-100'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                👥 선수 데이터
              </button>
            </div>

            {/* 사이트 구조 탭 */}
            {activeTab === 'structure' && debugResult.data.pageStructure && (
              <div className="space-y-6">
                {/* 상위 클래스들 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    🔤 상위 클래스들 (상위 20개)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {debugResult.data.pageStructure.allClasses.slice(0, 20).map(([className, count], index) => (
                      <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        <span className="font-mono text-blue-600 dark:text-blue-400">{className}</span>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">({count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Player 관련 클래스들 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    👥 Player 관련 클래스들
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {debugResult.data.pageStructure.playerClasses.map((className, index) => (
                      <div key={index} className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                        <span className="font-mono text-green-600 dark:text-green-400">{className}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Player 관련 링크들 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    🔗 Player 관련 링크들
                  </h3>
                  <div className="space-y-2">
                    {debugResult.data.pageStructure.playerLinks.slice(0, 10).map((link, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">{link.text}</span>
                          <span className="ml-2 text-gray-500 dark:text-gray-400">({link.className})</span>
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{link.href}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 테이블들 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    📋 테이블들
                  </h3>
                  <div className="space-y-2">
                    {debugResult.data.pageStructure.tables.map((table, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="text-sm">
                          <span className="font-medium">테이블 {index + 1}</span>
                          <span className="ml-2 text-gray-500 dark:text-gray-400">
                            ({table.rowCount}행 × {table.colCount}열)
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          클래스: {table.className || '없음'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 리스트들 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    📝 리스트들
                  </h3>
                  <div className="space-y-2">
                    {debugResult.data.pageStructure.lists.map((list, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="text-sm">
                          <span className="font-medium">{list.tagName} {index + 1}</span>
                          <span className="ml-2 text-gray-500 dark:text-gray-400">
                            ({list.itemCount}개 항목)
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          클래스: {list.className || '없음'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 선수 데이터 탭 */}
            {activeTab === 'players' && debugResult.data.players && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  👥 크롤링된 선수 데이터 ({debugResult.data.count}명)
                </h3>
                <div className="space-y-2">
                  {debugResult.data.players.map((player, index) => (
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
                디버깅 시간: {new Date(debugResult.timestamp).toLocaleString('ko-KR')}
              </p>
            </div>
          </Card>
        )}

        {/* 사용법 안내 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📖 디버깅 사용법
          </h2>
          
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">1. 사이트 구조 분석</h3>
              <p className="text-sm">
                KPGA 사이트의 실제 HTML 구조를 분석하여 올바른 셀렉터를 찾습니다.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">2. 선수 데이터 크롤링</h3>
              <p className="text-sm">
                분석 결과를 바탕으로 실제 선수 데이터를 크롤링합니다.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">3. 결과 분석</h3>
              <p className="text-sm">
                수집된 데이터를 분석하여 최적의 크롤링 전략을 수립합니다.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
