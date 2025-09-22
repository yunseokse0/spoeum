'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  AlertTriangle, 
  X, 
  DollarSign, 
  User, 
  FileText,
  Calculator,
  AlertCircle
} from 'lucide-react';
import { Contract, ContractCancellationRequest } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ContractCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  userType: 'golfer' | 'caddy' | 'sponsor';
  onCancellationSuccess?: (contractId: string) => void;
}

const cancellationReasons = [
  '개인 사정으로 인한 불가피한 파기',
  '건강상의 이유',
  '일정 변경으로 인한 파기',
  '서비스 품질 문제',
  '경제적 사정',
  '기타 (직접 입력)'
];

export function ContractCancellationModal({
  isOpen,
  onClose,
  contract,
  userType,
  onCancellationSuccess
}: ContractCancellationModalProps) {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [penaltyPercent, setPenaltyPercent] = useState(contract.penaltyRate || 20);
  const [isLoading, setIsLoading] = useState(false);

  const finalReason = reason === '기타 (직접 입력)' ? customReason : reason;
  
  // 위약금 계산
  const penaltyAmount = Math.round(contract.terms.baseSalary * (penaltyPercent / 100));
  
  // 위약금 수령자 결정
  const getBeneficiary = (whoCancelled: string) => {
    switch (whoCancelled) {
      case 'golfer':
        return contract.caddyId ? '캐디' : (contract.sponsorId ? '스폰서' : '상대방');
      case 'caddy':
        return contract.tourProId ? '투어프로' : (contract.amateurId ? '아마추어' : '골퍼');
      case 'sponsor':
        return contract.tourProId ? '투어프로' : '골퍼';
      default:
        return '상대방';
    }
  };

  const getWhoCancelledLabel = () => {
    switch (userType) {
      case 'golfer':
        return '골퍼';
      case 'caddy':
        return '캐디';
      case 'sponsor':
        return '스폰서';
      default:
        return '사용자';
    }
  };

  const handleSubmit = async () => {
    if (!finalReason.trim()) {
      toast.error('파기 사유를 입력해주세요.');
      return;
    }

    if (penaltyPercent < 0 || penaltyPercent > 100) {
      toast.error('위약금 비율은 0%에서 100% 사이여야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      const request: ContractCancellationRequest = {
        contractId: contract.id,
        whoCancelled: userType,
        reason: finalReason,
        penaltyPercent
      };

      const response = await api.cancelContract(contract.id, finalReason);

      if (response.success) {
        toast.success('계약 파기 요청이 완료되었습니다.');
        onCancellationSuccess?.(contract.id);
        onClose();
        
        // 폼 초기화
        setReason('');
        setCustomReason('');
        setPenaltyPercent(contract.penaltyRate || 20);
      } else {
        toast.error(response.error || '계약 파기 처리 중 오류가 발생했습니다.');
      }
    } catch (error: any) {
      console.error('계약 파기 오류:', error);
      toast.error(error.message || '계약 파기 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason('');
      setCustomReason('');
      setPenaltyPercent(contract.penaltyRate || 20);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                계약 파기 요청
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                계약을 파기하시겠습니까?
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 계약 정보 */}
        <Card className="mb-6 border-orange-200 dark:border-orange-800">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              계약 정보
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">계약 타입:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {contract.type === 'tournament' ? '대회 계약' : 
                   contract.type === 'annual' ? '연간 계약' :
                   contract.type === 'training' ? '훈련 계약' :
                   contract.type === 'sponsorship' ? '스폰서십' : contract.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">계약 금액:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {contract.terms.baseSalary.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">계약 기간:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(contract.startDate).toLocaleDateString()} ~ {new Date(contract.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">위약금 비율:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {contract.penaltyRate || 20}%
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 파기 정보 */}
        <div className="space-y-6">
          {/* 파기 주체 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              파기 주체
            </label>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {getWhoCancelledLabel()}
              </span>
              <Badge variant="warning" className="ml-2">
                파기 요청자
              </Badge>
            </div>
          </div>

          {/* 파기 사유 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              파기 사유 <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {cancellationReasons.map((reasonOption) => (
                  <button
                    key={reasonOption}
                    type="button"
                    onClick={() => setReason(reasonOption)}
                    className={`p-3 text-left rounded-lg border-2 transition-colors ${
                      reason === reasonOption
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {reasonOption}
                  </button>
                ))}
              </div>
              
              {reason === '기타 (직접 입력)' && (
                <textarea
                  placeholder="파기 사유를 자세히 입력해주세요"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              )}
            </div>
          </div>

          {/* 위약금 비율 조정 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              위약금 비율 (%)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="100"
                value={penaltyPercent}
                onChange={(e) => setPenaltyPercent(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[60px]">
                {penaltyPercent}%
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              계약서에 명시된 기본 위약금 비율: {contract.penaltyRate || 20}%
            </p>
          </div>

          {/* 위약금 계산 결과 */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                위약금 계산 결과
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">계약 금액:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {contract.terms.baseSalary.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">위약금 비율:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {penaltyPercent}%
                  </span>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">위약금 금액:</span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    {penaltyAmount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">위약금 수령자:</span>
                  <Badge variant="success" className="text-sm">
                    {getBeneficiary(userType)}
                  </Badge>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 경고 메시지 */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">계약 파기 시 주의사항</p>
                <ul className="space-y-1 text-xs">
                  <li>• 계약 파기는 되돌릴 수 없습니다.</li>
                  <li>• 위약금은 즉시 처리되며, 관련 당사자에게 알림이 발송됩니다.</li>
                  <li>• 파기 사유는 계약서에 기록되며, 향후 계약 시 참고됩니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end space-x-3 mt-8">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            variant="error"
            onClick={handleSubmit}
            loading={isLoading}
            leftIcon={<AlertTriangle className="w-4 h-4" />}
          >
            {isLoading ? '처리 중...' : '계약 파기'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
