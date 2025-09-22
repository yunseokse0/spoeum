'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Users, 
  Trophy,
  User,
  Building,
  TrendingUp,
  UserCheck,
  UserX,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface MemberStats {
  total: number;
  tourPro: number;
  amateur: number;
  caddy: number;
  sponsor: number;
  agency: number;
  active: number;
  pending: number;
}

export default function AdminMembersPage() {
  const [stats, setStats] = useState<MemberStats>({
    total: 0,
    tourPro: 0,
    amateur: 0,
    caddy: 0,
    sponsor: 0,
    agency: 0,
    active: 0,
    pending: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
      router.push('/admin/login');
      return;
    }

    fetchMemberStats();
  }, [currentUser, router]);

  const fetchMemberStats = async () => {
    try {
      const response = await api.get('/admin/members/stats');
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        // Mock 데이터 사용
        setStats({
          total: 1250,
          tourPro: 85,
          amateur: 420,
          caddy: 680,
          sponsor: 45,
          agency: 20,
          active: 980,
          pending: 35
        });
      }
    } catch (error) {
      console.error('Failed to fetch member stats:', error);
      // Mock 데이터 사용
      setStats({
        total: 1250,
        tourPro: 85,
        amateur: 420,
        caddy: 680,
        sponsor: 45,
        agency: 20,
        active: 980,
        pending: 35
      });
    } finally {
      setIsLoading(false);
    }
  };

  const memberTypes = [
    {
      type: 'tour_pro',
      title: '투어프로',
      icon: Trophy,
      count: stats.tourPro,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'KLPGA/KPGA 정회원',
      route: '/admin/members/pro'
    },
    {
      type: 'amateur',
      title: '아마추어',
      icon: User,
      count: stats.amateur,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '아마추어 골퍼',
      route: '/admin/members/amateur'
    },
    {
      type: 'caddy',
      title: '캐디',
      icon: TrendingUp,
      count: stats.caddy,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '전문 캐디',
      route: '/admin/members/caddy'
    },
    {
      type: 'sponsor',
      title: '스폰서',
      icon: Building,
      count: stats.sponsor,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: '기업 스폰서',
      route: '/admin/members/sponsor'
    },
    {
      type: 'agency',
      title: '에이전시',
      icon: Building,
      count: stats.agency,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: '에이전시',
      route: '/admin/members/agency'
    }
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p>회원 통계 로딩 중...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">회원 관리</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            총 {stats.total}명의 회원
          </div>
        </div>

        {/* 전체 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 회원</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">활성 회원</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">승인 대기</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <UserX className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">활성 비율</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 회원 타입별 관리 */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">회원 타입별 관리</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              각 회원 타입별로 상세 관리 기능을 제공합니다.
            </p>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberTypes.map((memberType) => {
                const IconComponent = memberType.icon;
                return (
                  <div
                    key={memberType.type}
                    className="group relative p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => router.push(memberType.route)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-3 rounded-lg ${memberType.bgColor} dark:bg-gray-800`}>
                            <IconComponent className={`h-6 w-6 ${memberType.color}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {memberType.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {memberType.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {memberType.count.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">명</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* 상태 배지 */}
                    <div className="absolute top-4 right-4">
                      <Badge 
                        variant={memberType.count > 0 ? 'success' : 'secondary'}
                        className="text-xs"
                      >
                        {memberType.count > 0 ? '활성' : '없음'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* 최근 활동 */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">최근 회원 활동</h2>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    새로운 투어프로 회원 가입
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">김투어프로님이 KLPGA 회원으로 가입했습니다.</p>
                </div>
                <span className="text-xs text-gray-500">2분 전</span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <UserX className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    캐디 회원 승인 대기
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">이캐디님이 새로운 골프장 소속을 요청했습니다.</p>
                </div>
                <span className="text-xs text-gray-500">15분 전</span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Building className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    스폰서 회원 검증 완료
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">ABC골프회사 사업자등록증이 승인되었습니다.</p>
                </div>
                <span className="text-xs text-gray-500">1시간 전</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}