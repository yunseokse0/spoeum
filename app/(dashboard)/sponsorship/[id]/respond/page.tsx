'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
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
  XCircle,
  Star,
  MessageSquare,
  Clock
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { SponsorshipProposal, ExposureItem } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ResponseForm {
  counterAmount?: number;
  counterMessage?: string;
}

export default function SponsorshipRespondPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { userType, isAuthenticated } = useAuthStore();
  const [proposal, setProposal] = useState<SponsorshipProposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const action = searchParams.get('action') as 'accept' | 'reject' | 'counter_propose' | null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResponseForm>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (userType !== 'tour_pro' && userType !== 'amateur') {
      router.push('/dashboard');
      return;
    }

    if (!action || !['accept', 'reject', 'counter_propose'].includes(action)) {
      router.push('/sponsorship');
      return;
    }

    if (params.id) {
      fetchProposal(params.id as string);
    }
  }, [isAuthenticated, router, userType, action, params.id]);

  const fetchProposal = async (id: string) => {
    try {
      setIsLoading(true);
      // TODO: 실제 API 호출로 제안 정보 조회
      // const response = await api.getSponsorshipProposal(id);
      
      // 임시 데이터
      const mockProposal: SponsorshipProposal = {
        id,
        sponsorId: '1',
        playerId: 'current',
        exposureItems: ['hat', 'golf_bag'],
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-05-01'),
        amount: 20000000,
        isTournamentBased: false,
        message: '저희 골프테크 코리아에서 스폰서십을 제안드립니다. 모자와 골프백에 로고 노출을 원합니다.',
        status: 'proposed',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      };
      
      setProposal(mockProposal);
    } catch (error) {
      console.error('Fetch proposal error:', error);
      toast.error('제안 정보를 불러오는 중 오류가 발생했습니다.');
      router.push('/sponsorship');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ResponseForm) => {
    if (!proposal || !action) return;

    setIsSubmitting(true);
    
    try {
      const response = await api.respondToSponsorshipProposal(
        proposal.id,
        action,
        data.counterAmount,
        data.counterMessage
      );
      
      if (response.success) {
        toast.success('응답이 전송되었습니다.');
        router.push('/sponsorship');
      } else {
        toast.error(response.message || '응답 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Respond to proposal error:', error);
      toast.error('응답 전송 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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

  const getActionTitle = () => {
    switch (action) {
      case 'accept':
        return '스폰서십 제안 수락';
      case 'reject':
        return '스폰서십 제안 거절';
      case 'counter_propose':
        return '스폰서십 제안 수정';
      default:
        return '스폰서십 제안 응답';
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case 'accept':
        return '제안된 스폰서십 조건을 수락합니다.';
      case 'reject':
        return '제안된 스폰서십을 거절합니다.';
      case 'counter_propose':
        return '제안된 조건을 수정하여 재제안합니다.';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">제안 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            제안을 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            요청하신 제안 정보를 찾을 수 없습니다.
          </p>
          <Button onClick={() => router.push('/sponsorship')}>
            스폰서십으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title={getActionTitle()} 
        showBackButton={true}
        showNotificationButton={true}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6 space-y-6">
        {/* 제안 정보 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              제안 정보
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {proposal.exposureItems.map((item, index) => (
                <Badge key={index} variant="primary">
                  {getExposureItemLabel(item)}
                </Badge>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(proposal.startDate)} ~ {formatDate(proposal.endDate)}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <DollarSign className="h-4 w-4 mr-2" />
                {formatCurrency(proposal.amount)}
              </div>
              {proposal.isTournamentBased && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Trophy className="h-4 w-4 mr-2" />
                  대회 기반 스폰서십
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  제안 메시지
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {proposal.message}
              </p>
            </div>
          </CardBody>
        </Card>

        {/* 응답 폼 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getActionTitle()}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getActionDescription()}
            </p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {action === 'counter_propose' && (
                <>
                  <Input
                    label="수정 제안 금액 (원)"
                    type="number"
                    placeholder="수정하고 싶은 금액을 입력하세요"
                    leftIcon={<DollarSign className="h-5 w-5 text-gray-400" />}
                    {...register('counterAmount', { valueAsNumber: true })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      수정 제안 메시지
                    </label>
                    <textarea
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500"
                      placeholder="수정 제안에 대한 상세한 내용을 작성해주세요..."
                      rows={4}
                      {...register('counterMessage')}
                    />
                  </div>
                </>
              )}

              {action === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    거절 사유 (선택사항)
                  </label>
                  <textarea
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500"
                    placeholder="거절 사유를 작성해주세요..."
                    rows={4}
                    {...register('counterMessage')}
                  />
                </div>
              )}

              {action === 'accept' && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 dark:text-green-200 font-medium">
                      제안된 조건으로 스폰서십을 수락합니다.
                    </span>
                  </div>
                </div>
              )}

              {/* 제출 버튼 */}
              <div className="flex space-x-4 pt-4">
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
                  loading={isSubmitting}
                  variant={action === 'accept' ? 'success' : action === 'reject' ? 'error' : 'primary'}
                  className="flex-1"
                  leftIcon={
                    action === 'accept' ? <CheckCircle className="h-4 w-4" /> :
                    action === 'reject' ? <XCircle className="h-4 w-4" /> :
                    <Star className="h-4 w-4" />
                  }
                >
                  {action === 'accept' ? '수락' : action === 'reject' ? '거절' : '수정 제안'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
