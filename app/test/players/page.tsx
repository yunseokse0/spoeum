"use client";

import { useState } from "react";

interface TestResult {
  message?: string;
  total?: number;
  success?: number;
  failed?: number;
  errors?: string[];
  error?: string;
  details?: string;
}

export default function PlayersTestPage() {
  const [season, setSeason] = useState("2025");
  const [type, setType] = useState("KLPGA");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [progress, setProgress] = useState("");

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    setProgress("🚀 데이터 수집 시작...");

    try {
      const response = await fetch(
        `/api/players/full-update?season=${season}&type=${type}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        setProgress("✅ 완료!");
      } else {
        setProgress("❌ 오류 발생");
      }
    } catch (error) {
      setResult({
        error: "요청 실패",
        details: error instanceof Error ? error.message : String(error),
      });
      setProgress("❌ 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🏌️‍♀️ 선수 데이터 전체 수집 테스트
          </h1>
          <p className="text-gray-600">
            KLPGA 선수 데이터를 스크래핑하고 Gemini AI로 파싱하여 DB에 저장합니다.
          </p>
          <p className="text-sm text-green-600 mt-2">
            ✨ 2025 시즌 데이터 지원
          </p>
        </div>

        {/* 설정 폼 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">⚙️ 설정</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* 시즌 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시즌
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>

            {/* 타입 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                협회
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="KLPGA">KLPGA</option>
                <option value="KPGA">KPGA</option>
              </select>
            </div>
          </div>

          {/* 실행 버튼 */}
          <button
            onClick={handleTest}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                처리 중...
              </span>
            ) : (
              "🚀 데이터 수집 시작"
            )}
          </button>
        </div>

        {/* 진행 상황 */}
        {progress && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📊 진행 상황
            </h2>
            <p className="text-lg text-gray-700">{progress}</p>
          </div>
        )}

        {/* 결과 */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📋 결과
            </h2>

            {result.error ? (
              // 에러
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {result.error}
                    </h3>
                    {result.details && (
                      <div className="mt-2 text-sm text-red-700">
                        <p>{result.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // 성공
              <div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">전체</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {result.total || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">성공</p>
                    <p className="text-3xl font-bold text-green-600">
                      {result.success || 0}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">실패</p>
                    <p className="text-3xl font-bold text-red-600">
                      {result.failed || 0}
                    </p>
                  </div>
                </div>

                {result.message && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                    <p className="text-green-700 font-medium">
                      {result.message}
                    </p>
                  </div>
                )}

                {result.errors && result.errors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      ⚠️ 에러 목록 (최대 10개)
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                      <ul className="space-y-2">
                        {result.errors.map((error, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-700 border-b border-gray-200 pb-2"
                          >
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* JSON 결과 (디버깅용) */}
        {result && (
          <details className="mt-6 bg-gray-100 rounded-lg p-4">
            <summary className="cursor-pointer font-semibold text-gray-700">
              🔍 전체 응답 보기 (개발자용)
            </summary>
            <pre className="mt-4 p-4 bg-gray-800 text-green-400 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

