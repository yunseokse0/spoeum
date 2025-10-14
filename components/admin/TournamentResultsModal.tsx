'use client';

import React from 'react';
import { X, Trophy, Medal, Award, User, Target, DollarSign } from 'lucide-react';

interface TournamentResult {
  id?: string;
  rank: number;
  player_name: string;
  score: number;
  prize_amount: number;
}

interface TournamentResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentName: string;
  results: TournamentResult[];
  isLoading: boolean;
}

export const TournamentResultsModal: React.FC<TournamentResultsModalProps> = ({
  isOpen,
  onClose,
  tournamentName,
  results,
  isLoading
}) => {
  if (!isOpen) return null;

  // 순위별 아이콘 및 색상
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 2:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 3:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 0) return 'text-green-600 dark:text-green-400';
    if (score > 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {tournamentName} - 대회 결과
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">대회 결과를 불러오는 중...</p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">대회 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 결과 요약 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      참가자 수
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {results.length}명
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      우승 스코어
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${getScoreColor(results[0]?.score || 0)}`}>
                    {results[0]?.score > 0 ? `+${results[0].score}` : results[0]?.score || 0}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      총 상금
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {results.reduce((sum, result) => sum + result.prize_amount, 0).toLocaleString()}원
                  </p>
                </div>
              </div>

              {/* 결과 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        순위
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        선수명
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        스코어
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        상금
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {results.slice(0, 30).map((result, index) => (
                      <tr key={result.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${getRankColor(result.rank)}`}>
                              {result.rank}
                            </span>
                            {getRankIcon(result.rank)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {result.player_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-bold text-lg ${getScoreColor(result.score)}`}>
                            {result.score > 0 ? `+${result.score}` : result.score}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {result.prize_amount.toLocaleString()}원
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {results.length > 30 && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  상위 30위까지만 표시됩니다. (총 {results.length}명 참가)
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
