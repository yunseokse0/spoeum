import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Search, 
  User, 
  Calendar,
  Trophy,
  Award,
  Loader,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { PlayerInfo, GolfAssociation } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface PlayerSearchFormProps {
  onPlayerFound?: (player: PlayerInfo) => void;
  onClear?: () => void;
  className?: string;
}

export function PlayerSearchForm({ 
  onPlayerFound, 
  onClear,
  className 
}: PlayerSearchFormProps) {
  const [memberId, setMemberId] = useState('');
  const [association, setAssociation] = useState<GolfAssociation>('KLPGA');
  const [isSearching, setIsSearching] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!memberId.trim()) {
      toast.error('회원번호를 입력해주세요.');
      return;
    }

    setIsSearching(true);
    setError(null);
    setPlayerInfo(null);

    try {
      const response = await api.searchPlayer(memberId.trim(), association);
      
      if (response.success && response.data) {
        setPlayerInfo(response.data);
        onPlayerFound?.(response.data);
        toast.success('선수 정보를 찾았습니다!');
      } else {
        setError(response.error || '선수를 찾을 수 없습니다.');
        toast.error(response.error || '선수를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('선수 검색 오류:', error);
      setError('선수 정보 조회 중 오류가 발생했습니다.');
      toast.error('선수 정보 조회 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setMemberId('');
    setPlayerInfo(null);
    setError(null);
    onClear?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 검색 폼 */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              골프 선수 정보 조회
            </h3>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {/* 협회 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              협회 선택
            </label>
            <div className="flex space-x-2">
              {(['KLPGA', 'KPGA'] as GolfAssociation[]).map((assoc) => (
                <button
                  key={assoc}
                  onClick={() => setAssociation(assoc)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${association === assoc
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {assoc}
                </button>
              ))}
            </div>
          </div>

          {/* 회원번호 입력 */}
          <div className="flex space-x-2">
            <Input
              label="회원번호"
              placeholder="회원번호를 입력하세요"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              onKeyPress={handleKeyPress}
              leftIcon={<User className="h-5 w-5 text-blue-400" />}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              loading={isSearching}
              disabled={isSearching || !memberId.trim()}
              className="px-6"
              leftIcon={<Search className="h-5 w-5" />}
            >
              {isSearching ? '조회중...' : '조회'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 오류 메시지 */}
      {error && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardBody className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setError(null)}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardBody>
        </Card>
      )}

      {/* 선수 정보 표시 */}
      {playerInfo && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-semibold text-green-900 dark:text-green-100">
                  선수 정보
                </h4>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClear}
                className="text-green-600 hover:text-green-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* 기본 정보 */}
            <div className="flex items-start space-x-4">
              {playerInfo.profileImage && (
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl overflow-hidden">
                  <img
                    src={playerInfo.profileImage}
                    alt={playerInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h5 className="text-xl font-bold text-gray-900 dark:text-white">
                    {playerInfo.name}
                  </h5>
                  <Badge variant="blue">{playerInfo.association}</Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{playerInfo.birth}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>회원번호: {playerInfo.memberId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 통계 정보 */}
            <div className="grid grid-cols-2 gap-4">
              {playerInfo.currentRanking && (
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {playerInfo.currentRanking}위
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    현재 랭킹
                  </div>
                </div>
              )}
              {playerInfo.totalPrize && (
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {new Intl.NumberFormat('ko-KR').format(playerInfo.totalPrize)}원
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    총 상금
                  </div>
                </div>
              )}
            </div>

            {/* 경력 정보 */}
            {playerInfo.career.length > 0 && (
              <div>
                <h6 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  주요 경력
                </h6>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {playerInfo.career.slice(0, 5).map((career, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {career.title}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {career.year}
                        </div>
                        <div className="text-sm font-semibold text-green-600">
                          {career.result}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
