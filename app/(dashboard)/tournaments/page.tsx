'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { TournamentCard } from '@/components/ui/TournamentCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  Filter, 
  Calendar,
  Trophy,
  MapPin,
  Users,
  RefreshCw
} from 'lucide-react';
import { Tournament, TournamentFilter } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function TournamentsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    fetchTournaments();
  }, [isAuthenticated, router]);

  useEffect(() => {
    filterTournaments();
  }, [tournaments, searchQuery, selectedFilter, selectedType, selectedCategory]);

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      const response = await api.getTournaments({ 
        page: 1, 
        limit: 50,
        isActive: true 
      });
      
      if (response.success && response.data) {
        setTournaments(response.data);
      } else {
        toast.error('대회 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Fetch tournaments error:', error);
      toast.error('대회 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTournaments = () => {
    let filtered = tournaments;

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(tournament =>
        tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tournament.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tournament.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tournament.course.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 상태 필터링
    if (selectedFilter !== 'all') {
      const now = new Date();
      switch (selectedFilter) {
        case 'upcoming':
          filtered = filtered.filter(t => t.startDate > now);
          break;
        case 'active':
          filtered = filtered.filter(t => t.startDate <= now && t.endDate >= now);
          break;
        case 'completed':
          filtered = filtered.filter(t => t.endDate < now);
          break;
        case 'registration_open':
          filtered = filtered.filter(t => 
            t.isRegistrationOpen && 
            t.registrationStartDate <= now && 
            t.registrationEndDate >= now
          );
          break;
      }
    }

    // 타입 필터링
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    setFilteredTournaments(filtered);
  };

  const handleViewDetails = (tournament: Tournament) => {
    router.push(`/tournaments/${tournament.id}`);
  };

  const handleRegister = (tournament: Tournament) => {
    router.push(`/tournaments/${tournament.id}/register`);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pga':
        return 'PGA 투어';
      case 'kpga':
        return 'KPGA 투어';
      case 'amateur':
        return '아마추어';
      case 'corporate':
        return '기업';
      case 'charity':
        return '자선';
      default:
        return type;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'men':
        return '남성';
      case 'women':
        return '여성';
      case 'senior':
        return '시니어';
      case 'junior':
        return '주니어';
      case 'mixed':
        return '혼성';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="대회" 
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
              placeholder="대회명, 지역, 골프장으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 상태 필터 */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
            {[
              { value: 'all', label: '전체' },
              { value: 'upcoming', label: '예정' },
              { value: 'active', label: '진행중' },
              { value: 'completed', label: '종료' },
              { value: 'registration_open', label: '접수중' },
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
              { value: 'pga', label: 'PGA 투어' },
              { value: 'kpga', label: 'KPGA 투어' },
              { value: 'amateur', label: '아마추어' },
              { value: 'corporate', label: '기업' },
              { value: 'charity', label: '자선' },
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

          {/* 카테고리 필터 */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
            {[
              { value: 'all', label: '전체 카테고리' },
              { value: 'men', label: '남성' },
              { value: 'women', label: '여성' },
              { value: 'senior', label: '시니어' },
              { value: 'junior', label: '주니어' },
              { value: 'mixed', label: '혼성' },
            ].map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* 새로고침 버튼 */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTournaments}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            새로고침
          </Button>
        </div>

        {/* 대회 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">대회 목록을 불러오는 중...</span>
            </div>
          ) : filteredTournaments.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                대회가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? '검색 결과가 없습니다.' : '등록된 대회가 없습니다.'}
              </p>
            </div>
          ) : (
            filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onViewDetails={handleViewDetails}
                onRegister={handleRegister}
                showActions={true}
              />
            ))
          )}
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
