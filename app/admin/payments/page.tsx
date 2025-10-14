'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'membership' | 'tournament' | 'point' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'bank' | 'point';
  createdAt: string;
  completedAt?: string;
  description: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Mock 데이터 생성
  useEffect(() => {
    const mockPayments: Payment[] = [
      {
        id: 'pay_001',
        userId: 'user_001',
        userName: '김효주',
        amount: 50000,
        type: 'membership',
        status: 'completed',
        method: 'card',
        createdAt: '2025-01-15T10:30:00Z',
        completedAt: '2025-01-15T10:31:00Z',
        description: '월간 멤버십 결제'
      },
      {
        id: 'pay_002',
        userId: 'user_002',
        userName: '박민지',
        amount: 100000,
        type: 'tournament',
        status: 'pending',
        method: 'bank',
        createdAt: '2025-01-15T14:20:00Z',
        description: '2025 KLPGA 시즌 개막전 참가비'
      },
      {
        id: 'pay_003',
        userId: 'user_003',
        userName: '이정은',
        amount: 200000,
        type: 'point',
        status: 'completed',
        method: 'card',
        createdAt: '2025-01-14T16:45:00Z',
        completedAt: '2025-01-14T16:46:00Z',
        description: '포인트 충전'
      },
      {
        id: 'pay_004',
        userId: 'user_004',
        userName: '최유진',
        amount: 75000,
        type: 'refund',
        status: 'refunded',
        method: 'card',
        createdAt: '2025-01-13T09:15:00Z',
        completedAt: '2025-01-13T11:30:00Z',
        description: '대회 취소 환불'
      },
      {
        id: 'pay_005',
        userId: 'user_005',
        userName: '정소영',
        amount: 150000,
        type: 'membership',
        status: 'failed',
        method: 'card',
        createdAt: '2025-01-12T20:10:00Z',
        description: '연간 멤버십 결제'
      }
    ];

    setPayments(mockPayments);
    setLoading(false);
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="green" leftIcon={<CheckCircle className="w-3 h-3" />}>완료</Badge>;
      case 'pending':
        return <Badge variant="yellow" leftIcon={<Clock className="w-3 h-3" />}>대기중</Badge>;
      case 'failed':
        return <Badge variant="red" leftIcon={<XCircle className="w-3 h-3" />}>실패</Badge>;
      case 'refunded':
        return <Badge variant="blue" leftIcon={<DollarSign className="w-3 h-3" />}>환불완료</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'membership':
        return <Badge variant="blue">멤버십</Badge>;
      case 'tournament':
        return <Badge variant="green">대회참가</Badge>;
      case 'point':
        return <Badge variant="purple">포인트</Badge>;
      case 'refund':
        return <Badge variant="orange">환불</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const totalAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">결제관리</h1>
            <p className="text-gray-600 dark:text-gray-400">결제 내역 및 수수료 관리</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              엑셀 다운로드
            </Button>
            <Button leftIcon={<CreditCard className="w-4 h-4" />}>
              결제 내역 조회
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 결제금액</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalAmount.toLocaleString()}원
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">대기중 결제</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pendingAmount.toLocaleString()}원
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 결제건수</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {payments.filter(p => p.status === 'completed').length}건
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">활성 사용자</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Set(payments.map(p => p.userId)).size}명
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardBody className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="사용자명 또는 설명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48"
              >
                <option value="all">전체 상태</option>
                <option value="completed">완료</option>
                <option value="pending">대기중</option>
                <option value="failed">실패</option>
                <option value="refunded">환불완료</option>
              </Select>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full sm:w-48"
              >
                <option value="all">전체 유형</option>
                <option value="membership">멤버십</option>
                <option value="tournament">대회참가</option>
                <option value="point">포인트</option>
                <option value="refund">환불</option>
              </Select>
              <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                필터 적용
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* 결제 목록 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              결제 내역 ({filteredPayments.length}건)
            </h3>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      결제 ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      사용자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      유형
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      결제일시
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        {payment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.userName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {payment.userId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {payment.amount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(payment.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(payment.createdAt).toLocaleString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-3 h-3" />}
                            onClick={() => setSelectedPayment(payment)}
                          >
                            상세
                          </Button>
                          {payment.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              승인
                            </Button>
                          )}
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
    </AdminLayout>
  );
}
