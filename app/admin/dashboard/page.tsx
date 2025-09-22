'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Users, 
  FileText, 
  CreditCard, 
  Handshake,
  Trophy,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { AdminStats } from '@/types';

// Mock 통계 데이터
const mockStats: AdminStats = {
  totalUsers: 1250,
  activeUsers: 980,
  totalContracts: 340,
  activeContracts: 156,
  totalPayments: 2840,
  monthlyRevenue: 45000000,
  totalSponsorships: 45,
  activeSponsorships: 23,
  totalTournaments: 28,
  upcomingTournaments: 5
};

// Mock 최근 활동 데이터
const mockRecentActivities = [
  {
    id: '1',
    type: 'user_signup',
    user: '김골퍼',
    action: '회원가입',
    time: '5분 전',
    status: 'success'
  },
  {
    id: '2',
    type: 'contract_signed',
    user: '이캐디',
    action: '계약 체결',
    time: '12분 전',
    status: 'success'
  },
  {
    id: '3',
    type: 'payment_completed',
    user: '박스폰서',
    action: '결제 완료',
    time: '1시간 전',
    status: 'success'
  },
  {
    id: '4',
    type: 'contract_cancelled',
    user: '최투어프로',
    action: '계약 파기',
    time: '2시간 전',
    status: 'warning'
  },
  {
    id: '5',
    type: 'sponsorship_request',
    user: '정아마추어',
    action: '스폰서십 요청',
    time: '3시간 전',
    status: 'pending'
  }
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>(mockStats);
  const [recentActivities] = useState(mockRecentActivities);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'pending':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              관리자 대시보드
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              스포이음 플랫폼 전체 현황을 한눈에 확인하세요
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date().toLocaleDateString('ko-KR')}
            </Badge>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 회원</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    활성 회원 {stats.activeUsers.toLocaleString()}명
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 계약</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalContracts.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    진행중 {stats.activeContracts.toLocaleString()}건
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">월간 매출</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.monthlyRevenue.toLocaleString()}원
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    총 결제 {stats.totalPayments.toLocaleString()}건
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                  <Handshake className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">스폰서십</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalSponsorships.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    활성 {stats.activeSponsorships.toLocaleString()}건
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 활동 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                최근 활동
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.user}님이 {activity.action}했습니다.
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(activity.status)} className="text-xs">
                      {activity.status === 'success' ? '완료' : 
                       activity.status === 'warning' ? '주의' : '대기'}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" fullWidth>
                  전체 활동 보기
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* 대회 현황 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                대회 현황
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">전체 대회</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      총 {stats.totalTournaments}개 대회
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalTournaments}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">예정된 대회</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      곧 시작될 대회
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.upcomingTournaments}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">진행률</span>
                    <span className="text-gray-900 dark:text-white">
                      {Math.round(((stats.totalTournaments - stats.upcomingTournaments) / stats.totalTournaments) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.round(((stats.totalTournaments - stats.upcomingTournaments) / stats.totalTournaments) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" fullWidth>
                  대회 관리하기
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 빠른 액션 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              빠른 액션
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="w-6 h-6" />
                <span className="text-sm">회원 관리</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <FileText className="w-6 h-6" />
                <span className="text-sm">계약 관리</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">결제 관리</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">통계 보기</span>
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
