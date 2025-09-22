'use client';

import React from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar, 
  FileText, 
  Users, 
  Trophy,
  TrendingUp,
  Bell,
  ArrowRight,
  MapPin,
  Clock,
  Star
} from 'lucide-react';

interface GolfHomeDashboardProps {
  className?: string;
}

export function GolfHomeDashboard({ className }: GolfHomeDashboardProps) {
  // Mock 데이터
  const weeklyTournaments = [
    {
      id: '1',
      name: '2024 PGA 투어 한국 오픈',
      date: '2024-03-15',
      location: '제주도',
      prize: '₩2,000,000,000',
      participants: 142,
      maxParticipants: 156
    },
    {
      id: '2', 
      name: 'KPGA 제네시스 챔피언십',
      date: '2024-03-18',
      location: '경기도 용인',
      prize: '₩1,500,000,000',
      participants: 98,
      maxParticipants: 120
    }
  ];

  const myContracts = [
    {
      id: '1',
      type: 'caddy_contract',
      tournament: '2024 PGA 투어 한국 오픈',
      status: 'active',
      amount: '₩500,000',
      daysLeft: 3
    },
    {
      id: '2',
      type: 'sponsorship',
      tournament: 'KPGA 제네시스 챔피언십',
      status: 'pending',
      amount: '₩2,000,000',
      daysLeft: 5
    }
  ];

  const matchingRequests = [
    {
      id: '1',
      type: 'caddy_request',
      tournament: '아마추어 골프 챔피언십',
      location: '경기도 포천',
      date: '2024-03-20',
      budget: '₩300,000',
      priority: 'high'
    }
  ];

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
        {/* 골프장 텍스처 배경 */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 환영 메시지 */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-golf-dark-700 mb-2">
            안녕하세요, 김골퍼님! 👋
          </h2>
          <p className="text-golf-dark-600">
            오늘도 좋은 골프 하세요. 새로운 매칭 기회를 확인해보세요.
          </p>
        </div>

        {/* 주요 섹션들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 이번주 대회 일정 */}
          <Card className="border-golf-green-200 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-golf-green-500 to-golf-green-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">이번주 대회 일정</h3>
                </div>
                <Badge variant="success" className="text-xs">
                  {weeklyTournaments.length}개 대회
                </Badge>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {weeklyTournaments.map((tournament) => (
                  <div key={tournament.id} className="flex items-center justify-between p-4 bg-golf-green-50 rounded-lg border border-golf-green-200">
                    <div className="flex-1">
                      <h4 className="font-semibold text-golf-dark-700 mb-1">
                        {tournament.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-golf-dark-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{tournament.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{tournament.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-golf-green-600">
                        {tournament.prize}
                      </div>
                      <div className="text-xs text-golf-dark-500">
                        {tournament.participants}/{tournament.maxParticipants}명
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 border-golf-green-300 text-golf-green-700 hover:bg-golf-green-50"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                전체 대회 보기
              </Button>
            </CardBody>
          </Card>

          {/* 내 계약 현황 */}
          <Card className="border-golf-sky-200 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-golf-sky-500 to-golf-sky-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">내 계약 현황</h3>
                </div>
                <Badge variant="blue" className="text-xs">
                  {myContracts.length}건 진행중
                </Badge>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {myContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 bg-golf-sky-50 rounded-lg border border-golf-sky-200">
                    <div className="flex-1">
                      <h4 className="font-semibold text-golf-dark-700 mb-1">
                        {contract.tournament}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={contract.status === 'active' ? 'success' : 'warning'}
                          className="text-xs"
                        >
                          {contract.status === 'active' ? '진행중' : '대기중'}
                        </Badge>
                        <span className="text-sm text-golf-dark-600">
                          {contract.type === 'caddy_contract' ? '캐디 계약' : '스폰서십'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-golf-sky-600">
                        {contract.amount}
                      </div>
                      <div className="text-xs text-golf-dark-500">
                        {contract.daysLeft}일 남음
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 border-golf-sky-300 text-golf-sky-700 hover:bg-golf-sky-50"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                계약 관리
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* 매칭 요청 알림 */}
        <Card className="border-golf-sand-200 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-golf-sand-500 to-golf-sand-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <h3 className="text-lg font-semibold">매칭 요청</h3>
              </div>
              <Badge variant="warning" className="text-xs">
                {matchingRequests.length}건 신규
              </Badge>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              {matchingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-golf-sand-50 rounded-lg border border-golf-sand-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-golf-dark-700">
                        {request.tournament}
                      </h4>
                      <Badge 
                        variant={request.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {request.priority === 'high' ? '긴급' : '일반'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-golf-dark-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{request.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{request.budget}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-golf-green-600 hover:bg-golf-green-700">
                      수락
                    </Button>
                    <Button size="sm" variant="outline" className="border-golf-dark-300">
                      거절
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 border-golf-sand-300 text-golf-sand-700 hover:bg-golf-sand-50"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              모든 매칭 보기
            </Button>
          </CardBody>
        </Card>

        {/* 빠른 액션 */}
        <div className="mt-8">
          <h3 className="text-xl font-display font-bold text-golf-dark-700 mb-4">
            빠른 액션
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 bg-gradient-to-br from-golf-green-500 to-golf-green-600 hover:from-golf-green-600 hover:to-golf-green-700 text-white"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🏌️‍♂️</div>
                <div className="text-sm font-semibold">매칭 찾기</div>
              </div>
            </Button>
            <Button 
              className="h-20 bg-gradient-to-br from-golf-sky-500 to-golf-sky-600 hover:from-golf-sky-600 hover:to-golf-sky-700 text-white"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">📑</div>
                <div className="text-sm font-semibold">계약 관리</div>
              </div>
            </Button>
            <Button 
              className="h-20 bg-gradient-to-br from-golf-sand-500 to-golf-sand-600 hover:from-golf-sand-600 hover:to-golf-sand-700 text-white"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🎒</div>
                <div className="text-sm font-semibold">캐디 등록</div>
              </div>
            </Button>
            <Button 
              className="h-20 bg-gradient-to-br from-golf-dark-500 to-golf-dark-600 hover:from-golf-dark-600 hover:to-golf-dark-700 text-white"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-sm font-semibold">결제 내역</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
