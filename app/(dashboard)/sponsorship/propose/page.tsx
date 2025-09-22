'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PlayerProfileCard } from '@/components/ui/PlayerProfileCard';
import { ExposureSelector } from '@/components/ui/ExposureSelector';
import { 
  Calendar,
  DollarSign,
  Trophy,
  MessageSquare,
  Send,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { SponsorshipProposalForm, ExposureItem, Tournament } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

function SponsorshipProposeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userType, isAuthenticated } = useAuthStore();
  const [selectedExposureItems, setSelectedExposureItems] = useState<ExposureItem[]>([]);
  const [isTournamentBased, setIsTournamentBased] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 임시 선수 데이터
  const mockPlayer = {
    id: '1',
    name: '김투어프로',
    profileImage: '/images/players/kim-tour-pro.jpg',
    rating: 4.8,
    followers: 12500,
    achievements: ['PGA 투어 우승 3회', 'KPGA 투어 우승 7회'],
    location: '서울',
    career: 8,
    recentPerformance: [
      { tournament: '2024 PGA 투어 한국 오픈', rank: 2, date: '2024-03-17' },
      { tournament: '2024 제네시스 챔피언십', rank: 1, date: '2024-04-22' }
    ]
  };

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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (userType !== 'sponsor') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, router, userType]);

  const onSubmit = async (data: SponsorshipProposalForm) => {
    if (selectedExposureItems.length === 0) {
      toast.error('노출 부위를 최소 1개 이상 선택해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      const proposalData = {
        ...data,
        playerId: searchParams.get('playerId') || '1',
        exposureItems: selectedExposureItems,
        isTournamentBased,
        tournamentId: selectedTournament?.id,
      };

      const response = await api.createSponsorshipProposal(proposalData);
      
      if (response.success) {
        toast.success('스폰서십 제안이 전송되었습니다! 🎉');
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

  const handleProposeClick = () => {
    // 제안 폼으로 스크롤
    const formElement = document.getElementById('proposal-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="스폰서십 제안" 
        showBackButton={true}
        showNotificationButton={true}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6 space-y-6">
        {/* 선수 프로필 카드 */}
        <PlayerProfileCard
          player={mockPlayer}
          onPropose={handleProposeClick}
        />

        {/* 제안 폼 */}
        <div id="proposal-form">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 노출 부위 선택 */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                    노출 부위 선택
                  </h3>
                </div>
              </CardHeader>
              <CardBody>
                <ExposureSelector
                  selectedItems={selectedExposureItems}
                  onSelectionChange={setSelectedExposureItems}
                />
              </CardBody>
            </Card>

            {/* 계약 기간 */}
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                    계약 기간
                  </h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isTournamentBased"
                    checked={isTournamentBased}
                    onChange={(e) => {
                      setIsTournamentBased(e.target.checked);
                      setValue('isTournamentBased', e.target.checked);
                    }}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isTournamentBased" className="text-sm text-gray-700 dark:text-gray-300">
                    대회 기반 계약 (특정 대회 기간 동안만)
                  </label>
                </div>

                {!isTournamentBased && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="시작일"
                      type="date"
                      leftIcon={<Calendar className="h-5 w-5 text-orange-400" />}
                      {...register('startDate', { valueAsDate: true })}
                    />
                    <Input
                      label="종료일"
                      type="date"
                      leftIcon={<Calendar className="h-5 w-5 text-orange-400" />}
                      {...register('endDate', { valueAsDate: true })}
                    />
                  </div>
                )}

                {isTournamentBased && selectedTournament && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-orange-900 dark:text-orange-100">
                        선택된 대회
                      </span>
                    </div>
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      {selectedTournament.name}
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      {formatDate(selectedTournament.startDate)} ~ {formatDate(selectedTournament.endDate)}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* 제안 메시지 */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    제안 메시지
                  </h3>
                </div>
              </CardHeader>
              <CardBody>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    스폰서십 제안에 대한 상세한 내용을 작성해주세요
                  </label>
                  <textarea
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500"
                    placeholder="예: 저희 골프테크 코리아에서 김투어프로님과의 스폰서십을 제안드립니다. 골프백과 모자에 저희 브랜드 로고를 노출해주시면 됩니다. 추가로 SNS 홍보도 함께 진행하고 싶습니다..."
                    rows={5}
                    {...register('message', { required: '제안 메시지는 필수입니다.' })}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* 제출 버튼 */}
            <div className="space-y-4">
              <Button
                type="submit"
                loading={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg text-lg"
                leftIcon={<Send className="h-6 w-6" />}
              >
                🚀 스폰서십 제안 보내기
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
                leftIcon={<ArrowLeft className="h-5 w-5" />}
              >
                돌아가기
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}

export default function SponsorshipProposePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SponsorshipProposeContent />
    </Suspense>
  );
}
