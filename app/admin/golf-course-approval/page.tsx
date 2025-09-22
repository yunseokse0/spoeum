'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building, 
  MapPin, 
  Phone,
  Globe,
  User,
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { GolfCourseApprovalRequest } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function GolfCourseApprovalPage() {
  const [approvalRequests, setApprovalRequests] = useState<GolfCourseApprovalRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<GolfCourseApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<GolfCourseApprovalRequest | null>(null);

  useEffect(() => {
    loadApprovalRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [approvalRequests, searchQuery, statusFilter]);

  const loadApprovalRequests = async () => {
    try {
      setIsLoading(true);
      const response = await api.getApprovalRequests();
      
      if (response.success && response.data) {
        setApprovalRequests(response.data);
      } else {
        toast.error('승인 요청 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('승인 요청 목록 로드 오류:', error);
      toast.error('승인 요청 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = approvalRequests;

    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request => 
        request.name.toLowerCase().includes(query) ||
        request.region.toLowerCase().includes(query) ||
        request.city.toLowerCase().includes(query) ||
        request.requestedBy.toLowerCase().includes(query)
      );
    }

    // 최신순 정렬
    filtered.sort((a, b) => new Date(b.approvedAt || 0).getTime() - new Date(a.approvedAt || 0).getTime());

    setFilteredRequests(filtered);
  };

  const handleApprove = async (request: GolfCourseApprovalRequest) => {
    try {
      // TODO: 실제 승인 API 호출
      toast.success(`${request.name} 승인이 완료되었습니다.`);
      
      // 목록에서 제거
      setApprovalRequests(prev => prev.filter(req => req !== request));
      setSelectedRequest(null);
    } catch (error) {
      console.error('승인 처리 오류:', error);
      toast.error('승인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (request: GolfCourseApprovalRequest, reason: string) => {
    try {
      // TODO: 실제 거부 API 호출
      toast.success(`${request.name} 거부가 완료되었습니다.`);
      
      // 목록에서 제거
      setApprovalRequests(prev => prev.filter(req => req !== request));
      setSelectedRequest(null);
    } catch (error) {
      console.error('거부 처리 오류:', error);
      toast.error('거부 처리 중 오류가 발생했습니다.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '승인 대기';
      case 'approved':
        return '승인됨';
      case 'rejected':
        return '거부됨';
      default:
        return status;
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            골프장 승인 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            사용자가 요청한 골프장 정보를 검토하고 승인해주세요
          </p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">승인 대기</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {approvalRequests.filter(req => req.status === 'pending').length}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">승인됨</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {approvalRequests.filter(req => req.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">거부됨</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {approvalRequests.filter(req => req.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="골프장 이름, 지역, 요청자로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-5 w-5 text-gray-400" />}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'primary' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  leftIcon={<Filter className="h-4 w-4" />}
                >
                  전체
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'primary' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                  leftIcon={<Clock className="h-4 w-4" />}
                >
                  대기중
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'primary' : 'outline'}
                  onClick={() => setStatusFilter('approved')}
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                >
                  승인됨
                </Button>
                <Button
                  variant={statusFilter === 'rejected' ? 'primary' : 'outline'}
                  onClick={() => setStatusFilter('rejected')}
                  leftIcon={<XCircle className="h-4 w-4" />}
                >
                  거부됨
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 승인 요청 목록 */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery || statusFilter !== 'all' 
                    ? '검색 조건에 맞는 승인 요청이 없습니다.'
                    : '승인 대기 중인 요청이 없습니다.'
                  }
                </p>
              </CardBody>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={`${request.name}_${request.approvedAt}`} className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {request.name}
                        </h3>
                        <Badge variant={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{getStatusLabel(request.status)}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-2" />
                            {request.region} {request.city}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Building className="w-4 h-4 mr-2" />
                            {request.address}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {request.phone && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4 mr-2" />
                              {request.phone}
                            </div>
                          )}
                          {request.website && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Globe className="w-4 h-4 mr-2" />
                              <a 
                                href={request.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                {request.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                        <User className="w-4 h-4 mr-2" />
                        <span>요청자: {request.requestedBy}</span>
                        <Calendar className="w-4 h-4 ml-4 mr-2" />
                        <span>
                          {request.approvedAt ? new Date(request.approvedAt).toLocaleDateString() : '날짜 없음'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprove(request)}
                            leftIcon={<CheckCircle className="h-4 w-4" />}
                          >
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="error"
                            onClick={() => handleReject(request, '')}
                            leftIcon={<XCircle className="h-4 w-4" />}
                          >
                            거부
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRequest(request)}
                      >
                        상세보기
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
