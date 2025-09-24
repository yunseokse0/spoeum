'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Contract, ContractType } from '@/types';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Clock,
  Trophy,
  FileText,
  TrendingUp,
  Eye
} from 'lucide-react';

// API에서 계약 데이터를 가져오는 함수
const fetchContracts = async (page: number = 1, limit: number = 10, type?: string, status?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (type) params.append('type', type);
  if (status) params.append('status', status);
  
  const response = await fetch(`/api/contracts?${params}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || '계약 데이터를 불러오는데 실패했습니다.');
  }
  
  return data;
};

export default function ContractsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/contracts';
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    loadContracts();
  }, [isAuthenticated, router]);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchContracts(1, 100, selectedType !== 'all' ? selectedType : undefined, selectedFilter !== 'all' ? selectedFilter : undefined);
      setContracts(data.data);
      
      // 통계 계산
      const activeContracts = data.data.filter((c: Contract) => c.status === 'active').length;
      const completedContracts = data.data.filter((c: Contract) => c.status === 'completed').length;
      const totalEarnings = data.data
        .filter((c: Contract) => c.status === 'completed')
        .reduce((sum: number, c: Contract) => sum + c.terms.baseSalary, 0);
      
      setStats({
        total: data.data.length,
        active: activeContracts,
        completed: completedContracts,
        totalEarnings
      });
    } catch (error) {
      console.error('계약 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = !searchQuery || 
      contract.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || contract.status === selectedFilter;
    const matchesType = selectedType === 'all' || contract.type === selectedType;
    
    return matchesSearch && matchesFilter && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
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
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: ContractType) => {
    switch (type) {
      case 'tournament':
        return '대회 계약';
      case 'annual':
        return '연간 계약';
      case 'training':
        return '훈련 계약';
      case 'sponsorship':
        return '스폰서십';
      default:
        return type;
    }
  };

  const getTypeIcon = (type: ContractType) => {
    switch (type) {
      case 'tournament':
        return <Trophy className="h-4 w-4" />;
      case 'annual':
        return <Calendar className="h-4 w-4" />;
      case 'training':
        return <FileText className="h-4 w-4" />;
      case 'sponsorship':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  // 통계는 이미 state에서 관리됨

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-green-50 via-white to-golf-sky-50 dark:from-golf-dark-900 dark:via-golf-dark-800 dark:to-golf-dark-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="계약 스코어보드" 
        showSearchButton={true}
        showNotificationButton={true}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6 space-y-4">
        {/* 골프 스코어보드 스타일 통계 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-white/80 backdrop-blur-sm border-golf-green-200 shadow-lg">
            <div className="text-center">
              <div className="text-2xl mb-1">🟢</div>
              <p className="text-2xl font-display font-bold text-golf-green-600">{stats.active}</p>
              <p className="text-xs text-golf-green-500 font-medium">진행중</p>
            </div>
          </Card>
          
          <Card className="p-3 bg-white/80 backdrop-blur-sm border-golf-sky-200 shadow-lg">
            <div className="text-center">
              <div className="text-2xl mb-1">✅</div>
              <p className="text-2xl font-display font-bold text-golf-sky-600">{stats.completed}</p>
              <p className="text-xs text-golf-sky-500 font-medium">완료</p>
            </div>
          </Card>
          
          <Card className="p-3 bg-white/80 backdrop-blur-sm border-golf-sand-200 shadow-lg">
            <div className="text-center">
              <div className="text-2xl mb-1">💰</div>
              <p className="text-lg font-display font-bold text-golf-sand-600">{formatCurrency(stats.totalEarnings)}</p>
              <p className="text-xs text-golf-sand-500 font-medium">총 수익</p>
            </div>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="계약 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-golf-green-500"
              >
                <option value="all">전체 상태</option>
                <option value="active">진행중</option>
                <option value="pending">대기중</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소됨</option>
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-golf-green-500"
              >
                <option value="all">전체 타입</option>
                <option value="tournament">대회 계약</option>
                <option value="annual">연간 계약</option>
                <option value="training">훈련 계약</option>
                <option value="sponsorship">스폰서십</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 계약 리스트 */}
        <div className="space-y-3">
          {isLoading ? (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golf-green-600 mx-auto mb-4"></div>
                <p className="text-gray-500">계약 정보를 불러오는 중...</p>
              </CardContent>
            </Card>
          ) : (
            filteredContracts.map((contract) => (
            <Card key={contract.id} className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="text-golf-green-600">
                      {getTypeIcon(contract.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {getTypeLabel(contract.type)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        #{contract.id}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(contract.status)}>
                    {getStatusLabel(contract.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(contract.startDate)} ~ {formatDate(contract.endDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(contract.terms.baseSalary)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Trophy className="h-4 w-4" />
                    <span>{contract.terms.tournamentCount}개 대회</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{contract.terms.contractConditions.duration}개월</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/contracts/${contract.id}`)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    상세보기
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {filteredContracts.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                계약이 없습니다
              </h3>
              <p className="text-gray-500">
                검색 조건에 맞는 계약을 찾을 수 없습니다.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}