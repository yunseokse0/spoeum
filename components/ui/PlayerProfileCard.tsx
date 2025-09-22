import React from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Star, 
  Trophy, 
  Users, 
  MapPin,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface PlayerProfileCardProps {
  player: {
    id: string;
    name: string;
    profileImage?: string;
    rating: number;
    followers: number;
    achievements: string[];
    location: string;
    career: number;
    recentPerformance: {
      tournament: string;
      rank: number;
      date: string;
    }[];
  };
  onPropose?: () => void;
  className?: string;
}

export function PlayerProfileCard({ player, onPropose, className }: PlayerProfileCardProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank <= 3) return 'text-orange-500';
    if (rank <= 10) return 'text-blue-500';
    return 'text-gray-500';
  };

  return (
    <Card className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 ${className}`}>
      <CardBody className="p-6">
        {/* 프로필 헤더 */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center overflow-hidden">
              {player.profileImage ? (
                <img
                  src={player.profileImage}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {player.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {player.name}
              </h3>
              <Badge variant="primary" className="text-xs">
                투어프로
              </Badge>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{player.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span>팔로워 {formatFollowers(player.followers)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>{player.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 성과 섹션 */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              주요 성과
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {player.achievements.map((achievement, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {achievement}
              </Badge>
            ))}
          </div>
        </div>

        {/* 최근 성과 */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              최근 성과
            </h4>
          </div>
          <div className="space-y-2">
            {player.recentPerformance.slice(0, 2).map((performance, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {performance.tournament}
                  </span>
                </div>
                <span className={`font-semibold ${getRankColor(performance.rank)}`}>
                  {performance.rank}위
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {player.career}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              경력(년)
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {player.achievements.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              우승 횟수
            </div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {player.rating}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              평점
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        {onPropose && (
          <Button
            onClick={onPropose}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg"
            leftIcon={<Star className="h-5 w-5" />}
          >
            스폰서십 제안하기
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
