'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Database, 
  Download, 
  Upload,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Users
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface SeedDataStatus {
  golfCourses: {
    exists: boolean;
    count: number;
    path: string;
  };
  players: {
    exists: boolean;
    count: number;
    path: string;
  };
}

export default function AdminSeedDataPage() {
  const [status, setStatus] = useState<SeedDataStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const { user: currentUser, isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
      router.push('/admin/login');
      return;
    }

    fetchSeedDataStatus();
  }, [currentUser, router]);

  const fetchSeedDataStatus = async () => {
    try {
      const response = await api.get('/admin/seed-data');
      if (response.success && response.data) {
        setStatus(response.data);
      } else {
        toast.error(response.error || '시드 데이터 상태 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to fetch seed data status:', error);
      toast.error('시드 데이터 상태 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedData = async (dataType: 'golf-courses' | 'players' | 'all') => {
    setIsSeeding(true);
    try {
      const response = await api.post('/admin/seed-data', { dataType });
      if (response.success) {
        toast.success(response.message || '데이터 초기화가 완료되었습니다.');
        fetchSeedDataStatus(); // 상태 새로고침
      } else {
        toast.error(response.error || '데이터 초기화에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to seed data:', error);
      toast.error('데이터 초기화 중 오류가 발생했습니다.');
    } finally {
      setIsSeeding(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p>시드 데이터 상태 로딩 중...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">시드 데이터 관리</h1>
          <Button
            onClick={fetchSeedDataStatus}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 골프장 데이터 */}
          <Card className="shadow-lg">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Database className="h-6 w-6 mr-2 text-blue-500" /> 골프장 데이터
                </h2>
                {status?.golfCourses.exists ? (
                  <Badge variant="success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    준비완료
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <XCircle className="h-3 w-3 mr-1" />
                    미준비
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">데이터 개수</span>
                  <span className="font-medium">{status?.golfCourses.count || 0}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">파일 경로</span>
                  <span className="text-xs text-gray-500 font-mono">
                    {status?.golfCourses.path || 'N/A'}
                  </span>
                </div>
                <div className="pt-4">
                  <Button
                    onClick={() => handleSeedData('golf-courses')}
                    disabled={isSeeding}
                    className="w-full"
                    variant={status?.golfCourses.exists ? 'outline' : 'primary'}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {status?.golfCourses.exists ? '데이터 재초기화' : '골프장 데이터 초기화'}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 투어프로 선수 데이터 */}
          <Card className="shadow-lg">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Users className="h-6 w-6 mr-2 text-green-500" /> 투어프로 선수 데이터
                </h2>
                {status?.players.exists ? (
                  <Badge variant="success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    준비완료
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <XCircle className="h-3 w-3 mr-1" />
                    미준비
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">데이터 개수</span>
                  <span className="font-medium">{status?.players.count || 0}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">파일 경로</span>
                  <span className="text-xs text-gray-500 font-mono">
                    {status?.players.path || 'N/A'}
                  </span>
                </div>
                <div className="pt-4">
                  <Button
                    onClick={() => handleSeedData('players')}
                    disabled={isSeeding}
                    className="w-full"
                    variant={status?.players.exists ? 'outline' : 'primary'}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {status?.players.exists ? '데이터 재초기화' : '투어프로 데이터 초기화'}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 전체 초기화 */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <FileText className="h-6 w-6 mr-2 text-purple-500" /> 전체 데이터 초기화
            </h2>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                모든 시드 데이터를 한 번에 초기화합니다. 기존 데이터는 덮어씌워집니다.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">골프장 데이터</span>
                <span className="font-medium">{status?.golfCourses.count || 0}개</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">투어프로 데이터</span>
                <span className="font-medium">{status?.players.count || 0}개</span>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => handleSeedData('all')}
                  disabled={isSeeding}
                  className="w-full"
                  variant="primary"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isSeeding ? '초기화 중...' : '전체 데이터 초기화'}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 데이터 정보 */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">데이터 정보</h2>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">골프장 데이터</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• 전국 주요 골프장 정보 (20개)</li>
                  <li>• 골프장명, 지역, 주소, 연락처</li>
                  <li>• 캐디 매칭 및 소속 관리에 사용</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">투어프로 선수 데이터</h3>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• KLPGA/KPGA 정회원 정보 (10명)</li>
                  <li>• 선수 경력, 랭킹, 상금 정보</li>
                  <li>• 스폰서 매칭 및 투어프로 검증에 사용</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">주의사항</h3>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                  <li>• 시드 데이터 초기화는 기존 데이터를 덮어씁니다</li>
                  <li>• 운영 중인 서비스에서는 신중하게 진행하세요</li>
                  <li>• 초기화 후에는 애플리케이션을 재시작하는 것을 권장합니다</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
