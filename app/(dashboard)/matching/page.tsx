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
  MapPin, 
  Calendar, 
  DollarSign, 
  Star,
  Clock,
  User,
  Plus,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { MatchingRequest, UserType } from '@/types';

// 임시 매칭 요청 데이터
const mockMatchingRequests: MatchingRequest[] = [
  {
    id: '1',
    requesterId: 'user1',
    requesterType: 'tour_pro',
    targetType: 'caddy',
    title: '2024 PGA 투어 대회 캐디 필요',
    description: '3월 15일-17일 제주도에서 열리는 PGA 투어 대회에서 캐디를 찾고 있습니다. 경험이 풍부하고 영어 소통이 가능한 캐디를 원합니다.',
    location: '제주도',
    date: new Date('2024-03-15'),
    budget: 800000,
    tournamentId: '1', // 대회 연결
    status: 'pending',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    requesterId: 'user2',
    requesterType: 'amateur',
    targetType: 'caddy',
    title: '아마추어 골프 대회 캐디',
    description: '주말 아마추어 골프 대회에서 캐디가 필요합니다. 친근하고 경험이 있는 캐디를 찾고 있습니다.',
    location: '경기도 양평',
    date: new Date('2024-01-20'),
    budget: 200000,
    status: 'pending',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '3',
    requesterId: 'user3',
    requesterType: 'agency',
    targetType: 'caddy',
    title: '연간 계약 캐디 모집',
    description: '골프 아카데미에서 연간 계약으로 캐디를 모집합니다. 정규직으로 근무하며 안정적인 수입을 보장합니다.',
    location: '서울 강남',
    date: new Date('2024-02-01'),
    budget: 5000000,
    status: 'pending',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
];

export default function MatchingPage() {
  const router = useRouter();
  const { userType, isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredRequests, setFilteredRequests] = useState(mockMatchingRequests);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    let filtered = mockMatchingRequests;

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 상태 필터링
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(request => request.status === selectedFilter);
    }

    setFilteredRequests(filtered);
  }, [searchQuery, selectedFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'matched':
        return 'success';
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
      case 'pending':
        return '모집중';
      case 'matched':
        return '매칭완료';
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소';
      default:
        return status;
    }
  };

  const getUserTypeLabel = (userType: UserType) => {
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

  const canCreateRequest = () => {
    return userType === 'tour_pro' || userType === 'amateur' || userType === 'agency';
  };

  const canApplyToRequest = () => {
    return userType === 'caddy';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="매칭" 
        showSearchButton={true}
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
              placeholder="매칭 요청을 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 필터 탭 */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
            {[
              { value: 'all', label: '전체' },
              { value: 'pending', label: '모집중' },
              { value: 'matched', label: '매칭완료' },
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
        {canCreateRequest() && (
          <Button
            onClick={() => router.push('/matching/create')}
            className="w-full"
            leftIcon={<Plus className="h-5 w-5" />}
          >
            새로운 매칭 요청하기
          </Button>
        )}

        {/* 매칭 요청 목록 */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  매칭 요청이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? '검색 결과가 없습니다.' : '아직 등록된 매칭 요청이 없습니다.'}
                </p>
              </CardBody>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {request.title}
                        </h3>
                        <Badge variant={getStatusColor(request.status)}>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {request.description}
                      </p>
                    </div>
                  </div>

                  {/* 대회 정보 (연결된 경우) */}
                  {request.tournamentId && (
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Trophy className="h-4 w-4 text-primary-600" />
                        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                          연결된 대회
                        </span>
                      </div>
                      <p className="text-sm text-primary-600 dark:text-primary-400">
                        2024 PGA 투어 한국 오픈
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {request.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(request.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatCurrency(request.budget)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      {getUserTypeLabel(request.requesterType)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatRelativeTime(request.createdAt)}
                    </div>
                    
                    <div className="flex space-x-2">
                      {canApplyToRequest() && request.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/matching/${request.id}/apply`);
                          }}
                        >
                          지원하기
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/matching/${request.id}`);
                        }}
                        rightIcon={<ChevronRight className="h-4 w-4" />}
                      >
                        자세히 보기
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
