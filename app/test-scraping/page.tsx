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
      const response = await fetch(`/api/data/scrape-all?dataType=${dataType}&mock=false`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || '크롤링 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  const testViewData = async (dataType: string) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`/api/data/view?dataType=${dataType}&mock=false`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || '데이터 조회 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
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

            {results.stats && (
              <div className="mb-4">
                <strong className="text-gray-900 dark:text-white">통계:</strong>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>총 소요 시간: {results.stats.totalTime}ms</li>
                  <li>성공한 크롤링: {results.stats.successful}</li>
                  <li>실패한 크롤링: {results.stats.failed}</li>
                </ul>
              </div>
            )}

            <div className="mb-4">
              <strong className="text-gray-900 dark:text-white">데이터:</strong>
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
