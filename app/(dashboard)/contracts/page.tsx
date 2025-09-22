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
  FileText, 
  Calendar, 
  MapPin,
  DollarSign,
  Clock,
  User,
  Plus,
  Eye,
  Edit,
  X
} from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { Contract } from '@/types';

// 임시 계약 데이터
const mockContracts: Contract[] = [
  {
    id: '1',
    matchingRequestId: 'request1',
    requesterId: 'user1',
    providerId: 'user2',
    type: 'tournament',
    title: '2024 PGA 투어 대회 계약',
    description: '3월 15일-17일 제주도 PGA 투어 대회에서 캐디 서비스 제공',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
    location: '제주도',
    baseRate: 800000,
    status: 'active',
    terms: '대회 기간 중 캐디 서비스 제공, 성과에 따른 인센티브 지급',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    matchingRequestId: 'request2',
    requesterId: 'user2',
    providerId: 'user1',
    type: 'annual',
    title: '2024년 연간 캐디 계약',
    description: '골프 아카데미에서 정규 캐디로 연간 계약',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    location: '서울 강남',
    baseRate: 5000000,
    status: 'active',
    terms: '월급 + 인센티브, 주 5일 근무, 연차 및 휴가 제공',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-15'),
  },
  {
    id: '3',
    matchingRequestId: 'request3',
    requesterId: 'user3',
    providerId: 'user1',
    type: 'tournament',
    title: '아마추어 골프 대회 계약',
    description: '주말 아마추어 골프 대회 캐디 서비스',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-01-20'),
    location: '경기도 양평',
    baseRate: 200000,
    status: 'completed',
    terms: '대회 당일 캐디 서비스 제공',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-21'),
  },
];

export default function ContractsPage() {
  const router = useRouter();
  const { userType, isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [filteredContracts, setFilteredContracts] = useState(mockContracts);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    let filtered = mockContracts;

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(contract =>
        contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 상태 필터링
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === selectedFilter);
    }

    // 타입 필터링
    if (selectedType !== 'all') {
      filtered = filtered.filter(contract => contract.type === selectedType);
    }

    setFilteredContracts(filtered);
  }, [searchQuery, selectedFilter, selectedType]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'error';
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
        return '취소';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tournament':
        return '대회 계약';
      case 'annual':
        return '연간 계약';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tournament':
        return 'primary';
      case 'annual':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const isContractActive = (contract: Contract) => {
    const now = new Date();
    return contract.status === 'active' && 
           contract.startDate <= now && 
           contract.endDate >= now;
  };

  const isContractUpcoming = (contract: Contract) => {
    const now = new Date();
    return contract.status === 'active' && contract.startDate > now;
  };

  const isContractExpired = (contract: Contract) => {
    const now = new Date();
    return contract.status === 'active' && contract.endDate < now;
  };

  // 통계 계산
  const activeContracts = mockContracts.filter(c => c.status === 'active').length;
  const completedContracts = mockContracts.filter(c => c.status === 'completed').length;
  const totalEarnings = mockContracts
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.baseRate, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="계약 관리" 
        showSearchButton={true}
        showNotificationButton={true}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6 space-y-4">
        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{activeContracts}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">진행중</p>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-success-600">{completedContracts}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">완료</p>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <p className="text-lg font-bold text-warning-600">
                {formatCurrency(totalEarnings).replace('₩', '')}원
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">총 수익</p>
            </div>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <div className="space-y-3">
          {/* 검색 바 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="계약을 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 필터 탭 */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
            {[
              { value: 'all', label: '전체' },
              { value: 'active', label: '진행중' },
              { value: 'pending', label: '대기중' },
              { value: 'completed', label: '완료' },
              { value: 'cancelled', label: '취소' },
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
              { value: 'tournament', label: '대회 계약' },
              { value: 'annual', label: '연간 계약' },
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
        <Button
          onClick={() => router.push('/contracts/create')}
          className="w-full"
          leftIcon={<Plus className="h-5 w-5" />}
        >
          새로운 계약 생성
        </Button>

        {/* 계약 목록 */}
        <div className="space-y-4">
          {filteredContracts.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  계약이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? '검색 결과가 없습니다.' : '아직 등록된 계약이 없습니다.'}
                </p>
              </CardBody>
            </Card>
          ) : (
            filteredContracts.map((contract) => (
              <Card key={contract.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={getTypeColor(contract.type)}>
                          {getTypeLabel(contract.type)}
                        </Badge>
                        <Badge variant={getStatusColor(contract.status)}>
                          {getStatusLabel(contract.status)}
                        </Badge>
                        {isContractUpcoming(contract) && (
                          <Badge variant="warning">시작 예정</Badge>
                        )}
                        {isContractExpired(contract) && (
                          <Badge variant="error">만료됨</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                        {contract.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {contract.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {contract.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(contract.startDate)} ~ {formatDate(contract.endDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatCurrency(contract.baseRate)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatRelativeTime(contract.createdAt)}
                    </div>
                    
                    <div className="flex space-x-2">
                      {contract.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/contracts/${contract.id}/edit`);
                          }}
                          leftIcon={<Edit className="h-4 w-4" />}
                        >
                          수정
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/contracts/${contract.id}`);
                        }}
                        rightIcon={<Eye className="h-4 w-4" />}
                      >
                        상세보기
                      </Button>
                    </div>
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
