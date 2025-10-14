'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Bell,
  Settings,
  BarChart3,
  UserCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Plus
} from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { useAdminAuth } from '@/hooks/useAdminAuth';

// 임시 관리자 데이터
const mockDashboardStats = {
  totalUsers: 1250,
  activeUsers: 980,
  totalRevenue: 45000000,
  monthlyRevenue: 8500000,
  pendingRequests: 15,
  activeContracts: 245,
  completedContracts: 1200,
  newUsersToday: 12,
};

const mockRecentUsers = [
  {
    id: '1',
    name: '김캐디',
    email: 'caddy1@example.com',
    userType: 'caddy',
    status: 'active',
    joinDate: new Date('2024-01-10'),
    totalContracts: 15,
    rating: 4.8,
  },
  {
    id: '2',
    name: '박투어프로',
    email: 'pro1@example.com',
    userType: 'tour_pro',
    status: 'pending',
    joinDate: new Date('2024-01-12'),
    totalContracts: 8,
    rating: 4.9,
  },
  {
    id: '3',
    name: '이에이전시',
    email: 'agency1@example.com',
    userType: 'agency',
    status: 'active',
    joinDate: new Date('2024-01-08'),
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

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // 관리자 페이지 접근 제한 제거 - 자유롭게 접근 가능
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //     return;
  //   }

  //   // 관리자 권한 확인
  //   if (userType !== 'agency') {
  //     router.push('/dashboard');
  //     return;
  //   }
  // }, [isAuthenticated, userType, router]);

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

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'caddy':
        return 'blue';
      case 'tour_pro':
        return 'success';
      case 'amateur':
        return 'warning';
      case 'agency':
        return 'secondary';
      default:
        return 'secondary';
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

  const tabs = [
    { id: 'dashboard', label: '대시보드', icon: BarChart3 },
    { id: 'users', label: '회원 관리', icon: Users },
    { id: 'payments', label: '결제 관리', icon: DollarSign },
    { id: 'caddy-payouts', label: '캐디 정산', icon: DollarSign },
    { id: 'notifications', label: '알림 관리', icon: Bell },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">총 회원</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockDashboardStats.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">활성 회원</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockDashboardStats.activeUsers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-success-100 dark:bg-success-900 rounded-full">
              <UserCheck className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">이번 달 수익</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(mockDashboardStats.monthlyRevenue).replace('₩', '')}원
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
              <p className="text-sm text-gray-600 dark:text-gray-400">대기 요청</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockDashboardStats.pendingRequests}
              </p>
            </div>
            <div className="p-3 bg-error-100 dark:bg-error-900 rounded-full">
              <AlertTriangle className="h-6 w-6 text-error-600 dark:text-error-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* 최근 회원 */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            최근 가입 회원
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setActiveTab('users')}>
            전체보기
          </Button>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockRecentUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getUserTypeColor(user.userType)}>
                      {getUserTypeLabel(user.userType)}
                    </Badge>
                    <Badge variant={getStatusColor(user.status)}>
                      {getStatusLabel(user.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* 최근 거래 */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            최근 거래 내역
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setActiveTab('payments')}>
            전체보기
          </Button>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockRecentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.user} • {formatRelativeTime(transaction.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Badge variant={getStatusColor(transaction.status)}>
                      {getStatusLabel(transaction.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      {/* 검색 및 필터 */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="회원을 검색하세요..."
            className="pl-10"
          />
        </div>
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
          필터
        </Button>
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
          내보내기
        </Button>
      </div>

      {/* 회원 목록 */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    회원
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    타입
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    계약 수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    평점
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {mockRecentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getUserTypeColor(user.userType)}>
                        {getUserTypeLabel(user.userType)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(user.status)}>
                        {getStatusLabel(user.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(user.joinDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.totalContracts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <span className="mr-1">{user.rating}</span>
                        <span className="text-warning-500">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
                          보기
                        </Button>
                        <Button variant="ghost" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
                          수정
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">관리자 대시보드</h1>
          <p className="text-gray-600 dark:text-gray-400">스포이음 골프 플랫폼 관리</p>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="px-6 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'payments' && (
          <Card>
            <CardBody className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                결제 관리
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                결제 관리 기능이 곧 추가됩니다.
              </p>
            </CardBody>
          </Card>
        )}
        {activeTab === 'caddy-payouts' && (
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <DollarSign className="h-7 w-7 mr-3 text-green-500" />
                    캐디 정산 관리
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    대회 결과 기반 캐디 수당 자동 계산 시스템
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/admin/caddy-payouts')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  정산 관리 페이지로 이동 →
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <h4 className="text-lg font-semibold mb-3 text-green-900 dark:text-green-100">
                    🎯 주요 기능
                  </h4>
                  <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>KPGA/KLPGA 대회 결과 자동 수집 (Gemini AI)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>상금 기반 캐디 수당 자동 계산</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>순위별 지급 비율 자동 적용</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>정산 내역 관리 및 승인</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                  <h4 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
                    💰 정산 규칙
                  </h4>
                  <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                      <span>1위 ~ 10위</span>
                      <span className="font-semibold text-green-600">상금의 10%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                      <span>11위 ~ 30위</span>
                      <span className="font-semibold text-green-600">상금의 7%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                      <span>31위 ~ 50위</span>
                      <span className="font-semibold text-green-600">상금의 5%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                      <span>51위 이상</span>
                      <span className="font-semibold text-green-600">상금의 3%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                <h4 className="text-lg font-semibold mb-3 text-purple-900 dark:text-purple-100">
                  🔄 프로세스
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center mr-3 flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-purple-900 dark:text-purple-100">대회 선택</p>
                      <p className="text-xs text-purple-700 dark:text-purple-200 mt-1">완료된 대회 선택</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center mr-3 flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-purple-900 dark:text-purple-100">정산 계산</p>
                      <p className="text-xs text-purple-700 dark:text-purple-200 mt-1">자동 계산 실행</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center mr-3 flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-purple-900 dark:text-purple-100">내역 확인</p>
                      <p className="text-xs text-purple-700 dark:text-purple-200 mt-1">정산 금액 확인</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center mr-3 flex-shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-semibold text-purple-900 dark:text-purple-100">정산 완료</p>
                      <p className="text-xs text-purple-700 dark:text-purple-200 mt-1">개별 승인 처리</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
        {activeTab === 'notifications' && (
          <Card>
            <CardBody className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                알림 관리
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                알림 관리 기능이 곧 추가됩니다.
              </p>
            </CardBody>
          </Card>
        )}
      </main>
    </div>
  );
}
