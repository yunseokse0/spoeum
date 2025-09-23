'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ETLResult {
  success: boolean;
  message: string;
  data: {
    statistics: {
      totalItems: number;
      validItems: number;
      processingTime: number;
      completeness: number;
    };
    export: {
      success: boolean;
      files: string[];
      errors: string[];
    };
    validation: any[];
  };
  errors: string[];
  warnings: string[];
  timestamp: string;
}

interface ETLConfig {
  type: string;
  sources: {
    players: number;
    golfCourses: number;
    tournaments: number;
  };
  validation: {
    enabled: boolean;
    strictMode: boolean;
  };
  export: {
    format: string;
    outputDir: string;
    includeMetadata: boolean;
  };
  quality: {
    minCompleteness: number;
    removeDuplicates: boolean;
  };
}

export default function ETLDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [etlResult, setEtlResult] = useState<ETLResult | null>(null);
  const [etlConfig, setEtlConfig] = useState<ETLConfig | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<'simple' | 'professional'>('simple');
  const [selectedType, setSelectedType] = useState<'all' | 'players' | 'golfCourses' | 'tournaments'>('all');

  // ETL 설정 로드
  useEffect(() => {
    loadETLConfig();
  }, [selectedConfig]);

  const loadETLConfig = async () => {
    try {
      const response = await fetch(`/api/etl/run?config=${selectedConfig}`);
      const data = await response.json();
      if (data.success) {
        setEtlConfig(data.config);
      }
    } catch (error) {
      console.error('ETL 설정 로드 실패:', error);
    }
  };

  const runETL = async () => {
    setIsLoading(true);
    setEtlResult(null);

    try {
      const response = await fetch('/api/etl/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: selectedConfig,
          type: selectedType
        })
      });

      const result = await response.json();
      setEtlResult(result);
    } catch (error) {
      console.error('ETL 실행 실패:', error);
      setEtlResult({
        success: false,
        message: 'ETL 실행 중 오류가 발생했습니다.',
        data: {
          statistics: { totalItems: 0, validItems: 0, processingTime: 0, completeness: 0 },
          export: { success: false, files: [], errors: [] },
          validation: []
        },
        errors: [error instanceof Error ? error.message : '알 수 없는 오류'],
        warnings: [],
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}초`;
    return `${(ms / 60000).toFixed(1)}분`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 전문 ETL 대시보드
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            데이터 추출(Extract), 변환(Transform), 로드(Load) 프로세스 관리
          </p>
        </div>

        {/* 설정 패널 */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ⚙️ ETL 설정
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 설정 타입 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                설정 타입
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="simple"
                    checked={selectedConfig === 'simple'}
                    onChange={(e) => setSelectedConfig(e.target.value as 'simple' | 'professional')}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">간단 설정 (테스트용)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="professional"
                    checked={selectedConfig === 'professional'}
                    onChange={(e) => setSelectedConfig(e.target.value as 'simple' | 'professional')}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">전문 설정 (운영용)</span>
                </label>
              </div>
            </div>

            {/* 데이터 타입 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                데이터 타입
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">전체 데이터</option>
                <option value="players">선수 데이터만</option>
                <option value="golfCourses">골프장 데이터만</option>
                <option value="tournaments">대회 데이터만</option>
              </select>
            </div>
          </div>

          {/* 실행 버튼 */}
          <div className="mt-6">
            <Button
              onClick={runETL}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? '🔄 ETL 실행 중...' : '🚀 ETL 실행'}
            </Button>
          </div>
        </Card>

        {/* ETL 설정 정보 */}
        {etlConfig && (
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📋 현재 ETL 설정
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">데이터 소스</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  선수: {etlConfig.sources.players}개<br/>
                  골프장: {etlConfig.sources.golfCourses}개<br/>
                  대회: {etlConfig.sources.tournaments}개
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">검증 설정</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  검증: {etlConfig.validation.enabled ? '활성' : '비활성'}<br/>
                  엄격모드: {etlConfig.validation.strictMode ? '활성' : '비활성'}
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">출력 설정</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  형식: {etlConfig.export.format}<br/>
                  디렉토리: {etlConfig.export.outputDir}<br/>
                  메타데이터: {etlConfig.export.includeMetadata ? '포함' : '제외'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* ETL 결과 */}
        {etlResult && (
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📊 ETL 실행 결과
            </h2>
            
            {/* 상태 표시 */}
            <div className="mb-6">
              <Badge 
                className={`text-lg px-4 py-2 ${
                  etlResult.success 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-100' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-100'
                }`}
              >
                {etlResult.success ? '✅ 성공' : '❌ 실패'}
              </Badge>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {etlResult.message}
              </p>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {etlResult.data.statistics.totalItems}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">총 항목</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {etlResult.data.statistics.validItems}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">유효 항목</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {etlResult.data.statistics.completeness}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">완성도</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(etlResult.data.statistics.processingTime)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">처리 시간</div>
              </div>
            </div>

            {/* 내보낸 파일 */}
            {etlResult.data.export.files.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  📁 내보낸 파일
                </h3>
                <div className="space-y-2">
                  {etlResult.data.export.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-gray-900 dark:text-white font-mono text-sm">
                        {file}
                      </span>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-100">
                        파일
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 오류 및 경고 */}
            {(etlResult.errors.length > 0 || etlResult.warnings.length > 0) && (
              <div className="space-y-4">
                {etlResult.errors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                      ❌ 오류 ({etlResult.errors.length}개)
                    </h3>
                    <div className="space-y-1">
                      {etlResult.errors.map((error, index) => (
                        <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {etlResult.warnings.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                      ⚠️ 경고 ({etlResult.warnings.length}개)
                    </h3>
                    <div className="space-y-1">
                      {etlResult.warnings.map((warning, index) => (
                        <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">{warning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 타임스탬프 */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                실행 시간: {new Date(etlResult.timestamp).toLocaleString('ko-KR')}
              </p>
            </div>
          </Card>
        )}

        {/* 사용법 안내 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📖 사용법 안내
          </h2>
          
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">1. 설정 선택</h3>
              <p className="text-sm">
                • <strong>간단 설정</strong>: 테스트용으로 빠른 실행<br/>
                • <strong>전문 설정</strong>: 운영용으로 모든 소스 크롤링
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">2. 데이터 타입 선택</h3>
              <p className="text-sm">
                • <strong>전체 데이터</strong>: 선수, 골프장, 대회 모든 데이터<br/>
                • <strong>개별 타입</strong>: 특정 데이터만 크롤링
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">3. ETL 실행</h3>
              <p className="text-sm">
                • 데이터 추출 → 변환 → 검증 → 내보내기 과정 자동 실행<br/>
                • CSV/JSON 파일로 결과 저장
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
