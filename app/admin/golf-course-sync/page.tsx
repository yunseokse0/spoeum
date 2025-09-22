'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  RefreshCw, 
  Database, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Upload,
  Settings,
  Activity,
  Globe,
  MapPin,
  Phone,
  Building
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface SyncStats {
  totalCourses: number;
  newCourses: number;
  lastSyncTime: Date | null;
  isSyncing: boolean;
  activeCourses: number;
}

interface GolfCourse {
  id: string;
  name: string;
  region: string;
  city: string;
  code: string;
  address: string;
  phone?: string;
  website?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function GolfCourseSyncPage() {
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [golfCourses, setGolfCourses] = useState<GolfCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStats();
    loadGolfCourses();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/golf-courses/sync?stats=true');
      if (response.success && response.stats) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('통계 로드 오류:', error);
    }
  };

  const loadGolfCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/golf-courses/sync');
      if (response.success && response.data) {
        setGolfCourses(response.data);
      }
    } catch (error) {
      console.error('골프장 목록 로드 오류:', error);
      toast.error('골프장 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      toast.loading('골프장 목록을 동기화하고 있습니다...', { id: 'sync' });
      
      const response = await api.post('/golf-courses/sync');
      
      if (response.success) {
        toast.success(`동기화 완료! ${response.data.newCourses}개 새로 추가`, { id: 'sync' });
        await loadStats();
        await loadGolfCourses();
      } else {
        toast.error(response.error || '동기화에 실패했습니다.', { id: 'sync' });
      }
    } catch (error) {
      console.error('동기화 오류:', error);
      toast.error('동기화 중 오류가 발생했습니다.', { id: 'sync' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(golfCourses, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `golf-courses-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('골프장 목록이 내보내기되었습니다.');
    } catch (error) {
      console.error('내보내기 오류:', error);
      toast.error('내보내기 중 오류가 발생했습니다.');
    }
  };

  const filteredCourses = golfCourses.filter(course => {
    const matchesRegion = selectedRegion === 'all' || course.region === selectedRegion;
    const matchesSearch = searchQuery === '' || 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRegion && matchesSearch;
  });

  const regions = Array.from(new Set(golfCourses.map(course => course.region))).sort();

  const formatDate = (date: Date | null) => {
    if (!date) return '동기화 이력 없음';
    return new Date(date).toLocaleString('ko-KR');
  };

  const getSyncStatus = () => {
    if (isSyncing) return { text: '동기화 중...', color: 'warning', icon: Activity };
    if (!stats?.lastSyncTime) return { text: '동기화 필요', color: 'error', icon: AlertCircle };
    return { text: '동기화 완료', color: 'success', icon: CheckCircle };
  };

  const syncStatus = getSyncStatus();
  const StatusIcon = syncStatus.icon;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                골프장 목록 관리
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                골프장 정보를 자동으로 수집하고 관리합니다
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleExport}
                leftIcon={<Download className="h-4 w-4" />}
                disabled={isLoading}
              >
                내보내기
              </Button>
              <Button
                onClick={handleSync}
                loading={isSyncing}
                disabled={isSyncing}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSyncing ? '동기화 중...' : '동기화 실행'}
              </Button>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 골프장</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalCourses || 0}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">활성 골프장</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.activeCourses || 0}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Upload className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">최근 추가</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.newCourses || 0}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${
                  syncStatus.color === 'success' ? 'bg-green-100 dark:bg-green-900' :
                  syncStatus.color === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                  'bg-red-100 dark:bg-red-900'
                }`}>
                  <StatusIcon className={`w-6 h-6 ${
                    syncStatus.color === 'success' ? 'text-green-600' :
                    syncStatus.color === 'warning' ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">동기화 상태</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {syncStatus.text}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 마지막 동기화 정보 */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                마지막 동기화: {formatDate(stats?.lastSyncTime)}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* 검색 및 필터 */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="골프장 이름, 지역으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedRegion === 'all' ? 'primary' : 'outline'}
                  onClick={() => setSelectedRegion('all')}
                  size="sm"
                >
                  전체
                </Button>
                {regions.map(region => (
                  <Button
                    key={region}
                    variant={selectedRegion === region ? 'primary' : 'outline'}
                    onClick={() => setSelectedRegion(region)}
                    size="sm"
                  >
                    {region}
                  </Button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 골프장 목록 */}
        <div className="space-y-4">
          {filteredCourses.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery || selectedRegion !== 'all' 
                    ? '검색 조건에 맞는 골프장이 없습니다.'
                    : '골프장 목록이 없습니다. 동기화를 실행해주세요.'
                  }
                </p>
              </CardBody>
            </Card>
          ) : (
            filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {course.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {course.code}
                        </Badge>
                        {course.isActive && (
                          <Badge variant="success" className="text-xs">
                            활성
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-2" />
                            {course.region} {course.city}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Building className="w-4 h-4 mr-2" />
                            {course.address}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {course.phone && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4 mr-2" />
                              {course.phone}
                            </div>
                          )}
                          {course.website && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Globe className="w-4 h-4 mr-2" />
                              <a 
                                href={course.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                웹사이트
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                        <span>생성: {new Date(course.createdAt).toLocaleDateString()}</span>
                        <span className="ml-4">수정: {new Date(course.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* 페이지네이션 정보 */}
        {filteredCourses.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              총 {filteredCourses.length}개 골프장 표시 중
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
