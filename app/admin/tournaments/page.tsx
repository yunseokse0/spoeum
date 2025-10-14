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
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'upcoming' | 'input'>('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedAssociation, setSelectedAssociation] = useState<'KLPGA' | 'KPGA'>('KLPGA');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [tournamentResults, setTournamentResults] = useState<any[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  
  // 데이터 입력 관련 상태
  const [tournamentName, setTournamentName] = useState('');
  const [rawResults, setRawResults] = useState('');
  const [parsedResults, setParsedResults] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  
  // 년도 옵션 생성
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  // 대회 목록 로드
  useEffect(() => {
    loadTournaments();
  }, [activeTab, selectedYear, selectedAssociation]);

  const loadTournaments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let apiUrl = '';
      let allTournaments: Tournament[] = [];

      if (activeTab === 'completed') {
        // 완료된 대회 (저장된 결과가 있는 대회)
        const res = await fetch('/api/admin/tournaments/results');
        const data = await res.json();
        if (data.success) {
          allTournaments = (data.data || []).map((tournament: any) => {
            const isValidDate = (dateStr: string) => {
              if (!dateStr) return false;
              const date = new Date(dateStr);
              return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
            };

            const startDate = isValidDate(tournament.start_date) ? tournament.start_date : `${selectedYear}-12-01`;
            const endDate = isValidDate(tournament.end_date) ? tournament.end_date : `${selectedYear}-12-04`;
            const golfCourse = tournament.golf_course || tournament.location || '미정';

            return {
              id: tournament.id,
              name: tournament.name,
              association: tournament.association,
              start_date: startDate,
              end_date: endDate,
              location: golfCourse,
              prize_money: parseInt(tournament.prize_money) || 0,
              max_participants: parseInt(tournament.max_participants) || 0,
              status: 'completed' as const,
              description: tournament.description || '',
              created_at: tournament.created_at
            };
          });
        }
      } else if (activeTab === 'upcoming') {
        // 예정된 대회
        const res = await fetch(`/api/admin/tournaments/upcoming?year=${selectedYear}&association=${selectedAssociation}`);
        const data = await res.json();
        if (data.success) {
          allTournaments = (data.data || []).map((tournament: any) => ({
            id: tournament.id,
            name: tournament.name,
            association: tournament.association,
            start_date: tournament.start_date,
            end_date: tournament.end_date,
            location: tournament.location || '미정',
            prize_money: tournament.prize_money || 0,
            max_participants: tournament.max_participants || 0,
            status: 'upcoming' as const,
            description: tournament.description || '',
            created_at: tournament.created_at
          }));
        }
      } else {
        // 전체 대회 (완료된 대회 + 예정된 대회)
        const [completedRes, upcomingRes] = await Promise.all([
          fetch('/api/admin/tournaments/results'),
          fetch(`/api/admin/tournaments/upcoming?year=${selectedYear}&association=${selectedAssociation}`)
        ]);

        const completedData = await completedRes.json();
        const upcomingData = await upcomingRes.json();

        const completedTournaments = (completedData.data || []).map((tournament: any) => {
          const isValidDate = (dateStr: string) => {
            if (!dateStr) return false;
            const date = new Date(dateStr);
            return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
          };

          const startDate = isValidDate(tournament.start_date) ? tournament.start_date : `${selectedYear}-12-01`;
          const endDate = isValidDate(tournament.end_date) ? tournament.end_date : `${selectedYear}-12-04`;
          const golfCourse = tournament.golf_course || tournament.location || '미정';

          return {
            id: tournament.id,
            name: tournament.name,
            association: tournament.association,
            start_date: startDate,
            end_date: endDate,
            location: golfCourse,
            prize_money: parseInt(tournament.prize_money) || 0,
            max_participants: parseInt(tournament.max_participants) || 0,
            status: 'completed' as const,
            description: tournament.description || '',
            created_at: tournament.created_at
          };
        });

        const upcomingTournaments = (upcomingData.data || []).map((tournament: any) => {
          // 날짜 검증
          const isValidDate = (dateStr: string) => {
            if (!dateStr) return false;
            const date = new Date(dateStr);
            return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
          };

          const startDate = isValidDate(tournament.start_date) ? tournament.start_date : `${selectedYear}-12-01`;
          const endDate = isValidDate(tournament.end_date) ? tournament.end_date : `${selectedYear}-12-04`;
          const golfCourse = tournament.golf_course || tournament.location || '미정';

          return {
            id: tournament.id,
            name: tournament.name,
            association: tournament.association,
            start_date: startDate,
            end_date: endDate,
            location: golfCourse,
            prize_money: parseInt(tournament.prize_money) || 0,
            max_participants: parseInt(tournament.max_participants) || 0,
            status: 'upcoming' as const,
            description: tournament.description || '',
            created_at: tournament.created_at
          };
        });

        allTournaments = [...completedTournaments, ...upcomingTournaments];
      }
      
      setTournaments(allTournaments);
    } catch (err) {
      setError('대회 목록을 불러오는 중 오류가 발생했습니다.');
      console.error('대회 목록 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gemini를 통한 대회 검색
  const handleSearchTournaments = async () => {
    setIsSearching(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tournaments/list?year=${selectedYear}&association=${selectedAssociation}`, {
        method: 'GET'
      });
      const data = await res.json();
      
      if (data.success) {
        const fetchedTournaments = (data.data || []).map((tournament: any) => {
          // 날짜 검증 및 수정
          const isValidDate = (dateStr: string) => {
            if (!dateStr) return false;
            const date = new Date(dateStr);
            return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
          };

          // 날짜가 유효하지 않으면 기본값 설정
          const startDate = isValidDate(tournament.start_date) ? tournament.start_date : `${selectedYear}-12-01`;
          const endDate = isValidDate(tournament.end_date) ? tournament.end_date : `${selectedYear}-12-04`;

          // 골프장 정보 처리
          const golfCourse = tournament.golf_course || tournament.location || '미정';
          const location = tournament.location || '미정';

          return {
            id: tournament.id,
            name: tournament.name,
            association: tournament.association,
            start_date: startDate,
            end_date: endDate,
            location: golfCourse, // 골프장 이름을 location으로 사용
            prize_money: parseInt(tournament.prize_money) || 0,
            max_participants: parseInt(tournament.max_participants) || 0,
            status: 'upcoming' as const,
            description: tournament.description || '',
            created_at: new Date().toISOString()
          };
        });
        
        // 기존 대회와 합치기 (중복 제거)
        const existingIds = tournaments.map((t: Tournament) => t.id);
        const newTournaments = fetchedTournaments.filter((t: any) => !existingIds.includes(t.id));
        setTournaments(prev => [...prev, ...newTournaments]);
        
        alert(`✅ ${newTournaments.length}개의 새 대회를 검색했습니다.`);
      } else {
        setError(data.error || '대회 검색에 실패했습니다.');
      }
    } catch (err) {
      setError('대회 검색 중 오류가 발생했습니다.');
      console.error('대회 검색 실패:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Gemini를 통한 데이터 파싱
  const handleParseResults = async () => {
    if (!tournamentName.trim() || !rawResults.trim()) {
      setParseError('대회명과 결과 데이터를 입력해주세요.');
      return;
    }

    setIsParsing(true);
    setParseError(null);
    setParseSuccess(null);

    try {
      const res = await fetch('/api/gemini/tournament-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentName: tournamentName.trim(),
          rawResults: rawResults.trim()
        })
      });

      const data = await res.json();

      if (data.success) {
        setParsedResults(data.results || []);
        setParseSuccess(`${data.results?.length || 0}개의 결과가 성공적으로 파싱되었습니다!`);
      } else {
        setParseError(data.error || '데이터 파싱에 실패했습니다.');
      }
    } catch (err) {
      setParseError('데이터 파싱 중 오류가 발생했습니다.');
      console.error('데이터 파싱 실패:', err);
    } finally {
      setIsParsing(false);
    }
  };

  // 데이터베이스에 저장
  const handleSaveResults = async () => {
    if (parsedResults.length === 0) {
      setParseError('저장할 결과가 없습니다.');
      return;
    }

    try {
      const res = await fetch('/api/admin/tournaments/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournament_name: tournamentName.trim(),
          results: parsedResults
        })
      });

      const data = await res.json();

      if (data.success) {
        setParseSuccess(`✅ ${data.savedCount}개의 결과가 데이터베이스에 저장되었습니다.`);
        // 폼 초기화
        setTournamentName('');
        setRawResults('');
        setParsedResults([]);
        // 대회 목록 새로고침
        loadTournaments();
      } else {
        setParseError(data.error || '데이터 저장에 실패했습니다.');
      }
    } catch (err) {
      setParseError('데이터 저장 중 오류가 발생했습니다.');
      console.error('데이터 저장 실패:', err);
    }
  };

  // 대회 결과 조회 (Gemini API 사용)
  const handleViewTournamentResults = async (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsLoadingResults(true);
    setError(null);

    try {
      // Gemini API를 통해 개별 대회 결과 가져오기
      const res = await fetch('/api/admin/tournaments/results-individual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentName: tournament.name,
          tournamentId: tournament.id
        })
      });
      const data = await res.json();

      if (data.success) {
        setTournamentResults(data.data || []);
      } else {
        setError(data.error || '대회 결과를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('대회 결과 조회 중 오류가 발생했습니다.');
      console.error('대회 결과 조회 실패:', err);
    } finally {
      setIsLoadingResults(false);
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
          <div className="flex gap-3">
            <Button
              onClick={() => {/* 대회 등록 모달 열기 */}}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              대회 등록
            </Button>
          </div>
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

        {/* 탭 선택 */}
        <Card>
          <CardBody className="p-6">
            <div className="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                전체 대회
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                완료된 대회
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                예정된 대회
              </button>
              <button
                onClick={() => setActiveTab('input')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'input'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                데이터 입력
              </button>
            </div>

            {/* 년도/협회 선택 (예정된 대회 또는 전체 대회일 때) */}
            {(activeTab === 'upcoming' || activeTab === 'all') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    년도 선택
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    협회 선택
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="association"
                        value="KLPGA"
                        checked={selectedAssociation === 'KLPGA'}
                        onChange={(e) => setSelectedAssociation(e.target.value as 'KLPGA')}
                        className="w-4 h-4 text-blue-600"
                        disabled={isLoading}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        KLPGA (여자)
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="association"
                        value="KPGA"
                        checked={selectedAssociation === 'KPGA'}
                        onChange={(e) => setSelectedAssociation(e.target.value as 'KPGA')}
                        className="w-4 h-4 text-blue-600"
                        disabled={isLoading}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        KPGA (남자)
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSearchTournaments}
                    disabled={isSearching}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Gemini 검색 중...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        대회 검색
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* 데이터 입력 탭 */}
            {activeTab === 'input' && (
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      대회명 *
                    </label>
                    <input
                      type="text"
                      value={tournamentName}
                      onChange={(e) => setTournamentName(e.target.value)}
                      placeholder="예: 2024 KLPGA 챔피언십"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      disabled={isParsing}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleParseResults}
                      disabled={isParsing || !tournamentName.trim() || !rawResults.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isParsing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          파싱 중...
                        </>
                      ) : (
                        <>
                          <Trophy className="w-4 h-4 mr-2" />
                          데이터 검증하기
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    대회 결과 데이터 *
                  </label>
                  <textarea
                    value={rawResults}
                    onChange={(e) => setRawResults(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    rows={8}
                    placeholder={`대회 결과를 붙여넣으세요, 예시:
1위 김효주 - 14언더파 (상금 2억원)
2위 박민지 - 12언더파 (상금 1억2천만원)
3위 이정은 - 10언더파 (상금 8천만원)
...`}
                    disabled={isParsing}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    ℹ️ 순위, 선수명, 스코어, 상금 정보가 포함된 텍스트 형식의 데이터를 입력하세요.
                  </p>
                </div>
              </div>
            )}

            {/* 검색 및 필터 */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="대회명 또는 장소로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
        {(error || parseError) && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardBody className="p-4">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error || parseError}
              </div>
            </CardBody>
          </Card>
        )}

        {/* 성공 메시지 */}
        {parseSuccess && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardBody className="p-4">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5 mr-2" />
                {parseSuccess}
              </div>
            </CardBody>
          </Card>
        )}

        {/* 파싱 결과 테이블 */}
        {parsedResults.length > 0 && (
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-blue-500" />
                  파싱 결과 ({parsedResults.length}개)
                </h2>
                <Button
                  onClick={handleSaveResults}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  데이터베이스에 저장
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">순위</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">선수명</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">스코어</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">상금</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {parsedResults.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 text-sm font-medium">{result.rank}위</td>
                        <td className="px-4 py-3 text-sm">{result.player_name}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          {result.score > 0 ? `+${result.score}` : result.score}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {result.prize_amount.toLocaleString()}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}

        {/* 대회 목록 */}
        {activeTab !== 'input' && (
          <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                대회 목록 ({filteredTournaments.length}개)
              </h2>
            </div>

            {/* 대회 목록 탭 */}
            <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                완료된 대회
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                예정된 대회
              </button>
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
                          <div 
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2"
                            onClick={() => handleViewTournamentResults(tournament)}
                          >
                            <p className="font-medium text-gray-900 dark:text-white">
                              {tournament.name}
                              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                                (클릭하여 결과 보기)
                              </span>
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
        )}

        {/* 대회 결과 섹션 */}
        {selectedTournament && tournamentResults.length > 0 && (
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  {selectedTournament.name} - 대회 결과
                </h2>
                <Button
                  onClick={() => {
                    setSelectedTournament(null);
                    setTournamentResults([]);
                  }}
                  variant="outline"
                  size="sm"
                >
                  닫기
                </Button>
              </div>

              {isLoadingResults ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">결과를 불러오는 중...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-center text-sm font-semibold">순위</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">선수명</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">스코어</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">상금</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {tournamentResults.slice(0, 30).map((result, index) => (
                        <tr key={result.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                              result.rank === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              result.rank === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
                              result.rank === 3 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {result.rank}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                            {result.player_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <span className={`font-medium ${
                              result.score < 0 ? 'text-green-600 dark:text-green-400' : 
                              result.score > 0 ? 'text-red-600 dark:text-red-400' : 
                              'text-gray-600 dark:text-gray-400'
                            }`}>
                              {result.score > 0 ? `+${result.score}` : result.score}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                            {result.prize_amount ? result.prize_amount.toLocaleString() : '-'}원
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {tournamentResults.length > 30 && (
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      상위 30위까지만 표시됩니다. (총 {tournamentResults.length}명 참가)
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
