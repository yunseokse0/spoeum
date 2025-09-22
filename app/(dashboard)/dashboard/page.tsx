'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Plus,
  Clock,
  MapPin,
  Star,
  Users,
  Trophy
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { UserType } from '@/types';

// 임시 데이터 (실제 구현 시 API에서 가져옴)
const mockStats = {
  totalContracts: 12,
  monthlyEarnings: 2500000,
  averageRating: 4.8,
  pendingRequests: 3,
};

const mockRecentContracts = [
  {
    id: '1',
    title: '2024 PGA 투어 대회',
    date: '2024-01-15',
    location: '제주도',
    status: 'active',
    amount: 500000,
    clientName: '김투어',
  },
  {
    id: '2',
    title: '아마추어 골프 대회',
    date: '2024-01-20',
    location: '경기도',
    status: 'pending',
    amount: 300000,
    clientName: '이아마추어',
  },
  {
    id: '3',
    title: '연간 계약',
    date: '2024-01-01',
    location: '서울',
    status: 'active',
    amount: 10000000,
    clientName: '박에이전시',
  },
];

const mockNotifications = [
  {
    id: '1',
    title: '새로운 매칭 요청',
    message: '2024 PGA 투어 대회 캐디 요청이 도착했습니다.',
    time: '2시간 전',
    isRead: false,
  },
  {
    id: '2',
    title: '결제 완료',
    message: '500,000원이 계좌에 입금되었습니다.',
    time: '1일 전',
    isRead: true,
  },
  {
    id: '3',
    title: '계약 갱신 알림',
    message: '연간 계약이 30일 후 만료됩니다.',
    time: '3일 전',
    isRead: true,
  },
];

const mockSponsorshipStats = {
  activeSponsorships: 3,
  totalSponsorshipAmount: 50000000,
  pendingProposals: 2,
  completedSponsorships: 8,
};

const mockRecentSponsorships = [
  {
    id: '1',
    sponsorName: '골프테크 코리아',
    exposureItems: ['모자', '골프백'],
    amount: 20000000,
    status: 'active',
    endDate: '2024-05-01',
  },
  {
    id: '2',
    sponsorName: '프리미엄 골프웨어',
    exposureItems: ['상의', '하의'],
    amount: 15000000,
    status: 'pending',
    endDate: '2024-06-01',
  },
];

export default function DashboardPage() {
  const { user, isAuthenticated, userType } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  const getUserTypeLabel = (userType: UserType) => {
    switch (userType) {
      case 'caddy':
        return '캐디';
      case 'tour_pro':
        return '투어프로';
      case 'amateur':
        return '아마추어';
      case 'agency':
        return '에이전시';
      default:
        return '사용자';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '진행중';
      case 'pending':
        return '대기중';
      case 'completed':
        return '완료';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="대시보드" 
        showNotificationButton={true}
        showMenuButton={true}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6 space-y-6">
        {/* 환영 메시지 */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              안녕하세요, {user?.name}님! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {getUserTypeLabel(userType!)} 계정으로 로그인하셨습니다.
            </p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">총 계약</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockStats.totalContracts}
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">이번 달 수익</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(mockStats.monthlyEarnings).replace('₩', '')}원
                </p>
              </div>
              <div className="p-3 bg-success-100 dark:bg-success-900 rounded-full">
                <DollarSign className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">평균 평점</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockStats.averageRating}
                </p>
              </div>
              <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full">
                <Star className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">대기 요청</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockStats.pendingRequests}
                </p>
              </div>
              <div className="p-3 bg-secondary-100 dark:bg-secondary-900 rounded-full">
                <Clock className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* 빠른 액션 */}
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              빠른 액션
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => router.push('/matching/create')}
              >
                <Plus className="h-6 w-6 mb-2" />
                <span className="text-sm">매칭 요청</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => router.push('/matching')}
              >
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">매칭 찾기</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* 최근 계약 */}
        <Card>
          <div className="card-header flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              최근 계약
            </h3>
            <Button variant="ghost" size="sm" onClick={() => router.push('/contracts')}>
              전체보기
            </Button>
          </div>
          <div className="card-body p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockRecentContracts.map((contract) => (
                <div key={contract.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {contract.title}
                    </h4>
                    <Badge variant={getStatusColor(contract.status)}>
                      {getStatusLabel(contract.status)}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(contract.date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {contract.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatCurrency(contract.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 스폰서십 섹션 (스폰서, 투어프로, 아마추어만) */}
        {(userType === 'sponsor' || userType === 'tour_pro' || userType === 'amateur') && (
          <Card>
            <div className="card-header flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                스폰서십
              </h3>
              <Button variant="ghost" size="sm" onClick={() => router.push('/sponsorship')}>
                전체보기
              </Button>
            </div>
            <div className="card-body">
              {/* 스폰서십 통계 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {userType === 'sponsor' ? mockSponsorshipStats.activeSponsorships : mockSponsorshipStats.pendingProposals}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {userType === 'sponsor' ? '진행중' : '대기중'}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(mockSponsorshipStats.totalSponsorshipAmount)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    총 스폰서십
                  </div>
                </div>
              </div>

              {/* 최근 스폰서십 */}
              <div className="space-y-3">
                {mockRecentSponsorships.map((sponsorship) => (
                  <div key={sponsorship.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {sponsorship.sponsorName}
                      </h4>
                      <Badge variant={sponsorship.status === 'active' ? 'success' : 'warning'}>
                        {sponsorship.status === 'active' ? '진행중' : '대기중'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Handshake className="h-4 w-4 mr-2" />
                        {sponsorship.exposureItems.join(', ')}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {formatCurrency(sponsorship.amount)}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        종료: {formatDate(sponsorship.endDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 액션 버튼 */}
              <div className="mt-4">
                {userType === 'sponsor' ? (
                  <Button 
                    onClick={() => router.push('/sponsorship/create')}
                    className="w-full"
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    새로운 스폰서십 제안
                  </Button>
                ) : (
                  <Button 
                    onClick={() => router.push('/sponsorship')}
                    variant="outline"
                    className="w-full"
                    leftIcon={<Handshake className="h-4 w-4" />}
                  >
                    스폰서십 제안 확인
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* 최근 알림 */}
        <Card>
          <div className="card-header flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              최근 알림
            </h3>
            <Button variant="ghost" size="sm" onClick={() => router.push('/notifications')}>
              전체보기
            </Button>
          </div>
          <div className="card-body p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockNotifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.isRead ? 'bg-gray-300 dark:bg-gray-600' : 'bg-primary-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
