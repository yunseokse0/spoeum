import React from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Calendar, 
  DollarSign, 
  Trophy,
  Clock,
  Eye,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SponsorshipContract, ExposureItem } from '@/types';

interface ContractCardProps {
  contract: SponsorshipContract;
  onViewDetails?: () => void;
  onDownloadContract?: () => void;
  className?: string;
}

export function ContractCard({ 
  contract, 
  onViewDetails, 
  onDownloadContract,
  className 
}: ContractCardProps) {
  const getExposureItemIcon = (item: ExposureItem) => {
    switch (item) {
      case 'golf_bag':
        return '🎒';
      case 'hat':
        return '🧢';
      case 'shirt':
        return '👕';
      case 'pants':
        return '👖';
      default:
        return '📍';
    }
  };

  const getExposureItemLabel = (item: ExposureItem) => {
    switch (item) {
      case 'golf_bag':
        return '골프백';
      case 'hat':
        return '모자';
      case 'shirt':
        return '상의';
      case 'pants':
        return '하의';
      default:
        return item;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'blue';
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
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'refunded':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return '결제완료';
      case 'pending':
        return '결제대기';
      case 'refunded':
        return '환불완료';
      default:
        return status;
    }
  };

  const isActive = contract.status === 'active';
  const isCompleted = contract.status === 'completed';
  const isCancelled = contract.status === 'cancelled';

  return (
    <Card className={`
      transition-all duration-300 hover:shadow-lg
      ${isActive ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' : ''}
      ${isCompleted ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10' : ''}
      ${isCancelled ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : ''}
      ${className}
    `}>
      <CardBody className="p-5">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(contract.status)}
              <Badge variant={getStatusColor(contract.status)}>
                {getStatusLabel(contract.status)}
              </Badge>
              <Badge variant={getPaymentStatusColor(contract.paymentStatus)}>
                {getPaymentStatusLabel(contract.paymentStatus)}
              </Badge>
              {contract.isTournamentBased && (
                <Badge variant="outline" className="text-xs">
                  <Trophy className="w-3 h-3 mr-1" />
                  대회 기반
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* 노출 부위 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            노출 부위
          </h4>
          <div className="flex flex-wrap gap-2">
            {contract.exposureItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
              >
                <span>{getExposureItemIcon(item)}</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {getExposureItemLabel(item)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 계약 정보 */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDate(contract.startDate)} ~ {formatDate(contract.endDate)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="font-semibold text-lg text-gray-900 dark:text-white">
              {formatCurrency(contract.amount)}
            </span>
          </div>

          {contract.isTournamentBased && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Trophy className="h-4 w-4 mr-2" />
              <span>대회 기반 계약</span>
            </div>
          )}
        </div>

        {/* 계약 조건 미리보기 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {contract.terms}
          </p>
        </div>

        {/* 생성일 */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 mb-4">
          <Clock className="h-3 w-3 mr-1" />
          <span>계약일: {formatDate(contract.createdAt)}</span>
        </div>

        {/* 액션 버튼 */}
        <div className="flex space-x-2">
          {onDownloadContract && (
            <Button
              size="sm"
              variant="outline"
              onClick={onDownloadContract}
              className="flex-1"
              leftIcon={<Download className="h-4 w-4" />}
            >
              계약서
            </Button>
          )}
          
          {onViewDetails && (
            <Button
              size="sm"
              onClick={onViewDetails}
              className="flex-1"
              leftIcon={<Eye className="h-4 w-4" />}
            >
              상세보기
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
