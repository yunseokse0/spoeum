'use client';

import React from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  AlertTriangle, 
  User, 
  DollarSign, 
  Calendar, 
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { ContractCancellation } from '@/types';

interface ContractCancellationCardProps {
  cancellation: ContractCancellation;
  className?: string;
}

export function ContractCancellationCard({ cancellation, className }: ContractCancellationCardProps) {
  const getWhoCancelledLabel = (who: string) => {
    switch (who) {
      case 'golfer':
        return '골퍼';
      case 'caddy':
        return '캐디';
      case 'sponsor':
        return '스폰서';
      default:
        return who;
    }
  };

  const getBeneficiaryLabel = (beneficiary: string) => {
    switch (beneficiary) {
      case 'golfer':
        return '골퍼';
      case 'caddy':
        return '캐디';
      case 'sponsor':
        return '스폰서';
      default:
        return beneficiary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'blue';
      case 'completed':
        return 'success';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '처리 대기';
      case 'processing':
        return '처리 중';
      case 'completed':
        return '처리 완료';
      case 'failed':
        return '처리 실패';
      default:
        return status;
    }
  };

  return (
    <Card className={`border-red-200 dark:border-red-800 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
              계약 파기 내역
            </h3>
          </div>
          <Badge variant={getStatusColor(cancellation.status)}>
            {getStatusIcon(cancellation.status)}
            <span className="ml-1">{getStatusLabel(cancellation.status)}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* 파기 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">파기 주체</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {getWhoCancelledLabel(cancellation.whoCancelled)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">파기 일시</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(cancellation.date).toLocaleString('ko-KR')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">위약금 금액</p>
                <p className="font-bold text-red-600 dark:text-red-400">
                  {cancellation.penaltyAmount.toLocaleString()}원
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">위약금 수령자</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {getBeneficiaryLabel(cancellation.beneficiary)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 파기 사유 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">파기 사유</p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-gray-900 dark:text-white">
                  {cancellation.reason}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 위약금 상세 정보 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              위약금 상세 정보
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">위약금 비율:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    {cancellation.penaltyPercent}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">위약금 금액:</span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">
                    {cancellation.penaltyAmount.toLocaleString()}원
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">수령자:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    {getBeneficiaryLabel(cancellation.beneficiary)}
                  </span>
                </div>
                {cancellation.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700 dark:text-blue-300">결제 ID:</span>
                    <span className="font-mono text-xs text-blue-900 dark:text-blue-100">
                      {cancellation.paymentId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 추가 메모 */}
        {cancellation.notes && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">처리 메모</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {cancellation.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 상태별 안내 메시지 */}
        {cancellation.status === 'pending' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                위약금 처리가 대기 중입니다. 곧 처리될 예정입니다.
              </p>
            </div>
          </div>
        )}

        {cancellation.status === 'processing' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                위약금 결제가 진행 중입니다. 완료되면 알림을 드리겠습니다.
              </p>
            </div>
          </div>
        )}

        {cancellation.status === 'completed' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-800 dark:text-green-200">
                위약금 처리가 완료되었습니다. 관련 당사자에게 알림이 발송되었습니다.
              </p>
            </div>
          </div>
        )}

        {cancellation.status === 'failed' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-800 dark:text-red-200">
                위약금 처리에 실패했습니다. 고객센터로 문의해주세요.
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
