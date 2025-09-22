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
  Plus,
  Trophy,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Star
} from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { SponsorshipProposal, ExposureItem, SponsorshipStatus } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SponsorshipPage() {
  const router = useRouter();
  const { userType, isAuthenticated } = useAuthStore();
  const [proposals, setProposals] = useState<SponsorshipProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredProposals, setFilteredProposals] = useState<SponsorshipProposal[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    fetchProposals();
  }, [isAuthenticated, router]);

  useEffect(() => {
    filterProposals();
  }, [proposals, searchQuery, selectedFilter]);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      
      // 사용자 타입에 따라 다른 API 호출
      const params = userType === 'sponsor' 
        ? { sponsorId: 'current' } 
        : { playerId: 'current' };
        
      const response = await api.getSponsorshipProposals(params);
      
      if (response.success && response.data) {
        setProposals(response.data);
      } else {
        toast.error('스폰서십 제안을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Fetch proposals error:', error);
      toast.error('스폰서십 제안을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterProposals = () => {
    let filtered = proposals;

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(proposal =>
        proposal.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 상태 필터링
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(p => p.status === selectedFilter);
    }

    setFilteredProposals(filtered);
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

  const getStatusColor = (status: SponsorshipStatus) => {
    switch (status) {
      case 'proposed':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'counter_proposed':
        return 'blue';
      case 'active':
        return 'success';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: SponsorshipStatus) => {
    switch (status) {
      case 'proposed':
        return '제안중';
      case 'accepted':
        return '수락됨';
      case 'rejected':
        return '거절됨';
      case 'counter_proposed':
        return '수정 제안';
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

  const canCreateProposal = () => {
    return userType === 'sponsor';
  };

  const canRespondToProposal = () => {
    return userType === 'tour_pro' || userType === 'amateur';
  };

  const handleCreateProposal = () => {
    router.push('/sponsorship/create');
  };

  const handleRespondToProposal = (proposal: SponsorshipProposal, action: 'accept' | 'reject' | 'counter_propose') => {
    router.push(`/sponsorship/${proposal.id}/respond?action=${action}`);
  };

  const handleViewDetails = (proposal: SponsorshipProposal) => {
    router.push(`/sponsorship/${proposal.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="스폰서십" 
        showSearchButton={false}
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
              placeholder="메시지 내용으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 상태 필터 */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
            {[
              { value: 'all', label: '전체' },
              { value: 'proposed', label: '제안중' },
              { value: 'accepted', label: '수락됨' },
              { value: 'rejected', label: '거절됨' },
              { value: 'counter_proposed', label: '수정 제안' },
              { value: 'active', label: '진행중' },
              { value: 'completed', label: '완료' },
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

        {/* 액션 버튼 */}
        {canCreateProposal() && (
          <Button
            onClick={handleCreateProposal}
            className="w-full"
            leftIcon={<Plus className="h-5 w-5" />}
          >
            새로운 스폰서십 제안하기
          </Button>
        )}

        {/* 스폰서십 제안 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Clock className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">스폰서십 제안을 불러오는 중...</span>
            </div>
          ) : filteredProposals.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  스폰서십 제안이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? '검색 결과가 없습니다.' : '아직 등록된 스폰서십 제안이 없습니다.'}
                </p>
              </CardBody>
            </Card>
          ) : (
            filteredProposals.map((proposal) => (
              <Card key={proposal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getStatusColor(proposal.status)}>
                          {getStatusLabel(proposal.status)}
                        </Badge>
                        {proposal.isTournamentBased && (
                          <Badge variant="outline">
                            대회 기반
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {proposal.exposureItems.map((item, index) => (
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
                      {formatDate(proposal.startDate)} ~ {formatDate(proposal.endDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatCurrency(proposal.amount)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span className="line-clamp-2">{proposal.message}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatRelativeTime(proposal.createdAt)}
                    </div>
                    
                    <div className="flex space-x-2">
                      {canRespondToProposal() && proposal.status === 'proposed' && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRespondToProposal(proposal, 'accept');
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            수락
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRespondToProposal(proposal, 'counter_propose');
                            }}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            수정
                          </Button>
                          <Button
                            size="sm"
                            variant="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRespondToProposal(proposal, 'reject');
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            거절
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(proposal);
                        }}
                      >
                        자세히
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
