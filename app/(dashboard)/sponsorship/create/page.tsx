'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar,
  DollarSign,
  Trophy,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Search,
  X
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { SponsorshipProposalForm, ExposureItem, Tournament } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateSponsorshipProposalPage() {
  const router = useRouter();
  const { userType, isAuthenticated } = useAuthStore();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showTournamentSelector, setShowTournamentSelector] = useState(false);
  const [selectedExposureItems, setSelectedExposureItems] = useState<ExposureItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SponsorshipProposalForm>({
    defaultValues: {
      exposureItems: [],
      isTournamentBased: false,
    },
  });

  const isTournamentBased = watch('isTournamentBased');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (userType !== 'sponsor') {
      router.push('/dashboard');
      return;
    }

    fetchTournaments();
  }, [isAuthenticated, router, userType]);

  const fetchTournaments = async () => {
    try {
      const response = await api.getTournaments({ 
        isActive: true,
        limit: 100
      });
      
      if (response.success && response.data) {
        setTournaments(response.data);
      }
    } catch (error) {
      console.error('Fetch tournaments error:', error);
    }
  };

  const onSubmit = async (data: SponsorshipProposalForm) => {
    if (selectedExposureItems.length === 0) {
      toast.error('노출 부위를 최소 1개 이상 선택해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      const proposalData = {
        ...data,
        exposureItems: selectedExposureItems,
        tournamentId: selectedTournament?.id,
      };

      const response = await api.createSponsorshipProposal(proposalData);
      
      if (response.success) {
        toast.success('스폰서십 제안이 전송되었습니다.');
        router.push('/sponsorship');
      } else {
        toast.error(response.message || '스폰서십 제안 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Create sponsorship proposal error:', error);
      toast.error('스폰서십 제안 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExposureItemToggle = (item: ExposureItem) => {
    setSelectedExposureItems(prev => {
      const isSelected = prev.includes(item);
      if (isSelected) {
        return prev.filter(i => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setValue('isTournamentBased', true);
    setValue('startDate', tournament.startDate);
    setValue('endDate', tournament.endDate);
    setShowTournamentSelector(false);
  };

  const handleRemoveTournament = () => {
    setSelectedTournament(null);
    setValue('isTournamentBased', false);
    setValue('startDate', new Date());
    setValue('endDate', new Date());
  };

  const getExposureItemLabel = (item: ExposureItem) => {
    switch (item) {
      case 'golf_bag':
        return '골프백';
      case 'hat':
        return '모자';
      case 'shirt':
        return '상의';
      case 'pants':
        return '하의';
      default:
        return item;
    }
  };

  const exposureItemOptions: { value: ExposureItem; label: string; description: string }[] = [
    { value: 'golf_bag', label: '골프백', description: '골프백에 로고 노출' },
    { value: 'hat', label: '모자', description: '모자에 로고 노출' },
    { value: 'shirt', label: '상의', description: '상의에 로고 노출' },
    { value: 'pants', label: '하의', description: '하의에 로고 노출' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="스폰서십 제안" 
        showBackButton={true}
        showNotificationButton={true}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 노출 부위 선택 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                노출 부위 선택
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                스폰서십을 원하는 부위를 선택해주세요. (복수 선택 가능)
              </p>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-3">
                {exposureItemOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleExposureItemToggle(option.value)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedExposureItems.includes(option.value)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        selectedExposureItems.includes(option.value)
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedExposureItems.includes(option.value) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedExposureItems.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedExposureItems.map((item) => (
                    <Badge key={item} variant="primary" className="flex items-center space-x-1">
                      <span>{getExposureItemLabel(item)}</span>
                      <button
                        type="button"
                        onClick={() => handleExposureItemToggle(item)}
                        className="ml-1 hover:bg-primary-700 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* 계약 기간 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                계약 기간
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* 대회 기반 여부 */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isTournamentBased"
                  {...register('isTournamentBased')}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isTournamentBased" className="text-sm text-gray-700 dark:text-gray-300">
                  대회 기반 계약 (특정 대회 기간 동안만)
                </label>
              </div>

              {/* 대회 선택 */}
              {isTournamentBased && (
                <div>
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
                </div>
              )}

              {/* 일반 기간 입력 */}
              {!isTournamentBased && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="시작일"
                    type="date"
                    leftIcon={<Calendar className="h-5 w-5 text-gray-400" />}
                    {...register('startDate', { valueAsDate: true })}
                  />
                  <Input
                    label="종료일"
                    type="date"
                    leftIcon={<Calendar className="h-5 w-5 text-gray-400" />}
                    {...register('endDate', { valueAsDate: true })}
                  />
                </div>
              )}
            </CardBody>
          </Card>

          {/* 금액 및 메시지 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                제안 내용
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="제안 금액 (원)"
                type="number"
                placeholder="제안 금액을 입력하세요"
                leftIcon={<DollarSign className="h-5 w-5 text-gray-400" />}
                {...register('amount', { valueAsNumber: true })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  제안 메시지
                </label>
                <textarea
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500"
                  placeholder="스폰서십 제안에 대한 상세한 내용을 작성해주세요..."
                  rows={4}
                  {...register('message')}
                />
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
              스폰서십 제안 전송
            </Button>
          </div>
        </form>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
