'use client';

import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Bot, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Trophy,
  DollarSign,
  Users
} from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  response?: any;
  error?: string;
  timestamp?: string;
}

export default function TestGeminiPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [customPrompt, setCustomPrompt] = useState('골프 대회 결과를 분석해주세요.');

  // 기본 Gemini API 테스트
  const testBasicGemini = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-gemini');
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'API 호출 실패',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 골프 대회 결과 파싱 테스트
  const testGolfResults = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/gemini/tournament-results');
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        message: '골프 대회 결과 파싱 테스트 실패',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 커스텀 프롬프트 테스트
  const testCustomPrompt = async () => {
    if (!customPrompt.trim()) return;

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: customPrompt
        })
      });
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        message: '커스텀 프롬프트 테스트 실패',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Bot className="h-12 w-12 text-blue-500 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Gemini API 테스트
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Vercel에서 Gemini API가 정상적으로 작동하는지 확인합니다
          </p>
        </div>

        {/* 테스트 버튼들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody className="p-6 text-center">
              <Bot className="h-8 w-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">기본 API 테스트</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Gemini API 연결 및 기본 응답 테스트
              </p>
              <Button
                onClick={testBasicGemini}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Bot className="h-4 w-4 mr-2" />
                )}
                기본 테스트
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 text-center">
              <Trophy className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">골프 대회 파싱</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                골프 대회 결과 데이터 파싱 테스트
              </p>
              <Button
                onClick={testGolfResults}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trophy className="h-4 w-4 mr-2" />
                )}
                골프 파싱 테스트
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">커스텀 프롬프트</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                사용자 정의 프롬프트로 테스트
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="프롬프트를 입력하세요..."
                />
                <Button
                  onClick={testCustomPrompt}
                  disabled={isLoading || !customPrompt.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Users className="h-4 w-4 mr-2" />
                  )}
                  커스텀 테스트
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 결과 표시 */}
        {testResult && (
          <Card className="mb-8">
            <CardBody className="p-6">
              <div className="flex items-center mb-4">
                {testResult.success ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 mr-3" />
                )}
                <h3 className="text-xl font-bold">
                  {testResult.success ? '테스트 성공!' : '테스트 실패'}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">메시지:</h4>
                  <p className="text-gray-600 dark:text-gray-400">{testResult.message}</p>
                </div>

                {testResult.error && (
                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">오류:</h4>
                    <p className="text-red-600 dark:text-red-400">{testResult.error}</p>
                  </div>
                )}

                {testResult.timestamp && (
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">실행 시간:</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(testResult.timestamp).toLocaleString('ko-KR')}
                    </p>
                  </div>
                )}

                {testResult.response && (
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">응답 데이터:</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                      {JSON.stringify(testResult.response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* 환경 정보 */}
        <Card>
          <CardBody className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Bot className="h-5 w-5 mr-2 text-blue-500" />
              환경 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">API 엔드포인트:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• GET /api/test-gemini - 기본 테스트</li>
                  <li>• POST /api/test-gemini - 커스텀 프롬프트</li>
                  <li>• GET /api/gemini/tournament-results - 골프 파싱</li>
                  <li>• POST /api/gemini/tournament-results - 실제 파싱</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">환경변수:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• geminiAPI: {process.env.NODE_ENV === 'development' ? '로컬 설정' : 'Vercel 설정'}</li>
                  <li>• 환경: {process.env.NODE_ENV}</li>
                  <li>• 플랫폼: Vercel</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
