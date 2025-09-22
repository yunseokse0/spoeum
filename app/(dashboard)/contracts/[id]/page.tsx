'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Contract, ContractType } from '@/types';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Calendar, 
  DollarSign, 
  MapPin, 
  Clock,
  Trophy,
  FileText,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { ContractCancellationModal } from '@/components/ui/ContractCancellationModal';

// 새로운 Contract 타입에 맞는 mock 데이터
const mockContract: Contract = {
  id: '1',
  tourProId: 'user1',
  caddyId: 'user2',
  type: 'tournament',
  status: 'active',
  terms: {
    baseSalary: 800000,
    tournamentCount: 1,
    winBonus: { percentage: 10, minAmount: 100000, maxAmount: 1000000 },
    tournamentBonus: { first: 1000000, second: 500000, third: 300000, top10: 100000, participation: 50000 },
    expenses: {
      domestic: { transportation: true, accommodation: true, meals: true },
      jeju: { transportation: true, accommodation: true, meals: true },
      overseas: { transportation: true, accommodation: true, meals: true, visa: true }
    },
    contractConditions: { duration: 1, penaltyRate: 20, terminationNoticePeriod: 7 }
  },
  startDate: new Date('2024-03-15'),
  endDate: new Date('2024-03-17'),
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-10'),
};

export default function ContractDetailPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const contractId = params.id as string;
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/contracts';
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    loadContract(contractId);
  }, [isAuthenticated, router, contractId]);

  const loadContract = async (id: string) => {
    try {
      setIsLoading(true);
      // TODO: API 호출로 실제 계약 정보 가져오기
      // const response = await api.getContract(id);
      // setContract(response.data);
      
      // Mock 데이터 사용
      setContract(mockContract);
    } catch (error) {
      console.error('계약 정보 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canCancelContract = () => {
    if (!contract || !user) return false;
    
    // 계약 당사자만 파기할 수 있음
    return contract.tourProId === user.id || 
           contract.caddyId === user.id || 
           contract.amateurId === user.id || 
           contract.sponsorId === user.id;
  };

  const handleCancellationSuccess = (contractId: string) => {
    // 계약 정보 새로고침
    loadContract(contractId);
    setShowCancellationModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '진행중';
      case 'pending':
        return '대기중';
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: ContractType) => {
    switch (type) {
      case 'tournament':
        return '대회 계약';
      case 'annual':
        return '연간 계약';
      case 'training':
        return '훈련 계약';
      case 'sponsorship':
        return '스폰서십';
      default:
        return type;
    }
  };

  const getTypeIcon = (type: ContractType) => {
    switch (type) {
      case 'tournament':
        return <Trophy className="h-5 w-5" />;
      case 'annual':
        return <Calendar className="h-5 w-5" />;
      case 'training':
        return <FileText className="h-5 w-5" />;
      case 'sponsorship':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">계약 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            계약을 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            요청하신 계약 정보가 존재하지 않습니다.
          </p>
          <Button onClick={() => router.push('/contracts')}>
            계약 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-green-50 via-white to-golf-sky-50 dark:from-golf-dark-900 dark:via-golf-dark-800 dark:to-golf-dark-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="계약 상세" 
        showBackButton={true}
        showNotificationButton={true}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6 space-y-4">
        {/* 계약 기본 정보 */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-golf-green-600">
                  {getTypeIcon(contract.type)}
                </div>
                <div>
                  <CardTitle className="text-xl">{getTypeLabel(contract.type)}</CardTitle>
                  <p className="text-sm text-gray-500">#{contract.id}</p>
                </div>
              </div>
              <Badge variant={getStatusColor(contract.status)}>
                {getStatusLabel(contract.status)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">계약 기간</p>
                  <p className="font-medium">{formatDate(contract.startDate)} ~ {formatDate(contract.endDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">기본 급여</p>
                  <p className="font-medium">{formatCurrency(contract.terms.baseSalary)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">대회 건수</p>
                  <p className="font-medium">{contract.terms.tournamentCount}개</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">계약 기간</p>
                  <p className="font-medium">{contract.terms.contractConditions.duration}개월</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 보수 정보 */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-golf-green-600" />
              보수 정보
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600">기본 급여</span>
                <span className="font-semibold">{formatCurrency(contract.terms.baseSalary)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600">우승 보수</span>
                <span className="font-semibold">상금의 {contract.terms.winBonus.percentage}%</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">대회별 보수</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">1위</span>
                    <span>{formatCurrency(contract.terms.tournamentBonus.first)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">2위</span>
                    <span>{formatCurrency(contract.terms.tournamentBonus.second)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">3위</span>
                    <span>{formatCurrency(contract.terms.tournamentBonus.third)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Top 10</span>
                    <span>{formatCurrency(contract.terms.tournamentBonus.top10)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 비용 정보 */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-golf-green-600" />
              비용 포함 여부
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">국내 대회</h4>
                <div className="flex flex-wrap gap-2">
                  {contract.terms.expenses.domestic.transportation && (
                    <Badge variant="secondary">교통비</Badge>
                  )}
                  {contract.terms.expenses.domestic.accommodation && (
                    <Badge variant="secondary">숙박비</Badge>
                  )}
                  {contract.terms.expenses.domestic.meals && (
                    <Badge variant="secondary">식비</Badge>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">제주 대회</h4>
                <div className="flex flex-wrap gap-2">
                  {contract.terms.expenses.jeju.transportation && (
                    <Badge variant="secondary">항공료</Badge>
                  )}
                  {contract.terms.expenses.jeju.accommodation && (
                    <Badge variant="secondary">숙박비</Badge>
                  )}
                  {contract.terms.expenses.jeju.meals && (
                    <Badge variant="secondary">식비</Badge>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">해외 대회</h4>
                <div className="flex flex-wrap gap-2">
                  {contract.terms.expenses.overseas.transportation && (
                    <Badge variant="secondary">항공료</Badge>
                  )}
                  {contract.terms.expenses.overseas.accommodation && (
                    <Badge variant="secondary">숙박비</Badge>
                  )}
                  {contract.terms.expenses.overseas.meals && (
                    <Badge variant="secondary">식비</Badge>
                  )}
                  {contract.terms.expenses.overseas.visa && (
                    <Badge variant="secondary">비자비</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 계약 조건 */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-golf-green-600" />
              계약 조건
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">위약금 비율</span>
              <span className="font-semibold">{contract.terms.contractConditions.penaltyRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">해지 통보 기간</span>
              <span className="font-semibold">{contract.terms.contractConditions.terminationNoticePeriod}일</span>
            </div>
          </CardContent>
        </Card>

        {/* 계약 파기 내역 */}
        {contract.cancellation && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                계약 파기 내역
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">파기 주체</span>
                <span className="font-semibold">{contract.cancellation.whoCancelled}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">파기 사유</span>
                <span className="font-semibold">{contract.cancellation.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">위약금</span>
                <span className="font-semibold">{formatCurrency(contract.cancellation.penaltyAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">수령인</span>
                <span className="font-semibold">{contract.cancellation.beneficiary}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 액션 버튼 */}
        {contract.status === 'active' && canCancelContract() && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/contracts')}
              className="flex-1"
            >
              목록으로
            </Button>
            <Button
              variant="error"
              onClick={() => setShowCancellationModal(true)}
              className="flex-1"
            >
              계약 파기
            </Button>
          </div>
        )}

        {contract.status !== 'active' && (
          <Button
            variant="outline"
            onClick={() => router.push('/contracts')}
            className="w-full"
          >
            목록으로 돌아가기
          </Button>
        )}
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />

      {/* 계약 파기 모달 */}
      {showCancellationModal && contract && (
        <ContractCancellationModal
          isOpen={showCancellationModal}
          contract={contract}
          userType="golfer"
          onCancellationSuccess={handleCancellationSuccess}
          onClose={() => setShowCancellationModal(false)}
        />
      )}
    </div>
  );
}