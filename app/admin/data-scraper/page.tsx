'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

interface ScrapedData {
  tournaments?: {
    klpga: any[];
    kpga: any[];
    all: any[];
    count: number;
    total: number;
    pagination: any;
  };
  golfCourses?: {
    courses: any[];
    count: number;
    total: number;
    regions: Record<string, number>;
    sources: Record<string, number>;
    pagination: any;
  };
  players?: {
    players: any[];
    count: number;
    total: number;
    errors: string[];
    associations: string[];
    pagination: any;
  };
}

interface ScrapingStats {
  totalTime: number;
  errors: Array<{
    type: string;
    error: string;
  }>;
}

export default function DataScraperPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData>({});
  const [storedData, setStoredData] = useState<any>(null);
  const [scrapingStats, setScrapingStats] = useState<ScrapingStats | null>(null);
  const [selectedDataType, setSelectedDataType] = useState<string>('all');
  const [selectedView, setSelectedView] = useState<string>('summary');
  const [dataSource, setDataSource] = useState<'live' | 'stored'>('stored'); // live: 실시간 크롤링, stored: 저장된 데이터
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0
  });

  // URL 파라미터 처리
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get('type');
      if (type && ['all', 'tournaments', 'golf-courses', 'players'].includes(type)) {
        setSelectedDataType(type);
      }
    }
  }, []);

  // 전체 데이터 크롤링 실행
  const handleScrapeAll = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/data/scrape-all?type=${selectedDataType}&mock=false`);
      const result = await response.json();
      
      if (result.success) {
        setScrapedData(result.data);
        setScrapingStats(result.stats);
        
        // 실제 데이터인지 Mock 데이터인지 확인
        const hasRealData = result.data && Object.values(result.data).some((data: any) => data && !data.isMock);
        if (hasRealData) {
          alert(`${selectedDataType} 실제 데이터 크롤링이 완료되었습니다!`);
        } else {
          alert(`${selectedDataType} Mock 데이터를 사용합니다. (실제 크롤링 실패)`);
        }
      } else {
        alert(`크롤링 실패: ${result.error}`);
      }
    } catch (error) {
      console.error('크롤링 오류:', error);
      alert('크롤링 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 저장된 데이터 로드
  const loadStoredData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/data/stored?type=${selectedDataType}&metadata=true`);
      const data = await response.json();
      
      if (data.success) {
        setStoredData(data.data);
        setLastUpdated(data.metadata?.lastUpdated || null);
        
        // 페이지네이션 초기화
        setPagination(prev => ({
          ...prev,
          total: data.data.tournaments?.all?.length || 
                 data.data.golfCourses?.courses?.length || 
                 data.data.players?.all?.length || 0
        }));
      } else {
        alert(`저장된 데이터 로드 실패: ${data.message}`);
      }
    } catch (error: any) {
      console.error('데이터 로드 오류:', error);
      alert(`데이터 로드 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 크롤링된 데이터 조회
  const handleViewData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/data/view?type=${selectedDataType}&limit=${pagination.limit}&offset=${pagination.offset}&mock=false`
      );
      const result = await response.json();
      
      if (result.success) {
        setScrapedData(result.data || {}); // Ensure scrapedData is always an object
        if (result.pagination) {
          setPagination(result.pagination);
        }
        
        // 실제 데이터인지 Mock 데이터인지 확인
        const hasRealData = result.data && Object.values(result.data).some((data: any) => data && !data.isMock);
        if (hasRealData) {
          console.log('실제 데이터 조회 성공');
        } else {
          console.log('Mock 데이터 사용 중 (실제 크롤링 실패)');
        }
      } else {
        console.error('데이터 조회 실패:', result.error);
        setScrapedData({}); // Set empty object on error
        alert(`데이터 조회 실패: ${result.error}`);
      }
    } catch (error) {
      console.error('데이터 조회 오류:', error);
      setScrapedData({}); // Set empty object on error
      alert('데이터 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 모달에서 상세 데이터 보기
  const handleViewDetails = (data: any, type: string) => {
    setModalData({ ...data, type });
    setShowModal(true);
  };

  // 페이지네이션 핸들러
  const handlePagination = (direction: 'prev' | 'next') => {
    const newOffset = direction === 'next' 
      ? pagination.offset + pagination.limit
      : Math.max(0, pagination.offset - pagination.limit);
    
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  // 페이지 로드 시 자동 데이터 조회 비활성화
  // useEffect(() => {
  //   handleViewData();
  // }, [selectedDataType, pagination.offset, pagination.limit]);

  // 에러 바운더리
  if (typeof window !== 'undefined' && !window.location) {
    return <div className="p-8 text-center">페이지를 로딩 중입니다...</div>;
  }

  const renderSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 대회 정보 */}
      {scrapedData && scrapedData.tournaments && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">대회 정보</h3>
            <Badge variant="blue">{scrapedData.tournaments.count}개</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">KLPGA:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{scrapedData.tournaments.klpga?.length || 0}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">KPGA:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{scrapedData.tournaments.kpga?.length || 0}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">총 대회:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{scrapedData.tournaments.total || 0}개</span>
            </div>
          </div>
          <Button 
            className="w-full mt-4" 
            onClick={() => handleViewDetails(scrapedData.tournaments, 'tournaments')}
          >
            상세 보기
          </Button>
        </Card>
      )}

      {/* 골프장 정보 */}
      {scrapedData && scrapedData.golfCourses && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">골프장 정보</h3>
            <Badge variant="green">{scrapedData.golfCourses.count}개</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">총 골프장:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{scrapedData.golfCourses.total || 0}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">지역 수:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{Object.keys(scrapedData.golfCourses.regions || {}).length}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">소스 수:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{Object.keys(scrapedData.golfCourses.sources || {}).length}개</span>
            </div>
          </div>
          <Button 
            className="w-full mt-4" 
            onClick={() => handleViewDetails(scrapedData.golfCourses, 'golf-courses')}
          >
            상세 보기
          </Button>
        </Card>
      )}

      {/* 선수 정보 */}
      {scrapedData && scrapedData.players && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">선수 정보</h3>
            <Badge variant="purple">{scrapedData.players.count}개</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">총 선수:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{scrapedData.players.total || 0}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">협회 수:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{scrapedData.players.associations?.length || 0}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">오류:</span>
              <span className="font-medium text-red-600 dark:text-red-400">{scrapedData.players.errors?.length || 0}개</span>
            </div>
          </div>
          <Button 
            className="w-full mt-4" 
            onClick={() => handleViewDetails(scrapedData.players, 'players')}
          >
            상세 보기
          </Button>
        </Card>
      )}
    </div>
  );

  const renderTable = () => {
    if (selectedDataType === 'tournaments' && scrapedData && scrapedData.tournaments) {
      const tournaments = scrapedData.tournaments.all || [];
      return (
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">이름</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">협회</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">카테고리</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">시작일</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">종료일</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">장소</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">상금</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((tournament: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{tournament?.name || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{tournament?.organizer || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{tournament?.category || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                    {tournament?.startDate ? new Date(tournament.startDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                    {tournament?.endDate ? new Date(tournament.endDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{tournament?.location || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{`${(tournament?.prizePool || 0).toLocaleString()}원`}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }

    if (selectedDataType === 'golf-courses' && scrapedData && scrapedData.golfCourses) {
      const courses = scrapedData.golfCourses.courses || [];
      return (
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">이름</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">지역</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">도시</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">주소</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">전화번호</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">소스</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{course?.name || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{course?.region || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{course?.city || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{course?.address || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{course?.phone || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{course?.source || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }

    if (selectedDataType === 'players' && scrapedData && scrapedData.players) {
      const players = scrapedData.players.players || [];
      return (
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">이름</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">협회</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">생년월일</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">현재 랭킹</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">총 상금</th>
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100">활성 상태</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{player?.name || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{player?.association || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{player?.birth || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{player?.currentRanking || '-'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{`${(player?.totalPrize || 0).toLocaleString()}원`}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{player?.isActive ? '활성' : '비활성'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }

    return <div className="text-center text-gray-500">데이터가 없습니다.</div>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">데이터 크롤링 관리</h1>
        <p className="text-gray-600">전체 데이터 크롤링 및 조회를 관리할 수 있습니다. (1년 2회 크롤링 최적화)</p>
      </div>

      {/* 데이터 소스 선택 */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-3">데이터 소스 선택</h2>
        <div className="flex gap-6 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="stored"
              checked={dataSource === 'stored'}
              onChange={(e) => setDataSource(e.target.value as 'stored')}
              className="mr-2"
            />
            <span>저장된 데이터 (권장)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="live"
              checked={dataSource === 'live'}
              onChange={(e) => setDataSource(e.target.value as 'live')}
              className="mr-2"
            />
            <span>실시간 크롤링</span>
          </label>
        </div>
        {lastUpdated && (
          <p className="text-sm text-gray-600">
            마지막 업데이트: {new Date(lastUpdated).toLocaleString('ko-KR')}
          </p>
        )}
      </Card>

      {/* 컨트롤 패널 */}
      <Card className="p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <label className="text-sm font-medium">데이터 타입:</label>
            <select 
              value={selectedDataType} 
              onChange={(e) => setSelectedDataType(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="all">전체</option>
              <option value="tournaments">대회 정보</option>
              <option value="golf-courses">골프장 정보</option>
              <option value="players">선수 정보</option>
            </select>
          </div>

          <div className="flex gap-2">
            <label className="text-sm font-medium">보기 방식:</label>
            <select 
              value={selectedView} 
              onChange={(e) => setSelectedView(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="summary">요약</option>
              <option value="table">테이블</option>
            </select>
          </div>

          {dataSource === 'stored' ? (
            <>
              <Button 
                onClick={loadStoredData}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? '로딩 중...' : '저장된 데이터 로드'}
              </Button>
              <Button 
                onClick={handleScrapeAll}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? '크롤링 중...' : '새로 크롤링'}
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleScrapeAll}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? '크롤링 중...' : '데이터 크롤링'}
              </Button>
              <Button 
                onClick={handleViewData}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? '조회 중...' : '데이터 조회'}
              </Button>
            </>
          )}
        </div>

        {/* 크롤링 통계 */}
        {scrapingStats && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h4 className="font-medium mb-2">크롤링 통계</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">실행 시간:</span>
                <span className="ml-2 font-medium">{scrapingStats.totalTime}ms</span>
              </div>
              <div>
                <span className="text-gray-600">오류 수:</span>
                <span className="ml-2 font-medium text-red-600">{scrapingStats.errors.length}개</span>
              </div>
            </div>
            {scrapingStats.errors.length > 0 && (
              <div className="mt-2">
                <span className="text-red-600 text-sm">오류 상세:</span>
                <ul className="text-xs text-red-600 ml-4">
                  {scrapingStats.errors.map((error, index) => (
                    <li key={index}>• {error.type}: {error.error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 데이터 표시 */}
      <div className="mb-8">
        {selectedView === 'summary' ? renderSummary() : renderTable()}
      </div>

      {/* 페이지네이션 */}
      {selectedView === 'table' && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} / {pagination.total}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => handlePagination('prev')}
              disabled={pagination.offset === 0}
              variant="outline"
              size="sm"
            >
              이전
            </Button>
            <Button 
              onClick={() => handlePagination('next')}
              disabled={pagination.offset + pagination.limit >= pagination.total}
              variant="outline"
              size="sm"
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {/* 상세 데이터 모달 */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalData?.type} 상세 정보`}
      >
        {modalData && (
          <div className="max-h-96 overflow-y-auto">
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded">
              {JSON.stringify(modalData, null, 2)}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  );
}
