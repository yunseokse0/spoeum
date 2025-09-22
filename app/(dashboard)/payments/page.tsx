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
  Search, 
  Filter, 
  DollarSign, 
  Calendar, 
  CreditCard,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Eye
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

// 임시 결제 데이터
const mockPayments = [
  {
    id: '1',
    contractId: 'contract1',
    payerId: 'user1',
    receiverId: 'user2',
    amount: 500000,
    type: 'weekly',
    status: 'completed',
    method: 'bank_transfer',
    description: '주간 캐디 수수료',
    processedAt: new Date('2024-01-15T10:30:00'),
    createdAt: new Date('2024-01-15T10:00:00'),
  },
  {
    id: '2',
    contractId: 'contract2',
    payerId: 'user2',
    receiverId: 'user1',
    amount: 200000,
    type: 'incentive',
    status: 'pending',
    method: 'point',
    description: '성과 인센티브',
    processedAt: null,
    createdAt: new Date('2024-01-14T15:20:00'),
  },
  {
    id: '3',
    contractId: 'contract3',
    payerId: 'user3',
    receiverId: 'user1',
    amount: 100000,
    type: 'house_caddy_fee',
    status: 'completed',
    method: 'card',
    description: '하우스캐디 수수료',
    processedAt: new Date('2024-01-13T14:45:00'),
    createdAt: new Date('2024-01-13T14:30:00'),
  },
  {
    id: '4',
    contractId: 'contract4',
    payerId: 'user1',
    receiverId: 'system',
    amount: 50000,
    type: 'annual_fee',
    status: 'completed',
    method: 'point',
    description: '연간 계약 수수료',
    processedAt: new Date('2024-01-12T09:15:00'),
    createdAt: new Date('2024-01-12T09:00:00'),
  },
];

export default function PaymentsPage() {
  const router = useRouter();
  const { userType, isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [filteredPayments, setFilteredPayments] = useState(mockPayments);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    let filtered = mockPayments;

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 상태 필터링
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === selectedFilter);
    }

    // 타입 필터링
    if (selectedType !== 'all') {
      filtered = filtered.filter(payment => payment.type === selectedType);
    }

    setFilteredPayments(filtered);
  }, [searchQuery, selectedFilter, selectedType]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'destructive';
      case 'refunded':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'pending':
        return '대기중';
      case 'failed':
        return '실패';
      case 'refunded':
        return '환불';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'weekly':
        return '주간 수수료';
      case 'incentive':
        return '인센티브';
      case 'house_caddy_fee':
        return '하우스캐디 수수료';
      case 'annual_fee':
        return '연간 계약 수수료';
      case 'penalty':
        return '위약금';
      default:
        return type;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return '카드';
      case 'bank_transfer':
        return '계좌이체';
      case 'point':
        return '포인트';
      default:
        return method;
    }
  };

  const getAmountColor = (type: string) => {
    return type === 'penalty' ? 'text-error-600' : 'text-success-600';
  };

  const getAmountIcon = (type: string) => {
    return type === 'penalty' ? (
      <TrendingDown className="h-4 w-4" />
    ) : (
      <TrendingUp className="h-4 w-4" />
    );
  };

  // 통계 계산
  const totalEarnings = mockPayments
    .filter(p => p.status === 'completed' && p.receiverId === 'user1')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = mockPayments
    .filter(p => p.status === 'pending' && p.receiverId === 'user1')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="결제 관리" 
        showSearchButton={true}
        showNotificationButton={true}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6 space-y-4">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">총 수익</p>
                <p className="text-xl font-bold text-success-600">
                  {formatCurrency(totalEarnings).replace('₩', '')}원
                </p>
              </div>
              <div className="p-3 bg-success-100 dark:bg-success-900 rounded-full">
                <TrendingUp className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">대기 중</p>
                <p className="text-xl font-bold text-warning-600">
                  {formatCurrency(pendingAmount).replace('₩', '')}원
                </p>
              </div>
              <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full">
                <Calendar className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <div className="space-y-3">
          {/* 검색 바 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="결제 내역을 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 필터 탭 */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
            {[
              { value: 'all', label: '전체' },
              { value: 'completed', label: '완료' },
              { value: 'pending', label: '대기중' },
              { value: 'failed', label: '실패' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === filter.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* 타입 필터 */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
            {[
              { value: 'all', label: '전체 타입' },
              { value: 'weekly', label: '주간 수수료' },
              { value: 'incentive', label: '인센티브' },
              { value: 'house_caddy_fee', label: '하우스캐디' },
              { value: 'annual_fee', label: '연간 수수료' },
              { value: 'penalty', label: '위약금' },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedType === type.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
            className="flex-1"
          >
            내역 다운로드
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            className="flex-1"
            onClick={() => router.push('/payments/create')}
          >
            결제 요청
          </Button>
        </div>

        {/* 결제 내역 목록 */}
        <div className="space-y-3">
          {filteredPayments.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  결제 내역이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? '검색 결과가 없습니다.' : '아직 결제 내역이 없습니다.'}
                </p>
              </CardBody>
            </Card>
          ) : (
            filteredPayments.map((payment) => (
              <Card key={payment.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {getTypeLabel(payment.type)}
                        </h3>
                        <Badge variant={getStatusColor(payment.status)}>
                          {getStatusLabel(payment.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {payment.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">금액</span>
                      <span className={`font-semibold ${getAmountColor(payment.type)}`}>
                        {getAmountIcon(payment.type)}
                        <span className="ml-1">{formatCurrency(payment.amount)}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">결제 방법</span>
                      <span className="text-gray-900 dark:text-white">
                        {getMethodLabel(payment.method)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">생성일</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatDateTime(payment.createdAt)}
                      </span>
                    </div>
                    {payment.processedAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">처리일</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatDateTime(payment.processedAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      ID: {payment.id}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/payments/${payment.id}`);
                      }}
                      rightIcon={<Eye className="h-4 w-4" />}
                    >
                      상세보기
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
