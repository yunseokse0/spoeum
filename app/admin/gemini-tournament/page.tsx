'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Bot, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Trophy,
  Upload,
  Save,
  FileText,
  AlertCircle,
  Database,
  Sparkles
} from 'lucide-react';

interface TournamentResult {
  player_name: string;
  rank: number;
  score: number;
  prize_amount: number;
}

interface ParsedData {
  tournament_name: string;
  results: TournamentResult[];
}

interface TournamentInfo {
  id: string;
  name: string;
  date: string;
}

export default function GeminiTournamentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const [rawData, setRawData] = useState('');
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savedToDb, setSavedToDb] = useState(false);
  
  // 새로운 상태: 년도, 협회, 대회 목록
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedAssociation, setSelectedAssociation] = useState<'KPGA' | 'KLPGA'>('KLPGA');
  const [tournaments, setTournaments] = useState<TournamentInfo[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>('');
  
  // 탭 상태
  const [activeTab, setActiveTab] = useState<'past' | 'upcoming'>('past');
  const [upcomingTournaments, setUpcomingTournaments] = useState<any[]>([]);

  // 년도 목록 생성 (현재 년도부터 2020년까지)
  const years = Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => 
    (new Date().getFullYear() - i).toString()
  );

  // 대회 목록 가져오기
  const fetchTournaments = async () => {
    setIsLoading(true);
    setError(null);
    setTournaments([]);
    setSelectedTournament('');

    try {
      const response = await fetch(
        `/api/admin/tournaments/list?year=${selectedYear}&association=${selectedAssociation}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '대회 목록을 가져올 수 없습니다.');
      }

      setTournaments(data.data || []);
      if (data.data && data.data.length > 0) {
        setSuccess(`${data.data.length}개의 대회를 찾았습니다.`);
      } else {
        setError('해당 년도/협회의 대회가 없습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '대회 목록 조회 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 선택한 대회의 결과 데이터 가져오기
  const fetchTournamentData = async (tournamentId: string) => {
    if (!tournamentId) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/admin/tournaments/fetch-results?tournamentId=${tournamentId}&association=${selectedAssociation}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '대회 데이터를 가져올 수 없습니다.');
      }

      setTournamentName(data.tournament_name || '');
      setRawData(data.raw_data || '');
      setSuccess('대회 데이터를 가져왔습니다. 데이터를 검증해주세요.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '대회 데이터 조회 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 샘플 데이터 로드
  const loadSampleData = () => {
    setTournamentName('2024 KLPGA 챔피언십');
    setRawData(`
2024 KLPGA 챔피언십 최종 결과

1위 김효주 - 14언더파 (상금 2억원)
2위 박민지 - 12언더파 (상금 1억2천만원)
3위 이정은 - 10언더파 (상금 8천만원)
4위 최혜진 - 8언더파 (상금 6천만원)
5위 전인지 - 6언더파 (상금 4천만원)
6위 박성현 - 4언더파 (상금 3천만원)
7위 김세영 - 2언더파 (상금 2천5백만원)
8위 고진영 - 이븐파 (상금 2천만원)
9위 유소연 - 1오버파 (상금 1천5백만원)
10위 안선주 - 2오버파 (상금 1천만원)
    `);
    setError(null);
    setSuccess('샘플 데이터가 로드되었습니다.');
  };

  // 대회 결과 검증
  const parseWithGemini = async () => {
    if (!tournamentName.trim() || !rawData.trim()) {
      setError('대회명과 결과 데이터를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setParsedData(null);
    setSavedToDb(false);

    try {
      const response = await fetch('/api/gemini/tournament-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournamentName,
          rawResults: rawData
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '검증 실패');
      }

      setParsedData({
        tournament_name: data.tournament_name,
        results: data.results || []
      });
      setSuccess('대회 결과가 성공적으로 검증되었습니다!');

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 데이터베이스에 저장
  const saveTournamentResults = async () => {
    if (!parsedData) {
      setError('먼저 데이터를 검증해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/tournaments/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '저장 실패');
      }

      setSavedToDb(true);
      setSuccess(`대회 결과가 데이터베이스에 저장되었습니다! (${data.saved_count}건)`);

    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 예정된 대회 목록 가져오기
  const fetchUpcomingTournaments = async () => {
    setIsLoading(true);
    setError(null);
    setUpcomingTournaments([]);

    try {
      const response = await fetch(
        `/api/admin/tournaments/upcoming?year=${selectedYear}&association=${selectedAssociation}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '예정된 대회를 가져올 수 없습니다.');
      }

      setUpcomingTournaments(data.data || []);
      if (data.data && data.data.length > 0) {
        setSuccess(`${data.data.length}개의 예정된 대회를 찾았습니다.`);
      } else {
        setError('예정된 대회가 없습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '예정된 대회 조회 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 새로 시작
  const resetForm = () => {
    setTournamentName('');
    setRawData('');
    setParsedData(null);
    setError(null);
    setSuccess(null);
    setSavedToDb(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Bot className="h-8 w-8 mr-3 text-blue-500" />
              대회 데이터 자동 입력
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              골프 대회 결과를 자동으로 검증하여 데이터베이스에 저장합니다
            </p>
          </div>
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
            <Sparkles className="w-4 h-4 mr-1" />
            자동 검증
          </Badge>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Trophy className="w-5 h-5 inline mr-2" />
              지난 대회 결과 입력
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              예정된 대회 조회
            </button>
          </div>
        </div>

        {/* 알림 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">오류</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">성공</h3>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* 지난 대회 결과 입력 탭 */}
        {activeTab === 'past' && (
          <>
        {/* 대회 데이터 가져오기 */}
        <Card className="border-blue-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-blue-500" />
              대회 데이터 자동 가져오기
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 년도 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    년도 선택
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    ))}
                  </select>
                </div>

                {/* 협회 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    협회 선택
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="association"
                        value="KLPGA"
                        checked={selectedAssociation === 'KLPGA'}
                        onChange={(e) => setSelectedAssociation(e.target.value as 'KLPGA')}
                        className="w-4 h-4 text-blue-600"
                        disabled={isLoading}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        KLPGA (여자)
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="association"
                        value="KPGA"
                        checked={selectedAssociation === 'KPGA'}
                        onChange={(e) => setSelectedAssociation(e.target.value as 'KPGA')}
                        className="w-4 h-4 text-blue-600"
                        disabled={isLoading}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        KPGA (남자)
                      </span>
                    </label>
                  </div>
                </div>

                {/* 검색 버튼 */}
                <div className="flex items-end">
                  <Button
                    onClick={fetchTournaments}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        검색 중...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        대회 검색
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* 대회 목록 */}
              {tournaments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    대회 선택
                  </label>
                  <select
                    value={selectedTournament}
                    onChange={(e) => {
                      setSelectedTournament(e.target.value);
                      fetchTournamentData(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="">대회를 선택하세요</option>
                    {tournaments.map((tournament) => (
                      <option key={tournament.id} value={tournament.id}>
                        {tournament.name} ({tournament.date})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* 입력 폼 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                대회 결과 입력
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={loadSampleData}
                disabled={isLoading}
              >
                <Upload className="w-4 h-4 mr-2" />
                샘플 데이터
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {/* 대회명 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  대회명 *
                </label>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  placeholder="예: 2024 KLPGA 챔피언십"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>

              {/* 결과 데이터 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  대회 결과 데이터 *
                </label>
                <textarea
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                  placeholder={`대회 결과를 붙여넣으세요. 예시:

1위 김효주 - 14언더파 (상금 2억원)
2위 박민지 - 12언더파 (상금 1억2천만원)
3위 이정은 - 10언더파 (상금 8천만원)
...`}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  ℹ️ 순위, 선수명, 스코어, 상금 정보가 포함된 텍스트 형식의 데이터를 입력하세요.
                </p>
              </div>

              {/* 검증 버튼 */}
              <Button
                onClick={parseWithGemini}
                disabled={isLoading || !tournamentName.trim() || !rawData.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    데이터 검증 중...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    데이터 검증하기
                  </>
                )}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* 검증 결과 */}
        {parsedData && (
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-green-500" />
                  검증 결과
                </h3>
                <Badge variant="success">
                  {parsedData.results.length}명의 선수
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {/* 대회명 */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    대회명
                  </h4>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {parsedData.tournament_name}
                  </p>
                </div>

                {/* 결과 테이블 */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">순위</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">선수명</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">스코어</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">상금</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {parsedData.results.map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Badge variant={result.rank === 1 ? 'warning' : result.rank <= 3 ? 'success' : 'secondary'}>
                              {result.rank}위
                            </Badge>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            {result.player_name}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                            {result.score > 0 ? `+${result.score}` : result.score}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-blue-600 dark:text-blue-400">
                            {result.prize_amount.toLocaleString()}원
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 저장 버튼 */}
                <div className="flex space-x-3">
                  <Button
                    onClick={saveTournamentResults}
                    disabled={isLoading || savedToDb}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {savedToDb ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        저장 완료
                      </>
                    ) : (
                      <>
                        <Database className="w-5 h-5 mr-2" />
                        데이터베이스에 저장
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    disabled={isLoading}
                    size="lg"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    새로 시작
                  </Button>
                </div>

                {savedToDb && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-sm text-green-700">
                        데이터베이스에 성공적으로 저장되었습니다. 대회 결과 페이지에서 확인할 수 있습니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* 사용 가이드 (지난 대회) */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
              사용 가이드 - 지난 대회 결과 입력
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start">
                <span className="font-semibold text-blue-600 mr-2">1.</span>
                <p>대회명을 입력합니다 (예: 2024 KLPGA 챔피언십)</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-blue-600 mr-2">2.</span>
                <p>대회 결과 데이터를 텍스트 형식으로 붙여넣습니다 (순위, 선수명, 스코어, 상금 포함)</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-blue-600 mr-2">3.</span>
                <p>"데이터 검증하기" 버튼을 클릭하여 데이터를 자동으로 검증합니다</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-blue-600 mr-2">4.</span>
                <p>검증 결과를 확인하고, 정확하다면 "데이터베이스에 저장" 버튼을 클릭합니다</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-blue-600 mr-2">5.</span>
                <p>저장이 완료되면 대회 관리 페이지에서 결과를 확인할 수 있습니다</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>💡 팁:</strong> "샘플 데이터" 버튼을 클릭하면 예시 데이터로 테스트해볼 수 있습니다.
              </p>
            </div>
          </CardBody>
        </Card>
          </>
        )}

        {/* 예정된 대회 조회 탭 */}
        {activeTab === 'upcoming' && (
          <>
        {/* 예정된 대회 검색 */}
        <Card className="border-green-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-green-500" />
              예정된 대회 검색
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 년도 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    년도 선택
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    ))}
                  </select>
                </div>

                {/* 협회 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    협회 선택
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="association-upcoming"
                        value="KLPGA"
                        checked={selectedAssociation === 'KLPGA'}
                        onChange={(e) => setSelectedAssociation(e.target.value as 'KLPGA')}
                        className="w-4 h-4 text-green-600"
                        disabled={isLoading}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        KLPGA (여자)
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="association-upcoming"
                        value="KPGA"
                        checked={selectedAssociation === 'KPGA'}
                        onChange={(e) => setSelectedAssociation(e.target.value as 'KPGA')}
                        className="w-4 h-4 text-green-600"
                        disabled={isLoading}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        KPGA (남자)
                      </span>
                    </label>
                  </div>
                </div>

                {/* 검색 버튼 */}
                <div className="flex items-end">
                  <Button
                    onClick={fetchUpcomingTournaments}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        검색 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        예정된 대회 검색
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 예정된 대회 목록 */}
        {upcomingTournaments.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-green-500" />
                예정된 대회 목록 ({upcomingTournaments.length}개)
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {upcomingTournaments.map((tournament, index) => (
                  <div
                    key={tournament.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={tournament.status === 'upcoming' ? 'blue' : 'secondary'}>
                            {tournament.status === 'upcoming' ? '예정' : '진행중'}
                          </Badge>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {tournament.name}
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">협회:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {tournament.association}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">일정:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {tournament.start_date} ~ {tournament.end_date}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">장소:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {tournament.location}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">상금:</span>
                            <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">
                              {tournament.prize_money ? `${(tournament.prize_money / 100000000).toFixed(1)}억원` : 'TBD'}
                            </span>
                          </div>
                        </div>
                        {tournament.description && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {tournament.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* 사용 가이드 (예정된 대회) */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-green-500" />
              사용 가이드 - 예정된 대회 조회
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start">
                <span className="font-semibold text-green-600 mr-2">1.</span>
                <p>년도를 선택합니다 (현재 년도 또는 내년)</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-green-600 mr-2">2.</span>
                <p>협회를 선택합니다 (KLPGA 여자 또는 KPGA 남자)</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-green-600 mr-2">3.</span>
                <p>"예정된 대회 검색" 버튼을 클릭하여 예정된 대회 목록을 확인합니다</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-green-600 mr-2">4.</span>
                <p>각 대회의 상세 정보(일정, 장소, 상금)를 확인할 수 있습니다</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>💡 참고:</strong> 예정된 대회 정보는 KPGA/KLPGA 공식 데이터를 기반으로 합니다.
              </p>
            </div>
          </CardBody>
        </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

