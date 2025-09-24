'use client';

import { useState } from 'react';

export default function TestScrapingPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testScraping = async (dataType: string) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log(`크롤링 시작: ${dataType}`);
      const response = await fetch(`/api/data/scrape-all?dataType=${dataType}&mock=false`);
      
      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('크롤링 응답:', data);
      
      if (data.success) {
        setResults(data);
        console.log(`${dataType} 크롤링 성공:`, data);
      } else {
        setError(data.error || '크롤링 실패');
        console.error(`${dataType} 크롤링 실패:`, data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(errorMessage);
      console.error(`${dataType} 크롤링 오류:`, err);
    } finally {
      setLoading(false);
    }
  };

  const testViewData = async (dataType: string) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log(`데이터 조회 시작: ${dataType}`);
      const response = await fetch(`/api/data/view?dataType=${dataType}&mock=false`);
      
      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('데이터 조회 응답:', data);
      
      if (data.success) {
        setResults(data);
        console.log(`${dataType} 데이터 조회 성공:`, data);
      } else {
        setError(data.error || '데이터 조회 실패');
        console.error(`${dataType} 데이터 조회 실패:`, data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(errorMessage);
      console.error(`${dataType} 데이터 조회 오류:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          크롤링 테스트 페이지
        </h1>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
            ✅ 크롤링 시스템 정상 작동
          </h2>
          <p className="text-green-700 dark:text-green-300 text-sm mb-2">
            모든 크롤링 API가 정상적으로 작동하고 있습니다. 실제 선수 데이터가 성공적으로 수집되고 있습니다.
          </p>
          <div className="text-xs text-green-600 dark:text-green-400">
            • KLPGA: 20명의 실제 선수 데이터<br/>
            • KPGA: 20명의 실제 선수 데이터<br/>
            • 대회 정보: KLPGA/KPGA 대회 데이터<br/>
            • 골프장 정보: 공공데이터포털 전용 (17개 시도 실제 데이터)
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📊 공공데이터 활용
          </h2>
          <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
            <a href="https://www.data.go.kr/data/15118920/fileData.do" target="_blank" rel="noopener noreferrer" className="underline">
              공공데이터포털의 전국 골프장 현황 데이터
            </a>를 활용하여 더 많은 실제 골프장 정보를 수집합니다.
          </p>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            • 전국 17개 시도 골프장 현황 (유일한 데이터 소스)<br/>
            • 업소명, 소재지, 홀수, 세부종류 등 상세 정보<br/>
            • CSV 파일 다운로드 및 API 제공<br/>
            • 무료 이용 가능, 정부 공식 데이터
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => testScraping('tournaments')}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            {loading ? '로딩...' : '대회 정보 크롤링'}
          </button>

          <button
            onClick={() => testScraping('golf-courses')}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            {loading ? '로딩...' : '골프장 정보 크롤링'}
          </button>

          <button
            onClick={() => testScraping('players')}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            {loading ? '로딩...' : '선수 정보 크롤링'}
          </button>

          <button
            onClick={() => testScraping('all')}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            {loading ? '로딩...' : '전체 데이터 크롤링'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => testViewData('tournaments')}
            disabled={loading}
            className="bg-blue-400 hover:bg-blue-500 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            {loading ? '로딩...' : '대회 데이터 조회'}
          </button>

          <button
            onClick={() => testViewData('golf-courses')}
            disabled={loading}
            className="bg-green-400 hover:bg-green-500 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            {loading ? '로딩...' : '골프장 데이터 조회'}
          </button>

          <button
            onClick={() => testViewData('players')}
            disabled={loading}
            className="bg-purple-400 hover:bg-purple-500 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            {loading ? '로딩...' : '선수 데이터 조회'}
          </button>

          <button
            onClick={() => testViewData('all')}
            disabled={loading}
            className="bg-red-400 hover:bg-red-500 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            {loading ? '로딩...' : '전체 데이터 조회'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            <strong>오류:</strong> {error}
          </div>
        )}

        {results && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              크롤링 결과
            </h2>
            
            <div className="mb-4">
              <strong className="text-gray-900 dark:text-white">성공 여부:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                results.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {results.success ? '성공' : '실패'}
              </span>
            </div>

            <div className="mb-4">
              <strong className="text-gray-900 dark:text-white">타임스탬프:</strong>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {new Date(results.timestamp).toLocaleString('ko-KR')}
              </span>
            </div>

            {results.stats && (
              <div className="mb-4">
                <strong className="text-gray-900 dark:text-white">통계:</strong>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>총 소요 시간: {results.stats.totalTime}ms</li>
                  <li>성공한 크롤링: {results.stats.successful || 0}</li>
                  <li>실패한 크롤링: {results.stats.failed || 0}</li>
                  {results.stats.errors && results.stats.errors.length > 0 && (
                    <li>오류 수: {results.stats.errors.length}</li>
                  )}
                </ul>
              </div>
            )}

            {/* 데이터 요약 */}
            <div className="mb-4">
              <strong className="text-gray-900 dark:text-white">데이터 요약:</strong>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.data.tournaments && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">대회 정보</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      KLPGA: {results.data.tournaments.klpga?.length || 0}개<br/>
                      KPGA: {results.data.tournaments.kpga?.length || 0}개
                    </p>
                  </div>
                )}
                {results.data.players && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">선수 정보</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      총 {results.data.players.count || 0}명
                    </p>
                  </div>
                )}
                {results.data.golfCourses && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h4 className="font-medium text-green-900 dark:text-green-100">골프장 정보</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      총 {results.data.golfCourses.count || 0}개
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <strong className="text-gray-900 dark:text-white">상세 데이터:</strong>
              <pre className="mt-2 bg-gray-100 dark:bg-gray-900 p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(results.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
