'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Trophy,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Medal,
  Search,
  RefreshCw,
  ChevronRight,
  Award
} from 'lucide-react';

interface TournamentResult {
  id: string;
  player_name: string;
  rank: number;
  score: number;
  prize_amount: number;
}

interface Tournament {
  id: string;
  name: string;
  association: string;
  start_date: string;
  end_date: string;
  location: string;
  prize_money: number;
  status: string;
  results_count: number;
  created_at: string;
}

export default function TournamentResultsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [results, setResults] = useState<TournamentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 대회 목록 가져오기
  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/tournaments/results');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '대회 목록을 가져올 수 없습니다.');
      }

      setTournaments(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '대회 목록 조회 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 대회 결과 가져오기
  const fetchTournamentResults = async (tournamentId: string) => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(`/api/admin/tournaments/results?tournamentId=${tournamentId}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '대회 결과를 가져올 수 없습니다.');
      }

      setResults(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '대회 결과 조회 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 대회 선택
  const handleSelectTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    fetchTournamentResults(tournament.id);
  };

  // 검색 필터링
  const filteredTournaments = tournaments.filter(tournament =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tournament.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 메달 아이콘 가져오기
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  // 순위 뱃지 색상
  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return 'warning';
    if (rank <= 3) return 'success';
    if (rank <= 10) return 'blue';
    return 'secondary';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Trophy className="h-8 w-8 mr-3 text-blue-500" />
              대회 결과 조회
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              저장된 골프 대회 결과를 조회하고 순위별 상금을 확인합니다
            </p>
          </div>
          <Button
            onClick={fetchTournaments}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            새로고침
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 대회 목록 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    대회 목록 ({filteredTournaments.length})
                  </h3>
                </div>
                {/* 검색 */}
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="대회명 또는 장소 검색..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredTournaments.map((tournament) => (
                    <button
                      key={tournament.id}
                      onClick={() => handleSelectTournament(tournament)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedTournament?.id === tournament.id
                          ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700'
                          : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant={tournament.association === 'KLPGA' ? 'success' : 'blue'} className="text-xs">
                              {tournament.association}
                            </Badge>
                            {tournament.results_count > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {tournament.results_count}명
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                            {tournament.name}
                          </h4>
                          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {tournament.start_date}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {tournament.location}
                            </div>
                          </div>
                        </div>
                        {selectedTournament?.id === tournament.id && (
                          <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}

                  {filteredTournaments.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>검색 결과가 없습니다</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* 오른쪽: 대회 결과 상세 */}
          <div className="lg:col-span-2">
            {selectedTournament ? (
              <Card>
                <CardHeader>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={selectedTournament.association === 'KLPGA' ? 'success' : 'blue'}>
                            {selectedTournament.association}
                          </Badge>
                          <Badge variant="secondary">
                            {selectedTournament.status === 'completed' ? '완료' : '진행중'}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedTournament.name}
                        </h3>
                      </div>
                      <Award className="w-8 h-8 text-blue-500" />
                    </div>

                    {/* 대회 정보 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          일정
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedTournament.start_date}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          장소
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedTournament.location}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <DollarSign className="w-4 h-4 mr-1" />
                          총 상금
                        </div>
                        <p className="font-medium text-blue-600 dark:text-blue-400">
                          {selectedTournament.prize_money ? `${(selectedTournament.prize_money / 100000000).toFixed(1)}억원` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <Users className="w-4 h-4 mr-1" />
                          결과 수
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedTournament.results_count}명
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-500" />
                      <p className="text-gray-600 dark:text-gray-400">대회 결과를 불러오는 중...</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              순위
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              선수명
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              스코어
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              상금
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {results.slice(0, 30).map((result, index) => (
                            <tr 
                              key={result.id}
                              className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                                result.rank <= 3 ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                              }`}
                            >
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  {getMedalIcon(result.rank)}
                                  <Badge variant={getRankBadgeVariant(result.rank)}>
                                    {result.rank}위
                                  </Badge>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {result.player_name}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className={`font-medium ${
                                  result.score < 0 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : result.score > 0 
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {result.score > 0 ? `+${result.score}` : result.score}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                  {result.prize_amount.toLocaleString()}원
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {results.length > 30 && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                          <p className="text-sm text-yellow-800">
                            총 {results.length}명 중 상위 30명만 표시됩니다.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>저장된 대회 결과가 없습니다</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            ) : (
              <Card>
                <CardBody>
                  <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">대회를 선택하세요</h3>
                    <p className="text-sm">
                      왼쪽 목록에서 대회를 선택하면 상세 결과를 확인할 수 있습니다
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

