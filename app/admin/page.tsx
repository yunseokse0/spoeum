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
import { useAuthStore } from '@/store/useAuthStore';

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
  const { userType, isAuthenticated } = useAuthStore();
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
    { id: 'notifications', label: '알림 관리', icon: Bell },
    { id: 'data-scraper', label: '데이터 크롤링', icon: Settings },
    { id: 'etl-dashboard', label: 'ETL 대시보드', icon: Settings },
    { id: 'dynamic-test', label: '동적 로딩 테스트', icon: Settings },
    { id: 'debug-kpga', label: 'KPGA 디버깅', icon: Settings },
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
        {activeTab === 'data-scraper' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">데이터 크롤링 관리</h2>
                <p className="text-gray-600 dark:text-gray-400">전체 데이터 크롤링 및 조회를 관리할 수 있습니다.</p>
              </div>
              <Button 
                onClick={() => router.push('/admin/data-scraper')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                크롤링 페이지로 이동
              </Button>
            </div>
            
            {/* 크롤링된 데이터 미리보기 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">대회 정보</h3>
                    <Badge variant="blue">실시간</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    KLPGA/KPGA 대회 정보를 실시간으로 수집합니다.
                  </p>
                  <Button 
                    onClick={() => router.push('/admin/data-scraper?type=tournaments')}
                    variant="outline"
                    className="w-full"
                  >
                    대회 데이터 보기
                  </Button>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">골프장 정보</h3>
                    <Badge variant="green">업데이트됨</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    전국 골프장 정보를 다중 소스에서 수집합니다.
                  </p>
                  <Button 
                    onClick={() => router.push('/admin/data-scraper?type=golf-courses')}
                    variant="outline"
                    className="w-full"
                  >
                    골프장 데이터 보기
                  </Button>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">선수 정보</h3>
                    <Badge variant="purple">샘플</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    KLPGA/KPGA 선수 프로필 및 경력 정보를 수집합니다.
                  </p>
                  <Button 
                    onClick={() => router.push('/admin/data-scraper?type=players')}
                    variant="outline"
                    className="w-full"
                  >
                    선수 데이터 보기
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
        {activeTab === 'etl-dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🚀 전문 ETL 대시보드</h2>
                <p className="text-gray-600 dark:text-gray-400">데이터 추출(Extract), 변환(Transform), 로드(Load) 프로세스 관리</p>
              </div>
              <Button 
                onClick={() => router.push('/admin/etl-dashboard')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                ETL 대시보드로 이동
              </Button>
            </div>
            
            {/* ETL 기능 소개 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">📥 데이터 추출</h3>
                    <Badge variant="blue">Extract</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    KLPGA/KPGA 선수, 골프장, 대회 데이터를 다중 소스에서 안정적으로 추출합니다.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• 정적/동적 페이지 크롤링</li>
                    <li>• 페이지네이션 자동 처리</li>
                    <li>• 봇 탐지 우회</li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🔄 데이터 변환</h3>
                    <Badge variant="green">Transform</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    추출된 데이터를 검증, 정리, 표준화하여 품질을 보장합니다.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• 데이터 검증 및 품질 관리</li>
                    <li>• 중복 제거 및 정리</li>
                    <li>• 한글 인코딩 처리</li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">📤 데이터 로드</h3>
                    <Badge variant="purple">Load</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    구조화된 데이터를 CSV/JSON 형식으로 내보내어 활용할 수 있습니다.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• CSV/JSON 다중 형식 지원</li>
                    <li>• 메타데이터 포함</li>
                    <li>• 파일 크기 최적화</li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">📊 품질 관리</h3>
                    <Badge variant="yellow">Quality</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    데이터 품질을 실시간으로 모니터링하고 리포트를 생성합니다.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• 완성도 측정</li>
                    <li>• 오류/경고 리포트</li>
                    <li>• 통계 및 분석</li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
        {activeTab === 'dynamic-test' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🚀 동적 로딩 크롤링 테스트</h2>
                <p className="text-gray-600 dark:text-gray-400">KPGA 선수 목록의 동적 로딩을 테스트하고 고급 크롤링 기능을 검증합니다.</p>
              </div>
              <Button 
                onClick={() => router.push('/test-dynamic-loading')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                동적 로딩 테스트 페이지로 이동
              </Button>
            </div>
            
            {/* 동적 로딩 기능 소개 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🔄 동적 로딩 처리</h3>
                    <Badge variant="blue">Advanced</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    JavaScript로 동적으로 로드되는 콘텐츠를 안정적으로 크롤링합니다.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• 네트워크 안정화 대기</li>
                    <li>• 스크롤을 통한 콘텐츠 로딩</li>
                    <li>• 커스텀 셀렉터 대기</li>
                    <li>• AJAX 요청 완료 대기</li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🎯 고급 크롤링</h3>
                    <Badge variant="green">Professional</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    봇 탐지 우회와 다중 셀렉터를 통한 안정적인 데이터 수집.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• 봇 탐지 우회</li>
                    <li>• 다중 셀렉터 시도</li>
                    <li>• 상세 정보 자동 수집</li>
                    <li>• 에러 핸들링</li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">📊 데이터 품질</h3>
                    <Badge variant="purple">Quality</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    수집된 데이터의 품질을 보장하고 검증합니다.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• 선수 기본 정보 수집</li>
                    <li>• 랭킹 및 상금 정보</li>
                    <li>• 데이터 검증 및 정리</li>
                    <li>• 중복 제거</li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🧪 테스트 기능</h3>
                    <Badge variant="yellow">Testing</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    다양한 테스트 모드를 제공하여 크롤링 기능을 검증합니다.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• 테스트 모드 (5명 제한)</li>
                    <li>• 전체 모드</li>
                    <li>• 실시간 결과 확인</li>
                    <li>• 에러 로깅</li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
        {activeTab === 'debug-kpga' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔍 KPGA 사이트 구조 디버깅</h2>
                <p className="text-gray-600 dark:text-gray-400">KPGA 사이트의 실제 구조를 분석하고 올바른 셀렉터를 찾습니다.</p>
              </div>
              <Button 
                onClick={() => router.push('/debug-kpga')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                KPGA 디버깅 페이지로 이동
              </Button>
            </div>
            
            {/* 디버깅 기능 소개 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🔍 사이트 구조 분석</h3>
                    <Badge variant="blue">Analysis</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    KPGA 사이트의 실제 HTML 구조를 분석하여 올바른 셀렉터를 찾습니다.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• 모든 클래스명 수집 및 분석</li>
                    <li>• Player 관련 요소 식별</li>
                    <li>• 테이블 및 리스트 구조 분석</li>
                    <li>• 링크 구조 분석</li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🚀 선수 데이터 크롤링</h3>
                    <Badge variant="green">Crawling</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    분석 결과를 바탕으로 실제 선수 데이터를 크롤링합니다.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• 다중 셀렉터 시도</li>
                    <li>• 한글 텍스트 필터링</li>
                    <li>• 선수 데이터 변환</li>
                    <li>• 결과 검증</li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">📊 결과 분석</h3>
                    <Badge variant="purple">Results</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    수집된 데이터를 분석하여 최적의 크롤링 전략을 수립합니다.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• 상위 클래스 우선순위</li>
                    <li>• Player 관련 요소 식별</li>
                    <li>• 최적 셀렉터 추천</li>
                    <li>• 크롤링 전략 수립</li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🛠️ 문제 해결</h3>
                    <Badge variant="yellow">Troubleshooting</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    크롤링 실패 원인을 파악하고 해결 방안을 제시합니다.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• 셀렉터 오류 진단</li>
                    <li>• 동적 로딩 문제 해결</li>
                    <li>• 데이터 구조 분석</li>
                    <li>• 최적화 방안 제시</li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
