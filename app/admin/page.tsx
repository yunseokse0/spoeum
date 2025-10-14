'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Bell,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';

// Mock 데이터
const mockDashboardStats = {
  totalUsers: 1250,
  activeUsers: 980,
  monthlyRevenue: 8500000,
  pendingRequests: 15,
};

const mockRecentUsers = [
  {
    id: '1',
    name: '김캐디',
    email: 'caddy1@example.com',
    status: 'active',
    userType: 'caddy',
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

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAdminAuth();

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            관리자 대시보드
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            스포이음 골프 플랫폼 관리
          </p>
        </div>

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
              <div className="p-3 bg-destructive-100 dark:bg-destructive-900 rounded-full">
                <AlertTriangle className="h-6 w-6 text-destructive-600 dark:text-destructive-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* 최근 가입 회원 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                최근 가입 회원
              </h2>
              <Button variant="outline" size="sm">
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
              <Button variant="outline" size="sm">
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