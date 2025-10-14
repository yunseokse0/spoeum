'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Trophy, 
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  association: string;
  start_date: string;
  end_date: string;
  location: string;
  prize_money: number;
  max_participants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
  created_at: string;
}

export default function TournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAssociation, setFilterAssociation] = useState<string>('all');

  // 대회 목록 로드
  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock 데이터 (실제로는 API 호출)
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          name: '2024 KLPGA 챔피언십',
          association: 'KLPGA',
          start_date: '2024-10-15',
          end_date: '2024-10-18',
          location: '여주 골프클럽',
          prize_money: 1000000000,
          max_participants: 144,
          status: 'completed',
          description: 'KLPGA 정규 투어 최종전',
          created_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: '2024 KPGA 투어 챔피언십',
          association: 'KPGA',
          start_date: '2024-11-20',
          end_date: '2024-11-23',
          location: '서울 골프클럽',
          prize_money: 1200000000,
          max_participants: 144,
          status: 'upcoming',
          description: 'KPGA 정규 투어 최종전',
          created_at: '2024-02-20T00:00:00Z'
        },
        {
          id: '3',
          name: '2025 KLPGA 시즌 오픈',
          association: 'KLPGA',
          start_date: '2025-03-15',
          end_date: '2025-03-18',
          location: '제주 골프클럽',
          prize_money: 800000000,
          max_participants: 120,
          status: 'upcoming',
          description: '2025년 시즌 첫 번째 대회',
          created_at: '2024-12-01T00:00:00Z'
        }
      ];
      
      setTournaments(mockTournaments);
    } catch (err) {
      setError('대회 목록을 불러오는 중 오류가 발생했습니다.');
      console.error('대회 목록 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터링된 대회 목록
  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tournament.status === filterStatus;
    const matchesAssociation = filterAssociation === 'all' || tournament.association === filterAssociation;
    
    return matchesSearch && matchesStatus && matchesAssociation;
  });

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ongoing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // 상태별 아이콘
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'ongoing': return <Clock className="h-4 w-4" />;
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // 통계 계산
  const stats = {
    total: tournaments.length,
    upcoming: tournaments.filter(t => t.status === 'upcoming').length,
    ongoing: tournaments.filter(t => t.status === 'ongoing').length,
    completed: tournaments.filter(t => t.status === 'completed').length,
    totalPrize: tournaments.reduce((sum, t) => sum + t.prize_money, 0)
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Trophy className="h-8 w-8 mr-3 text-yellow-500" />
              대회관리
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              골프 대회 등록, 수정 및 관리
            </p>
          </div>
          <Button
            onClick={() => {/* 대회 등록 모달 열기 */}}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            대회 등록
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">전체 대회</p>
                  <p className="text-2xl font-bold">{stats.total}개</p>
                </div>
                <Trophy className="h-8 w-8 text-blue-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">예정</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.upcoming}개</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">진행중</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.ongoing}개</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">완료</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}개</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">총 상금</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.totalPrize.toLocaleString()}원
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="대회명 또는 장소로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">전체 상태</option>
                  <option value="upcoming">예정</option>
                  <option value="ongoing">진행중</option>
                  <option value="completed">완료</option>
                  <option value="cancelled">취소</option>
                </select>
                <select
                  value={filterAssociation}
                  onChange={(e) => setFilterAssociation(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">전체 협회</option>
                  <option value="KLPGA">KLPGA</option>
                  <option value="KPGA">KPGA</option>
                </select>
                <Button
                  onClick={loadTournaments}
                  variant="outline"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  새로고침
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 오류 메시지 */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardBody className="p-4">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            </CardBody>
          </Card>
        )}

        {/* 대회 목록 */}
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                대회 목록 ({filteredTournaments.length}개)
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">대회 목록을 불러오는 중...</p>
              </div>
            ) : filteredTournaments.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">대회가 없습니다.</p>
                <p className="text-sm text-gray-500 mt-2">
                  "대회 등록" 버튼을 클릭하여 새 대회를 등록하세요.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">대회명</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">협회</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">일정</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">장소</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">상금</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">상태</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTournaments.map((tournament) => (
                      <tr key={tournament.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {tournament.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {tournament.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold dark:bg-blue-900 dark:text-blue-200">
                            {tournament.association}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <p className="text-gray-900 dark:text-white">
                              {new Date(tournament.start_date).toLocaleDateString('ko-KR')}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              ~ {new Date(tournament.end_date).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            {tournament.location}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {tournament.prize_money.toLocaleString()}원
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            최대 {tournament.max_participants}명
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tournament.status)}`}>
                            {getStatusIcon(tournament.status)}
                            <span className="ml-1">
                              {tournament.status === 'upcoming' ? '예정' :
                               tournament.status === 'ongoing' ? '진행중' :
                               tournament.status === 'completed' ? '완료' : '취소'}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {/* 대회 수정 */}}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                              onClick={() => {/* 대회 삭제 */}}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
