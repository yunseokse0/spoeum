'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  DollarSign,
  Clock,
  Star,
  ExternalLink,
  Phone,
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { Tournament } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function TournamentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (params.id) {
      fetchTournament(params.id as string);
    }
  }, [isAuthenticated, router, params.id]);

  const fetchTournament = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await api.getTournament(id);
      
      if (response.success && response.data) {
        setTournament(response.data);
      } else {
        toast.error('대회 정보를 불러오는데 실패했습니다.');
        router.push('/tournaments');
      }
    } catch (error) {
      console.error('Fetch tournament error:', error);
      toast.error('대회 정보를 불러오는 중 오류가 발생했습니다.');
      router.push('/tournaments');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pga':
        return 'blue';
      case 'kpga':
        return 'success';
      case 'amateur':
        return 'warning';
      case 'corporate':
        return 'secondary';
      case 'charity':
        return 'destructive';
      default:
        return 'secondary';
    }
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

  const isRegistrationOpen = () => {
    if (!tournament) return false;
    const now = new Date();
    return tournament.isRegistrationOpen && 
           tournament.registrationStartDate <= now && 
           tournament.registrationEndDate >= now;
  };

  const isTournamentActive = () => {
    if (!tournament) return false;
    const now = new Date();
    return tournament.startDate <= now && tournament.endDate >= now;
  };

  const isTournamentUpcoming = () => {
    if (!tournament) return false;
    const now = new Date();
    return tournament.startDate > now;
  };

  const isTournamentCompleted = () => {
    if (!tournament) return false;
    const now = new Date();
    return tournament.endDate < now;
  };

  const getStatusBadge = () => {
    if (!tournament) return null;
    
    if (isTournamentCompleted()) {
      return <Badge variant="secondary">종료</Badge>;
    } else if (isTournamentActive()) {
      return <Badge variant="success">진행중</Badge>;
    } else if (isTournamentUpcoming()) {
      return <Badge variant="blue">예정</Badge>;
    } else {
      return <Badge variant="secondary">대기</Badge>;
    }
  };

  const getRegistrationBadge = () => {
    if (!tournament) return null;
    
    if (isRegistrationOpen()) {
      return <Badge variant="success">접수중</Badge>;
    } else if (tournament.registrationEndDate < new Date()) {
      return <Badge variant="destructive">접수마감</Badge>;
    } else {
      return <Badge variant="warning">접수예정</Badge>;
    }
  };

  const handleRegister = () => {
    if (!tournament) return;
    router.push(`/tournaments/${tournament.id}/register`);
  };

  const handleCreateMatching = () => {
    if (!tournament) return;
    router.push(`/matching/create?tournamentId=${tournament.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">대회 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            대회를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            요청하신 대회 정보를 찾을 수 없습니다.
          </p>
          <Button onClick={() => router.push('/tournaments')}>
            대회 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="대회 상세" 
        showBackButton={true}
        showNotificationButton={true}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6 space-y-6">
        {/* 대회 헤더 */}
        <Card>
          <CardBody>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant={getTypeColor(tournament.type)}>
                    {getTypeLabel(tournament.type)}
                  </Badge>
                  <Badge variant="outline">
                    {getCategoryLabel(tournament.category)}
                  </Badge>
                  {getStatusBadge()}
                  {getRegistrationBadge()}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {tournament.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {tournament.description}
                </p>
              </div>
              {tournament.imageUrl && (
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg ml-4 flex-shrink-0">
                  <img
                    src={tournament.imageUrl}
                    alt={tournament.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              기본 정보
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">대회 기간</p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(tournament.startDate)} ~ {formatDate(tournament.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">위치</p>
                  <p className="text-gray-900 dark:text-white">
                    {tournament.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Trophy className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">골프장</p>
                  <p className="text-gray-900 dark:text-white">
                    {tournament.course}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">참가자</p>
                  <p className="text-gray-900 dark:text-white">
                    {tournament.currentParticipants} / {tournament.maxParticipants}명
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">참가비</p>
                  <p className="text-gray-900 dark:text-white">
                    {formatCurrency(tournament.entryFee)}
                  </p>
                </div>
              </div>

              {tournament.prizePool > 0 && (
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">상금</p>
                    <p className="text-gray-900 dark:text-white">
                      {formatCurrency(tournament.prizePool)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* 접수 정보 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              접수 정보
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">접수 기간</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDate(tournament.registrationStartDate)} ~ {formatDate(tournament.registrationEndDate)}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">주최</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{tournament.organizer}</p>
            </div>

            <div className="flex items-center space-x-4">
              {tournament.contactInfo && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tournament.contactInfo}
                  </span>
                </div>
              )}
              {tournament.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a
                    href={tournament.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    공식 웹사이트
                  </a>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* 참가 조건 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              참가 조건
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {tournament.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 대회 규칙 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              대회 규칙
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {tournament.rules.map((rule, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-warning-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{rule}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          {isRegistrationOpen() && (
            <Button
              onClick={handleRegister}
              className="w-full"
              leftIcon={<Star className="h-5 w-5" />}
            >
              대회 접수하기
            </Button>
          )}
          
          <Button
            onClick={handleCreateMatching}
            variant="outline"
            className="w-full"
            leftIcon={<Users className="h-5 w-5" />}
          >
            이 대회 관련 매칭 요청하기
          </Button>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
