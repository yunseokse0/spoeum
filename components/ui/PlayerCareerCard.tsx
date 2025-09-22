import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Trophy, 
  Calendar, 
  DollarSign,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp
} from 'lucide-react';
import { PlayerInfo, PlayerCareer } from '@/types';

interface PlayerCareerCardProps {
  player: PlayerInfo;
  className?: string;
}

export function PlayerCareerCard({ player, className }: PlayerCareerCardProps) {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());
  const [showAllCareer, setShowAllCareer] = useState(false);

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getResultColor = (result: string) => {
    if (result.includes('우승') || result.includes('1위')) return 'success';
    if (result.includes('준우승') || result.includes('2위')) return 'warning';
    if (result.includes('Top') || result.includes('상위')) return 'blue';
    return 'secondary';
  };

  const getResultIcon = (result: string) => {
    if (result.includes('우승') || result.includes('1위')) return '🥇';
    if (result.includes('준우승') || result.includes('2위')) return '🥈';
    if (result.includes('3위')) return '🥉';
    return '🏆';
  };

  // 연도별로 그룹화
  const careerByYear = player.career.reduce((acc, career) => {
    if (!acc[career.year]) {
      acc[career.year] = [];
    }
    acc[career.year].push(career);
    return acc;
  }, {} as Record<number, PlayerCareer[]>);

  const sortedYears = Object.keys(careerByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const displayYears = showAllCareer ? sortedYears : sortedYears.slice(0, 3);

  return (
    <Card className={`border-blue-200 dark:border-blue-800 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              {player.name}의 경력
            </h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {player.association}
          </Badge>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* 통계 요약 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">
              {player.career.filter(c => c.result.includes('우승')).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              우승 횟수
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {player.career.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              총 참가
            </div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {player.totalPrize ? formatCurrency(player.totalPrize).replace('₩', '') : '-'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              총 상금
            </div>
          </div>
        </div>

        {/* 연도별 경력 */}
        <div className="space-y-3">
          {displayYears.map((year) => {
            const yearCareer = careerByYear[year];
            const isExpanded = expandedYears.has(year);
            const hasWins = yearCareer.some(c => c.result.includes('우승'));

            return (
              <div
                key={year}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                {/* 연도 헤더 */}
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {year}년
                      </span>
                      {hasWins && (
                        <Badge variant="success" className="text-xs">
                          우승
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {yearCareer.length}회 참가
                      </Badge>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                </button>

                {/* 경력 상세 */}
                {isExpanded && (
                  <div className="p-3 bg-white dark:bg-gray-900">
                    <div className="space-y-2">
                      {yearCareer.map((career, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">
                              {getResultIcon(career.result)}
                            </span>
                            <div>
                              <h6 className="font-medium text-gray-900 dark:text-white">
                                {career.title}
                              </h6>
                              <Badge variant={getResultColor(career.result)} className="text-xs">
                                {career.result}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            {career.prize && career.prize > 0 && (
                              <div className="flex items-center space-x-1 text-sm text-green-600">
                                <DollarSign className="h-4 w-4" />
                                <span>{formatCurrency(career.prize)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 더보기/접기 버튼 */}
        {sortedYears.length > 3 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowAllCareer(!showAllCareer)}
              leftIcon={showAllCareer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            >
              {showAllCareer ? '접기' : `더보기 (${sortedYears.length - 3}개 연도)`}
            </Button>
          </div>
        )}

        {/* 랭킹 정보 */}
        {Object.keys(player.ranking).length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <h6 className="font-semibold text-purple-900 dark:text-purple-100">
                연도별 랭킹
              </h6>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(player.ranking)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([year, rank]) => (
                  <Badge key={year} variant="outline" className="text-xs">
                    {year}: {rank}위
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
