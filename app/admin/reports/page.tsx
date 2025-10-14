'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Trophy,
  DollarSign,
  Activity,
  Target,
  PieChart,
  LineChart
} from 'lucide-react';

interface ReportData {
  period: string;
  totalUsers: number;
  activeUsers: number;
  totalTournaments: number;
  completedTournaments: number;
  totalRevenue: number;
  sponsorshipRevenue: number;
  pointTransactions: number;
  growthRate: number;
}

interface TournamentStats {
  name: string;
  participants: number;
  revenue: number;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [tournamentStats, setTournamentStats] = useState<TournamentStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock 데이터 생성
  useEffect(() => {
    const mockReportData: ReportData = {
      period: '2025년 1월',
      totalUsers: 1250,
      activeUsers: 980,
      totalTournaments: 15,
      completedTournaments: 8,
      totalRevenue: 12500000000,
      sponsorshipRevenue: 8500000000,
      pointTransactions: 2450,
      growthRate: 12.5
    };

    const mockTournamentStats: TournamentStats[] = [
      {
        name: '2025 KLPGA 시즌 개막전',
        participants: 120,
        revenue: 1500000000,
        status: 'completed'
      },
      {
        name: '2025 롯데 챔피언십',
        participants: 144,
        revenue: 2000000000,
        status: 'ongoing'
      },
      {
        name: '2025 BMW 레이디스 챔피언십',
        participants: 100,
        revenue: 1800000000,
        status: 'upcoming'
      },
      {
        name: '2025 S-OIL 챔피언십',
        participants: 132,
        revenue: 1200000000,
        status: 'upcoming'
      },
      {
        name: '2025 KLPGA 챔피언십',
        participants: 144,
        revenue: 3000000000,
        status: 'upcoming'
      }
    ];

    setReportData(mockReportData);
    setTournamentStats(mockTournamentStats);
    setLoading(false);
  }, [selectedPeriod]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="green">완료</Badge>;
      case 'ongoing':
        return <Badge variant="blue">진행중</Badge>;
      case 'upcoming':
        return <Badge variant="yellow">예정</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">통계리포트</h1>
            <p className="text-gray-600 dark:text-gray-400">분석 및 리포트</p>
          </div>
          <div className="flex space-x-3">
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-48"
            >
              <option value="week">최근 1주</option>
              <option value="month">최근 1개월</option>
              <option value="quarter">최근 3개월</option>
              <option value="year">최근 1년</option>
            </Select>
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              리포트 다운로드
            </Button>
          </div>
        </div>

        {/* 주요 지표 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 사용자</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {reportData?.totalUsers.toLocaleString()}명
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{reportData?.growthRate}% 증가
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">활성 사용자</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reportData?.activeUsers.toLocaleString()}명
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    전체의 {Math.round((reportData?.activeUsers || 0) / (reportData?.totalUsers || 1) * 100)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 수익</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {reportData?.totalRevenue.toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    전월 대비 +15.2%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">완료 대회</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {reportData?.completedTournaments}개
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    총 {reportData?.totalTournaments}개 중
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 수익 추이 차트 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">수익 추이</h3>
                <Button variant="outline" size="sm" leftIcon={<LineChart className="w-4 h-4" />}>
                  상세보기
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">수익 추이 차트</p>
                  <p className="text-sm text-gray-400">데이터 시각화 영역</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 사용자 활동 차트 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">사용자 활동</h3>
                <Button variant="outline" size="sm" leftIcon={<PieChart className="w-4 h-4" />}>
                  상세보기
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">사용자 활동 차트</p>
                  <p className="text-sm text-gray-400">데이터 시각화 영역</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 대회별 통계 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">대회별 통계</h3>
              <Button variant="outline" size="sm" leftIcon={<BarChart3 className="w-4 h-4" />}>
                전체보기
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      대회명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      참가자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      수익
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      성과
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tournamentStats.map((tournament, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {tournament.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {tournament.participants}명
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {tournament.revenue.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(tournament.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(100, (tournament.participants / 144) * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {Math.round((tournament.participants / 144) * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* 추가 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">스폰서십 수익</p>
                  <p className="text-xl font-bold text-green-600">
                    {reportData?.sponsorshipRevenue.toLocaleString()}원
                  </p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">포인트 거래</p>
                  <p className="text-xl font-bold text-blue-600">
                    {reportData?.pointTransactions.toLocaleString()}건
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">성장률</p>
                  <p className="text-xl font-bold text-purple-600">
                    +{reportData?.growthRate}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
