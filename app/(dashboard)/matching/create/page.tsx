'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar,
  MapPin,
  DollarSign,
  Trophy,
  ChevronDown,
  ChevronUp,
  Search,
  X
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { Tournament, MatchingRequestFormData } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ExtendedMatchingRequestFormData extends MatchingRequestFormData {
  tournamentId?: string;
}

export default function CreateMatchingRequestPage() {
  const router = useRouter();
  const { userType, isAuthenticated } = useAuthStore();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showTournamentSelector, setShowTournamentSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExtendedMatchingRequestFormData>({
    resolver: zodResolver({
      title: { required: true },
      description: { required: true },
      location: { required: true },
      date: { required: true },
      budget: { required: true, min: 0 },
      targetType: { required: true },
    }),
    defaultValues: {
      targetType: 'caddy',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchTournaments();
  }, [isAuthenticated, router]);

  const fetchTournaments = async () => {
    try {
      const response = await api.getTournaments({ 
        isActive: true,
        isRegistrationOpen: true,
        limit: 100
      });
      
      if (response.success && response.data) {
        setTournaments(response.data);
      }
    } catch (error) {
      console.error('Fetch tournaments error:', error);
    }
  };

  const onSubmit = async (data: ExtendedMatchingRequestFormData) => {
    setIsLoading(true);
    
    try {
      const requestData = {
        ...data,
        tournamentId: selectedTournament?.id,
      };

      const response = await api.createMatchingRequest(requestData);
      
      if (response.success) {
        toast.success('매칭 요청이 생성되었습니다.');
        router.push('/matching');
      } else {
        toast.error(response.message || '매칭 요청 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Create matching request error:', error);
      toast.error('매칭 요청 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setValue('title', `${tournament.name} 캐디 매칭 요청`);
    setValue('location', tournament.location);
    setValue('date', tournament.startDate);
    setShowTournamentSelector(false);
  };

  const handleRemoveTournament = () => {
    setSelectedTournament(null);
    setValue('title', '');
    setValue('location', '');
    setValue('date', new Date());
  };

  const getTargetTypeLabel = (type: string) => {
    switch (type) {
      case 'caddy':
        return '캐디';
      case 'tour_pro':
        return '투어프로';
      case 'amateur':
        return '아마추어';
      case 'agency':
        return '에이전시';
      default:
        return type;
    }
  };

  const canCreateRequest = () => {
    return userType === 'tour_pro' || userType === 'amateur' || userType === 'agency';
  };

  if (!canCreateRequest()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            권한이 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            매칭 요청을 생성할 수 있는 권한이 없습니다.
          </p>
          <Button onClick={() => router.back()}>
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="매칭 요청 생성" 
        showBackButton={true}
        showNotificationButton={true}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 대회 선택 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                대회 선택 (선택사항)
              </h3>
            </CardHeader>
            <CardBody>
              {selectedTournament ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-8 w-8 text-primary-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {selectedTournament.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedTournament.location} • {formatDate(selectedTournament.startDate)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveTournament}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTournamentSelector(!showTournamentSelector)}
                    className="w-full"
                    rightIcon={showTournamentSelector ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  >
                    대회를 선택하세요
                  </Button>
                  
                  {showTournamentSelector && (
                    <div className="mt-4 max-h-64 overflow-y-auto space-y-2">
                      {tournaments.map((tournament) => (
                        <div
                          key={tournament.id}
                          onClick={() => handleTournamentSelect(tournament)}
                          className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {tournament.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {tournament.location} • {formatDate(tournament.startDate)}
                              </p>
                            </div>
                            <Badge variant="primary">
                              {tournament.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                기본 정보
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* 제목 */}
              <Input
                label="제목"
                placeholder="매칭 요청 제목을 입력하세요"
                error={errors.title?.message}
                {...register('title')}
              />

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  설명
                </label>
                <textarea
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500"
                  placeholder="상세한 설명을 입력하세요"
                  rows={4}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
                )}
              </div>

              {/* 위치 */}
              <Input
                label="위치"
                placeholder="위치를 입력하세요"
                leftIcon={<MapPin className="h-5 w-5 text-gray-400" />}
                error={errors.location?.message}
                {...register('location')}
              />

              {/* 날짜 */}
              <Input
                label="날짜"
                type="date"
                leftIcon={<Calendar className="h-5 w-5 text-gray-400" />}
                error={errors.date?.message}
                {...register('date', { valueAsDate: true })}
              />

              {/* 예산 */}
              <Input
                label="예산 (원)"
                type="number"
                placeholder="예산을 입력하세요"
                leftIcon={<DollarSign className="h-5 w-5 text-gray-400" />}
                error={errors.budget?.message}
                {...register('budget', { valueAsNumber: true })}
              />

              {/* 대상 타입 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  대상 타입
                </label>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  {...register('targetType')}
                >
                  <option value="caddy">캐디</option>
                  <option value="tour_pro">투어프로</option>
                  <option value="amateur">아마추어</option>
                  <option value="agency">에이전시</option>
                </select>
                {errors.targetType && (
                  <p className="mt-1 text-sm text-error-600">{errors.targetType.message}</p>
                )}
              </div>
            </CardBody>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              className="flex-1"
            >
              매칭 요청 생성
            </Button>
          </div>
        </form>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
