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
  Calendar,
  DollarSign,
  Trophy,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Eye
} from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { SponsorshipContract, ExposureItem } from '@/types';

// 임시 스폰서십 계약 데이터
const mockContracts: SponsorshipContract[] = [
  {
    id: '1',
    proposalId: '1',
    sponsorId: '1',
    playerId: 'player1',
    exposureItems: ['hat', 'golf_bag'],
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-01'),
    amount: 20000000,
    isTournamentBased: false,
    terms: '스폰서십 계약 조건: 모자와 골프백에 로고 노출, SNS 홍보 1회',
    status: 'active',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    proposalId: '2',
    sponsorId: '2',
    playerId: 'player2',
    exposureItems: ['shirt', 'pants'],
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-06-01'),
    amount: 15000000,
    isTournamentBased: true,
    tournamentId: '1',
    terms: '대회 기반 스폰서십: 상의와 하의에 로고 노출',
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-01'),
  },
];

export default function SponsorshipContractsPage() {
  const router = useRouter();
  const { userType, isAuthenticated } = useAuthStore();
  const [contracts, setContracts] = useState<SponsorshipContract[]>(mockContracts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredContracts, setFilteredContracts] = useState<SponsorshipContract[]>(contracts);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 스폰서 또는 선수만 접근 가능
    if (userType !== 'sponsor' && userType !== 'tour_pro' && userType !== 'amateur') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, router, userType]);

  useEffect(() => {
    filterContracts();
  }, [contracts, searchQuery, selectedFilter]);

  const filterContracts = () => {
    let filtered = contracts;

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(contract =>
        contract.terms.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 상태 필터링
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(c => c.status === selectedFilter);
    }

    setFilteredContracts(filtered);
  };

  const getExposureItemLabel = (item: ExposureItem) => {
    switch (item) {
      case 'golf_bag':
        return '골프백';
      case 'hat':
        return '모자';
      case 'shirt':
        return '상의';
      case 'pants':
        return '하의';
      default:
        return item;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'blue';
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
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'refunded':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return '결제완료';
      case 'pending':
        return '결제대기';
      case 'refunded':
        return '환불완료';
      default:
        return status;
    }
  };

  const handleViewContract = (contract: SponsorshipContract) => {
    router.push(`/sponsorship/contracts/${contract.id}`);
  };

  const handleDownloadContract = (contract: SponsorshipContract) => {
    // TODO: 계약서 다운로드 기능 구현
    console.log('Download contract:', contract.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="스폰서십 계약" 
        showBackButton={true}
        showNotificationButton={true}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6 space-y-4">
        {/* 검색 및 필터 */}
        <div className="space-y-3">
          {/* 검색 바 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="계약 내용으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 상태 필터 */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
            {[
              { value: 'all', label: '전체' },
              { value: 'active', label: '진행중' },
              { value: 'completed', label: '완료' },
              { value: 'cancelled', label: '취소됨' },
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
        </div>

        {/* 계약 목록 */}
        <div className="space-y-4">
          {filteredContracts.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  스폰서십 계약이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? '검색 결과가 없습니다.' : '아직 체결된 스폰서십 계약이 없습니다.'}
                </p>
              </CardBody>
            </Card>
          ) : (
            filteredContracts.map((contract) => (
              <Card key={contract.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getStatusColor(contract.status)}>
                          {getStatusLabel(contract.status)}
                        </Badge>
                        <Badge variant={getPaymentStatusColor(contract.paymentStatus)}>
                          {getPaymentStatusLabel(contract.paymentStatus)}
                        </Badge>
                        {contract.isTournamentBased && (
                          <Badge variant="outline">
                            대회 기반
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {contract.exposureItems.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {getExposureItemLabel(item)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(contract.startDate)} ~ {formatDate(contract.endDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatCurrency(contract.amount)}
                    </div>
                    {contract.isTournamentBased && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Trophy className="h-4 w-4 mr-2" />
                        대회 기반 계약
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {contract.terms}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatRelativeTime(contract.createdAt)}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadContract(contract);
                        }}
                        leftIcon={<Download className="h-4 w-4" />}
                      >
                        계약서
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewContract(contract);
                        }}
                        leftIcon={<Eye className="h-4 w-4" />}
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
