'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Coins, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Plus,
  Minus,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Gift
} from 'lucide-react';

interface PointTransaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'earn' | 'spend' | 'bonus' | 'refund' | 'penalty';
  status: 'completed' | 'pending' | 'cancelled';
  description: string;
  source: string;
  createdAt: string;
  balance: number;
}

export default function PointsPage() {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<PointTransaction | null>(null);

  // Mock 데이터 생성
  useEffect(() => {
    const mockTransactions: PointTransaction[] = [
      {
        id: 'pt_001',
        userId: 'user_001',
        userName: '김효주',
        amount: 5000,
        type: 'earn',
        status: 'completed',
        description: '대회 참가 보상',
        source: '2025 KLPGA 시즌 개막전',
        createdAt: '2025-01-15T10:30:00Z',
        balance: 15000
      },
      {
        id: 'pt_002',
        userId: 'user_002',
        userName: '박민지',
        amount: -2000,
        type: 'spend',
        status: 'completed',
        description: '프리미엄 멤버십 구매',
        source: '멤버십 결제',
        createdAt: '2025-01-15T14:20:00Z',
        balance: 8000
      },
      {
        id: 'pt_003',
        userId: 'user_003',
        userName: '이정은',
        amount: 10000,
        type: 'bonus',
        status: 'completed',
        description: '신규 가입 보너스',
        source: '가입 이벤트',
        createdAt: '2025-01-14T16:45:00Z',
        balance: 10000
      },
      {
        id: 'pt_004',
        userId: 'user_004',
        userName: '최유진',
        amount: 3000,
        type: 'refund',
        status: 'completed',
        description: '대회 취소 환불',
        source: '환불 처리',
        createdAt: '2025-01-13T09:15:00Z',
        balance: 13000
      },
      {
        id: 'pt_005',
        userId: 'user_005',
        userName: '정소영',
        amount: -1000,
        type: 'penalty',
        status: 'completed',
        description: '규정 위반 벌금',
        source: '관리자 제재',
        createdAt: '2025-01-12T20:10:00Z',
        balance: 4000
      }
    ];

    setTransactions(mockTransactions);
    setLoading(false);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'earn':
        return <Badge variant="green" leftIcon={<TrendingUp className="w-3 h-3" />}>적립</Badge>;
      case 'spend':
        return <Badge variant="red" leftIcon={<TrendingDown className="w-3 h-3" />}>사용</Badge>;
      case 'bonus':
        return <Badge variant="purple" leftIcon={<Gift className="w-3 h-3" />}>보너스</Badge>;
      case 'refund':
        return <Badge variant="blue" leftIcon={<RefreshCw className="w-3 h-3" />}>환불</Badge>;
      case 'penalty':
        return <Badge variant="orange" leftIcon={<Minus className="w-3 h-3" />}>차감</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="green">완료</Badge>;
      case 'pending':
        return <Badge variant="yellow">대기중</Badge>;
      case 'cancelled':
        return <Badge variant="red">취소됨</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalEarned = transactions
    .filter(t => t.type === 'earn' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = Math.abs(transactions
    .filter(t => (t.type === 'spend' || t.type === 'penalty') && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0));

  const activeUsers = new Set(transactions.map(t => t.userId)).size;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">포인트관리</h1>
            <p className="text-gray-600 dark:text-gray-400">포인트 충전 및 차감 관리</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              엑셀 다운로드
            </Button>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              포인트 지급
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 적립 포인트</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{totalEarned.toLocaleString()}P
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 사용 포인트</p>
                  <p className="text-2xl font-bold text-red-600">
                    -{totalSpent.toLocaleString()}P
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 거래건수</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {transactions.length}건
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Coins className="w-6 h-6 text-blue-600" />
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
                    {activeUsers}명
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full sm:w-48"
              >
                <option value="all">전체 유형</option>
                <option value="earn">적립</option>
                <option value="spend">사용</option>
                <option value="bonus">보너스</option>
                <option value="refund">환불</option>
                <option value="penalty">차감</option>
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48"
              >
                <option value="all">전체 상태</option>
                <option value="completed">완료</option>
                <option value="pending">대기중</option>
                <option value="cancelled">취소됨</option>
              </Select>
              <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                필터 적용
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* 포인트 거래 목록 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              포인트 거래 내역 ({filteredTransactions.length}건)
            </h3>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      거래 ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      사용자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      포인트
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      유형
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      잔액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      거래일시
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.userName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.userId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}P
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(transaction.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.balance.toLocaleString()}P
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.createdAt).toLocaleString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-3 h-3" />}
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            상세
                          </Button>
                          {transaction.status === 'pending' && (
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
