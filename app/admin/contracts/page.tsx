'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Download,
  Calendar,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useRouter } from 'next/navigation';

interface Contract {
  id: string;
  contractNumber: string;
  type: 'sponsorship' | 'service' | 'partnership';
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled';
  clientName: string;
  clientEmail: string;
  amount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

const mockContracts: Contract[] = [
  {
    id: '1',
    contractNumber: 'CT-2024-001',
    type: 'sponsorship',
    status: 'active',
    clientName: '삼성전자',
    clientEmail: 'contact@samsung.com',
    amount: 50000000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createdAt: '2023-12-15',
    updatedAt: '2024-01-01',
    description: '골프 대회 스폰서십 계약'
  },
  {
    id: '2',
    contractNumber: 'CT-2024-002',
    type: 'service',
    status: 'pending',
    clientName: 'LG전자',
    clientEmail: 'golf@lg.com',
    amount: 30000000,
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    description: '캐디 서비스 제공 계약'
  },
  {
    id: '3',
    contractNumber: 'CT-2024-003',
    type: 'partnership',
    status: 'completed',
    clientName: '현대자동차',
    clientEmail: 'partnership@hyundai.com',
    amount: 75000000,
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    createdAt: '2023-05-15',
    updatedAt: '2024-05-31',
    description: '골프장 파트너십 계약'
  }
];

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>(mockContracts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated || !currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
      router.push('/admin/login');
      return;
    }

    // Mock 데이터 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentUser, isAuthenticated, authLoading, router]);

  useEffect(() => {
    filterContracts();
  }, [contracts, searchTerm, filterStatus, filterType]);

  const filterContracts = () => {
    let filtered = contracts;

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터
    if (filterStatus !== 'all') {
      filtered = filtered.filter(contract => contract.status === filterStatus);
    }

    // 타입 필터
    if (filterType !== 'all') {
      filtered = filtered.filter(contract => contract.type === filterType);
    }

    setFilteredContracts(filtered);
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
      case 'draft':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'pending':
        return '대기중';
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소됨';
      case 'draft':
        return '초안';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sponsorship':
        return '스폰서십';
      case 'service':
        return '서비스';
      case 'partnership':
        return '파트너십';
      default:
        return type;
    }
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDetailModalOpen(true);
  };

  const handleEditContract = (contract: Contract) => {
    // 편집 로직 구현
    console.log('계약 편집:', contract);
  };

  const handleDeleteContract = (contractId: string) => {
    // 삭제 로직 구현
    console.log('계약 삭제:', contractId);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              계약 관리
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              스폰서십, 서비스, 파트너십 계약을 관리합니다
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            새 계약
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 계약</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{contracts.length}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">활성 계약</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contracts.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">대기중</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contracts.filter(c => c.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 계약금액</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contracts.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}원
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="계약번호, 고객명, 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">모든 상태</option>
                  <option value="active">활성</option>
                  <option value="pending">대기중</option>
                  <option value="completed">완료</option>
                  <option value="cancelled">취소됨</option>
                  <option value="draft">초안</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">모든 타입</option>
                  <option value="sponsorship">스폰서십</option>
                  <option value="service">서비스</option>
                  <option value="partnership">파트너십</option>
                </select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  내보내기
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 계약 목록 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              계약 목록 ({filteredContracts.length}개)
            </h3>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      계약번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      고객정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      타입
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      계약금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      기간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {contract.contractNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {contract.clientName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {contract.clientEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">
                          {getTypeLabel(contract.type)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(contract.status)}>
                          {getStatusLabel(contract.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {contract.amount.toLocaleString()}원
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {contract.startDate} ~ {contract.endDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewContract(contract)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditContract(contract)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteContract(contract.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
