'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ContractCancellationModal } from '@/components/ui/ContractCancellationModal';
import { ContractCancellationCard } from '@/components/ui/ContractCancellationCard';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Contract } from '@/types';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadContract(params.id as string);
    }
  }, [params.id]);

  const loadContract = async (contractId: string) => {
    try {
      setIsLoading(true);
      const response = await api.getContract(contractId);
      
      if (response.success && response.data) {
        setContract(response.data);
      } else {
        toast.error('계약 정보를 불러오는데 실패했습니다.');
        router.push('/contracts');
      }
    } catch (error) {
      console.error('계약 로드 오류:', error);
      toast.error('계약 정보를 불러오는 중 오류가 발생했습니다.');
      router.push('/contracts');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'active':
        return '진행중';
      case 'completed':
        return '완료';
      case 'cancelled':
        return '파기됨';
      default:
        return status;
    }
  };

  const getUserType = (): 'golfer' | 'caddy' | 'sponsor' => {
    if (!user) return 'golfer';
    
    switch (user.userType) {
      case 'tour_pro':
      case 'amateur':
        return 'golfer';
      case 'caddy':
        return 'caddy';
      case 'sponsor':
        return 'sponsor';
      default:
        return 'golfer';
    }
  };

  const canCancelContract = () => {
    if (!contract || !user) return false;
    
    // 이미 파기된 계약은 파기할 수 없음
    if (contract.status === 'cancelled') return false;
    
    // 완료된 계약은 파기할 수 없음
    if (contract.status === 'completed') return false;
    
    // 계약 당사자만 파기할 수 있음
    return contract.requesterId === user.id || contract.providerId === user.id;
  };

  const handleCancellationSuccess = (contractId: string) => {
    // 계약 정보 새로고침
    loadContract(contractId);
    setShowCancellationModal(false);
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
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            계약을 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            요청하신 계약 정보가 존재하지 않거나 삭제되었습니다.
          </p>
          <Button onClick={() => router.push('/contracts')}>
            계약 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              뒤로가기
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {contract.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                계약 상세 정보
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant={getStatusColor(contract.status)}>
              {getStatusIcon(contract.status)}
              <span className="ml-1">{getStatusLabel(contract.status)}</span>
            </Badge>
            
            {canCancelContract() && (
              <Button
                variant="error"
                onClick={() => setShowCancellationModal(true)}
                leftIcon={<AlertTriangle className="w-4 h-4" />}
              >
                계약 파기
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* 계약 기본 정보 */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                계약 기본 정보
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">계약 기간</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(contract.startDate).toLocaleDateString('ko-KR')} ~ {new Date(contract.endDate).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">장소</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contract.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">계약 금액</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {contract.baseRate.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">계약 유형</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contract.type === 'tournament' ? '대회 계약' : '연간 계약'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">위약금 비율</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contract.penaltyRate || 20}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">계약 생성일</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(contract.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 계약 내용 */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                계약 내용
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">계약 설명</h3>
                  <p className="text-gray-700 dark:text-gray-300">{contract.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">계약 조건</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {contract.terms}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 계약 파기 내역 */}
          {contract.cancellation && (
            <ContractCancellationCard cancellation={contract.cancellation} />
          )}
        </div>

        {/* 계약 파기 모달 */}
        <ContractCancellationModal
          isOpen={showCancellationModal}
          onClose={() => setShowCancellationModal(false)}
          contract={contract}
          userType={getUserType()}
          onCancellationSuccess={handleCancellationSuccess}
        />
      </div>
    </div>
  );
}
