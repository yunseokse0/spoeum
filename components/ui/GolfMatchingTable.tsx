'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';

interface GolfMatchingTableProps {
  className?: string;
}

interface MatchingRequest {
  id: string;
  type: 'caddy_request' | 'sponsorship' | 'tournament';
  title: string;
  location: string;
  date: string;
  budget: string;
  participants: number;
  maxParticipants: number;
  status: 'open' | 'pending' | 'closed' | 'completed';
  priority: 'high' | 'medium' | 'low';
  organizer: string;
  requirements: string[];
}

export function GolfMatchingTable({ className }: GolfMatchingTableProps) {
  const [filter, setFilter] = useState<'all' | 'open' | 'pending' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock 데이터
  const matchingRequests: MatchingRequest[] = [
    {
      id: '1',
      type: 'caddy_request',
      title: '2024 PGA 투어 한국 오픈',
      location: '제주도',
      date: '2024-03-15',
      budget: '₩500,000',
      participants: 8,
      maxParticipants: 10,
      status: 'open',
      priority: 'high',
      organizer: '한국골프협회',
      requirements: ['경력 3년 이상', '제주도 지역']
    },
    {
      id: '2',
      type: 'sponsorship',
      title: 'KPGA 제네시스 챔피언십',
      location: '경기도 용인',
      date: '2024-03-18',
      budget: '₩2,000,000',
      participants: 3,
      maxParticipants: 5,
      status: 'pending',
      priority: 'high',
      organizer: 'KPGA',
      requirements: ['스폰서십 경험', '브랜드 인지도']
    },
    {
      id: '3',
      type: 'tournament',
      title: '아마추어 골프 챔피언십',
      location: '경기도 포천',
      date: '2024-03-20',
      budget: '₩300,000',
      participants: 15,
      maxParticipants: 20,
      status: 'open',
      priority: 'medium',
      organizer: '한국아마추어골프협회',
      requirements: ['핸디캡 20 이하', '아마추어 자격']
    },
    {
      id: '4',
      type: 'caddy_request',
      title: '기업 골프 대회',
      location: '경기도 양평',
      date: '2024-03-22',
      budget: '₩200,000',
      participants: 5,
      maxParticipants: 8,
      status: 'closed',
      priority: 'low',
      organizer: '기업골프협회',
      requirements: ['기업 대회 경험']
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'success';
      case 'pending':
        return 'warning';
      case 'closed':
        return 'destructive';
      case 'completed':
        return 'blue';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'caddy_request':
        return '🎒';
      case 'sponsorship':
        return '💰';
      case 'tournament':
        return '🏆';
      default:
        return '🏌️‍♂️';
    }
  };

  const filteredRequests = matchingRequests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-golf-dark-700 mb-4">
          🏌️‍♂️ 골프 매칭 스코어보드
        </h1>
        <p className="text-golf-dark-600">
          실시간 매칭 현황을 확인하고 참여하세요
        </p>
      </div>

      {/* 필터 및 검색 */}
      <Card className="border-golf-green-200 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-golf-dark-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="대회명, 지역, 주최자로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-golf-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golf-green-500"
                />
              </div>
            </div>

            {/* 필터 */}
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-golf-green-600 hover:bg-golf-green-700' : 'border-golf-green-300'}
              >
                전체
              </Button>
              <Button
                variant={filter === 'open' ? 'default' : 'outline'}
                onClick={() => setFilter('open')}
                className={filter === 'open' ? 'bg-golf-green-600 hover:bg-golf-green-700' : 'border-golf-green-300'}
              >
                모집중
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
                className={filter === 'pending' ? 'bg-golf-sky-600 hover:bg-golf-sky-700' : 'border-golf-sky-300'}
              >
                검토중
              </Button>
              <Button
                variant={filter === 'closed' ? 'default' : 'outline'}
                onClick={() => setFilter('closed')}
                className={filter === 'closed' ? 'bg-golf-dark-600 hover:bg-golf-dark-700' : 'border-golf-dark-300'}
              >
                마감
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 매칭 테이블 */}
      <Card className="border-golf-green-200 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-golf-green-500 to-golf-green-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <h2 className="text-lg font-semibold">매칭 현황</h2>
            </div>
            <Badge variant="outline" className="text-white border-white/30">
              {filteredRequests.length}건
            </Badge>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-golf-green-50 border-b border-golf-green-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-golf-dark-700 uppercase tracking-wider">
                    대회 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-golf-dark-700 uppercase tracking-wider">
                    위치 & 일정
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-golf-dark-700 uppercase tracking-wider">
                    예산
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-golf-dark-700 uppercase tracking-wider">
                    참가 현황
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-golf-dark-700 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-golf-dark-700 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-golf-green-100">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-golf-green-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getTypeIcon(request.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-sm font-semibold text-golf-dark-700">
                              {request.title}
                            </h3>
                            <Badge variant={getPriorityColor(request.priority)} className="text-xs">
                              {request.priority === 'high' ? '긴급' : 
                               request.priority === 'medium' ? '보통' : '낮음'}
                            </Badge>
                          </div>
                          <p className="text-xs text-golf-dark-600 mb-2">
                            {request.organizer}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {request.requirements.slice(0, 2).map((req, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                            {request.requirements.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{request.requirements.length - 2}개
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm text-golf-dark-600">
                          <MapPin className="w-4 h-4" />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-golf-dark-600">
                          <Calendar className="w-4 h-4" />
                          <span>{request.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-display font-bold text-golf-green-600">
                        {request.budget}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-golf-dark-500" />
                        <div className="text-sm">
                          <span className="font-medium text-golf-dark-700">
                            {request.participants}
                          </span>
                          <span className="text-golf-dark-500">
                            /{request.maxParticipants}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-golf-green-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-golf-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(request.participants / request.maxParticipants) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <Badge variant={getStatusColor(request.status)} className="text-xs">
                          {request.status === 'open' ? '모집중' :
                           request.status === 'pending' ? '검토중' :
                           request.status === 'closed' ? '마감' : '완료'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {request.status === 'open' && (
                          <>
                            <Button size="sm" className="bg-golf-green-600 hover:bg-golf-green-700">
                              신청
                            </Button>
                            <Button size="sm" variant="outline" className="border-golf-sky-300 text-golf-sky-700">
                              상세
                            </Button>
                          </>
                        )}
                        {request.status === 'pending' && (
                          <Button size="sm" variant="outline" className="border-golf-dark-300 text-golf-dark-700">
                            대기중
                          </Button>
                        )}
                        {request.status === 'closed' && (
                          <Button size="sm" variant="outline" className="border-golf-dark-300 text-golf-dark-500" disabled>
                            마감
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

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-golf-green-200 bg-white/90 backdrop-blur-sm">
          <CardBody className="p-4 text-center">
            <div className="text-2xl font-display font-bold text-golf-green-600 mb-1">
              {filteredRequests.filter(r => r.status === 'open').length}
            </div>
            <div className="text-sm text-golf-dark-600">모집중</div>
          </CardBody>
        </Card>
        <Card className="border-golf-sky-200 bg-white/90 backdrop-blur-sm">
          <CardBody className="p-4 text-center">
            <div className="text-2xl font-display font-bold text-golf-sky-600 mb-1">
              {filteredRequests.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-golf-dark-600">검토중</div>
          </CardBody>
        </Card>
        <Card className="border-golf-sand-200 bg-white/90 backdrop-blur-sm">
          <CardBody className="p-4 text-center">
            <div className="text-2xl font-display font-bold text-golf-sand-600 mb-1">
              {filteredRequests.reduce((sum, r) => sum + r.participants, 0)}
            </div>
            <div className="text-sm text-golf-dark-600">총 참가자</div>
          </CardBody>
        </Card>
        <Card className="border-golf-dark-200 bg-white/90 backdrop-blur-sm">
          <CardBody className="p-4 text-center">
            <div className="text-2xl font-display font-bold text-golf-dark-600 mb-1">
              {filteredRequests.length}
            </div>
            <div className="text-sm text-golf-dark-600">전체 매칭</div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
