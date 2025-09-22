'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar, 
  FileText, 
  Users, 
  Bell,
  Trophy,
  TrendingUp,
  ArrowRight,
  MapPin,
  Clock
} from 'lucide-react';

interface GolfHomeDashboardProps {
  className?: string;
}

export function GolfHomeDashboard({ className }: GolfHomeDashboardProps) {
  const router = useRouter();
  // Mock 데이터
  const upcomingTournaments = [
    {
      id: '1',
      name: 'KLPGA 투어 2024',
      date: '2024-03-15',
      location: '제주 블루원 CC',
      status: 'open',
      participants: 120,
      maxParticipants: 144
    },
    {
      id: '2',
      name: 'KPGA 선수권',
      date: '2024-03-22',
      location: '이천 골프클럽',
      status: 'registration',
      participants: 89,
      maxParticipants: 150
    }
  ];

  const recentContracts = [
    {
      id: '1',
      type: 'tournament',
      title: 'KLPGA 투어 캐디 매칭',
      status: 'active',
      date: '2024-03-10',
      amount: 500000
    },
    {
      id: '2',
      type: 'sponsorship',
      title: '골프백 스폰서십',
      status: 'pending',
      date: '2024-03-08',
      amount: 2000000
    }
  ];

  const matchingRequests = [
    {
      id: '1',
      type: 'caddy_request',
      title: '캐디 매칭 요청',
      message: '제주 투어 캐디 필요',
      time: '2시간 전'
    },
    {
      id: '2',
      type: 'sponsorship_inquiry',
      title: '스폰서십 문의',
      message: '골프웨어 브랜드 제안',
      time: '1일 전'
    }
  ];

  const quickActions = [
    {
      icon: '🏌️‍♂️',
      title: '매칭 찾기',
      description: '캐디/투어프로 매칭',
      href: '/matching'
    },
    {
      icon: '📑',
      title: '계약 관리',
      description: '진행중인 계약',
      href: '/contracts'
    },
    {
      icon: '💰',
      title: '결제 내역',
      description: '수수료 및 정산',
      href: '/payments'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'open':
        return 'blue';
      case 'registration':
        return 'green';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '진행중';
      case 'pending':
        return '대기중';
      case 'open':
        return '접수중';
      case 'registration':
        return '접수중';
      default:
        return status;
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-golf-green-50 via-white to-golf-sky-50 dark:from-golf-dark-900 dark:via-golf-dark-800 dark:to-golf-dark-900 ${className || ''}`}>
      {/* 골프장 배너 */}
      <div className="relative h-64 bg-gradient-to-r from-golf-green-600 to-golf-green-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h1 className="text-4xl font-display font-bold mb-2">
              🏌️‍♂️ 스포이음
            </h1>
            <p className="text-lg opacity-90">
              골프 전문 매칭 플랫폼
            </p>
            <p className="text-sm opacity-80 mt-2">
              투어프로부터 아마추어까지, 모든 골퍼를 위한 서비스
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-golf-green-200 bg-white/95 backdrop-blur-sm shadow-lg">
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-golf-green-100 rounded-full">
                  <Trophy className="w-6 h-6 text-golf-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-golf-green-600">이번주 대회</p>
                  <p className="text-2xl font-display font-bold text-golf-green-700">
                    {upcomingTournaments.length}
                  </p>
                  <p className="text-xs text-golf-green-600">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    총 28개 대회
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-golf-sky-200 bg-white/95 backdrop-blur-sm shadow-lg">
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-golf-sky-100 rounded-full">
                  <FileText className="w-6 h-6 text-golf-sky-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-golf-sky-600">내 계약</p>
                  <p className="text-2xl font-display font-bold text-golf-sky-700">
                    {recentContracts.filter(c => c.status === 'active').length}
                  </p>
                  <p className="text-xs text-golf-sky-600">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    진행중 {recentContracts.length}건
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-golf-sand-200 bg-white/95 backdrop-blur-sm shadow-lg">
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-golf-sand-100 rounded-full">
                  <Bell className="w-6 h-6 text-golf-sand-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-golf-sand-600">매칭 알림</p>
                  <p className="text-2xl font-display font-bold text-golf-sand-700">
                    {matchingRequests.length}
                  </p>
                  <p className="text-xs text-golf-sand-600">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    새로운 요청
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 이번주 대회 일정 */}
          <Card className="border-golf-green-200 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-golf-green-500 to-golf-green-600 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                이번주 대회 일정
              </h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {upcomingTournaments.map((tournament) => (
                  <div key={tournament.id} className="flex items-center justify-between p-4 bg-golf-green-50 rounded-lg border border-golf-green-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-golf-dark-700">{tournament.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-golf-dark-600 mt-1">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {tournament.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {tournament.location}
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-golf-dark-500 mb-1">
                          <span>참가자</span>
                          <span>{tournament.participants}/{tournament.maxParticipants}</span>
                        </div>
                        <div className="w-full bg-golf-green-200 rounded-full h-2">
                          <div 
                            className="bg-golf-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(tournament.participants / tournament.maxParticipants) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(tournament.status)} className="ml-4">
                      {getStatusText(tournament.status)}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-golf-green-300 text-golf-green-600 hover:bg-golf-green-50"
                  onClick={() => handleNavigation('/tournaments')}
                >
                  전체 대회 보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* 내 계약 현황 */}
          <Card className="border-golf-sky-200 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-golf-sky-500 to-golf-sky-600 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                내 계약 현황
              </h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {recentContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 bg-golf-sky-50 rounded-lg border border-golf-sky-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-golf-dark-700">{contract.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-golf-dark-600 mt-1">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {contract.date}
                        </div>
                        <div className="flex items-center">
                          <span className="font-display font-bold text-golf-sky-700">
                            {contract.amount.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(contract.status)} className="ml-4">
                      {getStatusText(contract.status)}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-golf-sky-300 text-golf-sky-600 hover:bg-golf-sky-50"
                  onClick={() => handleNavigation('/contracts')}
                >
                  계약 관리
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* 매칭 요청 */}
          <Card className="border-golf-sand-200 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-golf-sand-500 to-golf-sand-600 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                매칭 요청
              </h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {matchingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-golf-sand-50 rounded-lg border border-golf-sand-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-golf-dark-700">{request.title}</h3>
                      <p className="text-sm text-golf-dark-600 mt-1">{request.message}</p>
                      <div className="flex items-center text-xs text-golf-dark-500 mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {request.time}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-golf-sand-300 text-golf-sand-600 hover:bg-golf-sand-100"
                      onClick={() => handleNavigation('/matching')}
                    >
                      확인
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-golf-sand-300 text-golf-sand-600 hover:bg-golf-sand-50"
                  onClick={() => handleNavigation('/matching')}
                >
                  모든 요청 보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* 빠른 액션 */}
          <Card className="border-golf-green-200 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-golf-green-500 to-golf-green-600 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                빠른 액션
              </h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 flex items-center justify-start space-x-4 border-golf-green-300 text-golf-dark-700 hover:bg-golf-green-50"
                    onClick={() => handleNavigation(action.href)}
                  >
                    <div className="text-2xl">{action.icon}</div>
                    <div className="text-left">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-xs text-golf-dark-500">{action.description}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
