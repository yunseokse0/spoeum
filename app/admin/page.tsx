'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Bell,
  UserCheck,
  AlertTriangle,
  Search,
  FileText,
  Coins,
  UserCheck as UserCheckIcon,
  Trophy,
  BarChart3,
  Settings,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

// Mock 데이터
const mockDashboardStats = {
  totalUsers: 1250,
  activeUsers: 980,
  monthlyRevenue: 45000000,
  pendingRequests: 15,
  totalTournaments: 28,
  upcomingTournaments: 5,
  totalContracts: 340,
  activeContracts: 156,
  totalPayments: 2840,
  activeSponsorships: 23,
  totalSponsorships: 45,
  weeklyTournaments: 5,
};

const mockRecentUsers = [
  {
    id: '1',
    name: '김골퍼',
    email: 'golfer1@example.com',
    status: 'active',
    userType: 'amateur',
    joinDate: new Date('2024-01-15T10:30:00'),
    totalContracts: 12,
    rating: 4.8,
  },
  {
    id: '2',
    name: '박투어프로',
    email: 'pro1@example.com',
    status: 'pending',
    userType: 'tour_pro',
    joinDate: new Date('2024-01-14T15:20:00'),
    totalContracts: 8,
    rating: 4.9,
  },
  {
    id: '3',
    name: '이에이전시',
    email: 'agency1@example.com',
    status: 'active',
    userType: 'agency',
    joinDate: new Date('2024-01-13T09:15:00'),
    totalContracts: 25,
    rating: 4.7,
  },
];

const mockRecentTransactions = [
  {
    id: '1',
    type: 'payment',
    amount: 500000,
    user: '김캐디',
    description: '주간 캐디 수수료',
    status: 'completed',
    date: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2',
    type: 'commission',
    amount: 50000,
    user: '시스템',
    description: '플랫폼 수수료',
    status: 'completed',
    date: new Date('2024-01-15T10:31:00'),
  },
  {
    id: '3',
    type: 'refund',
    amount: 200000,
    user: '박투어프로',
    description: '계약 취소 환불',
    status: 'pending',
    date: new Date('2024-01-15T09:15:00'),
  },
];

const mockRecentActivities = [
  {
    id: '1',
    type: 'signup',
    user: '김골퍼',
    action: '회원가입',
    time: '5분 전',
    icon: CheckCircle,
    color: 'text-green-500',
  },
  {
    id: '2',
    type: 'contract',
    user: '이캐디',
    action: '계약 체결',
    time: '12분 전',
    icon: CheckCircle,
    color: 'text-green-500',
  },
  {
    id: '3',
    type: 'payment',
    user: '박스폰서',
    action: '결제 완료',
    time: '1시간 전',
    icon: CheckCircle,
    color: 'text-green-500',
  },
  {
    id: '4',
    type: 'cancel',
    user: '최투어프로',
    action: '계약 파기',
    time: '2시간 전',
    icon: AlertTriangle,
    color: 'text-orange-500',
  },
  {
    id: '5',
    type: 'sponsorship',
    user: '정아마추어',
    action: '스폰서십 요청',
    time: '3시간 전',
    icon: Clock,
    color: 'text-blue-500',
  },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const getUserTypeLabel = (userType: string) => {
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
      case 'suspended':
        return 'destructive';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'pending':
        return '대기중';
      case 'suspended':
        return '정지';
      case 'completed':
        return '완료';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // 버튼 클릭 핸들러들
  const handleViewAllMembers = () => {
    router.push('/admin/members');
  };

  const handleViewAllTransactions = () => {
    router.push('/admin/payments');
  };

  const handleViewAllActivities = () => {
    router.push('/admin/notifications');
  };

  const handleManageTournaments = () => {
    router.push('/admin/tournaments');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'members':
        router.push('/admin/members');
        break;
      case 'contracts':
        router.push('/admin/contracts');
        break;
      case 'payments':
        router.push('/admin/payments');
        break;
      case 'statistics':
        router.push('/admin/reports');
        break;
      default:
        break;
    }
  };

  // 검색 기능
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // 검색 기능 구현 (사용자, 대회, 계약 등을 검색)
      console.log('검색어:', searchTerm);
      // 실제로는 검색 결과 페이지로 이동하거나 모달을 띄울 수 있음
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 섹션 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              골프 관리 대시보드
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              스포이음 골프 플랫폼의 핵심 지표를 실시간으로 모니터링하세요
            </p>
          </div>
          
          {/* 검색창 */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="사용자, 대회, 계약 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            <Button type="submit" variant="outline" size="sm">
              검색
            </Button>
          </form>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">이번주 대회 수</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockDashboardStats.weeklyTournaments}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  총 대회 {mockDashboardStats.totalTournaments}개
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                <Trophy className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">전체 계약</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockDashboardStats.totalContracts}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  진행중 {mockDashboardStats.activeContracts}건
                </p>
              </div>
              <div className="p-3 bg-success-100 dark:bg-success-900 rounded-full">
                <FileText className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">월간 매출</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(mockDashboardStats.monthlyRevenue).replace('₩', '')}원
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  총 결제 {mockDashboardStats.totalPayments}건
                </p>
              </div>
              <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full">
                <TrendingUp className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">스폰서십</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockDashboardStats.totalSponsorships}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  활성 {mockDashboardStats.activeSponsorships}건
                </p>
              </div>
              <div className="p-3 bg-info-100 dark:bg-info-900 rounded-full">
                <UserCheck className="h-6 w-6 text-info-600 dark:text-info-400" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 활동 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  최근 활동
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewAllActivities}
                >
                  전체 활동 보기
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {mockRecentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.user}님이 {activity.action}했습니다.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* 대회 현황 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  대회 현황
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleManageTournaments}
                >
                  대회 관리하기
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {mockDashboardStats.totalTournaments}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">전체 대회</p>
                    <p className="text-xs text-gray-500">총 {mockDashboardStats.totalTournaments}개 대회</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {mockDashboardStats.upcomingTournaments}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">예정된 대회</p>
                    <p className="text-xs text-gray-500">곧 시작될 대회</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">진행률</span>
                    <span className="text-sm text-gray-500">82%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 빠른 액션 */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              빠른 액션
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => handleQuickAction('members')}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm font-medium">회원 관리</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => handleQuickAction('contracts')}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm font-medium">계약 관리</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => handleQuickAction('payments')}
              >
                <DollarSign className="h-6 w-6" />
                <span className="text-sm font-medium">결제 관리</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => handleQuickAction('statistics')}
              >
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm font-medium">통계 보기</span>
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* 최근 가입 회원 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                최근 가입 회원
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllMembers}
              >
                전체보기
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {mockRecentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(user.status)}>
                    {getStatusLabel(user.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 최근 거래 내역 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                최근 거래 내역
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllTransactions}
              >
                전체보기
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {mockRecentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.user} • {formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Badge variant={getStatusColor(transaction.status)}>
                      {getStatusLabel(transaction.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}