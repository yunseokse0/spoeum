'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Trophy,
  Users,
  TrendingUp
} from 'lucide-react';

interface Sponsorship {
  id: string;
  sponsorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  amount: number;
  startDate: string;
  endDate: string;
  benefits: string[];
  tournaments: string[];
  createdAt: string;
  description: string;
}

export default function SponsorshipPage() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSponsorship, setSelectedSponsorship] = useState<Sponsorship | null>(null);

  // Mock 데이터 생성
  useEffect(() => {
    const mockSponsorships: Sponsorship[] = [
      {
        id: 'sponsor_001',
        sponsorName: '롯데그룹',
        contactPerson: '김영수',
        email: 'youngsu.kim@lotte.net',
        phone: '02-1234-5678',
        tier: 'platinum',
        status: 'active',
        amount: 5000000000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        benefits: ['대회명 스폰서', 'TV 광고', '온라인 배너', '골프장 홍보'],
        tournaments: ['2025 롯데 챔피언십', '2025 롯데 오픈'],
        createdAt: '2024-12-15T10:30:00Z',
        description: '롯데그룹의 골프 대회 스폰서십'
      },
      {
        id: 'sponsor_002',
        sponsorName: 'BMW 코리아',
        contactPerson: '박민지',
        email: 'minji.park@bmw.co.kr',
        phone: '02-2345-6789',
        tier: 'gold',
        status: 'active',
        amount: 3000000000,
        startDate: '2025-03-01',
        endDate: '2025-11-30',
        benefits: ['대회 스폰서', '온라인 배너', '골프장 홍보'],
        tournaments: ['2025 BMW 레이디스 챔피언십'],
        createdAt: '2024-11-20T14:20:00Z',
        description: 'BMW 레이디스 챔피언십 스폰서십'
      },
      {
        id: 'sponsor_003',
        sponsorName: 'S-OIL',
        contactPerson: '이정은',
        email: 'jeongeun.lee@soil.co.kr',
        phone: '02-3456-7890',
        tier: 'silver',
        status: 'pending',
        amount: 1500000000,
        startDate: '2025-06-01',
        endDate: '2025-12-31',
        benefits: ['대회 스폰서', '온라인 배너'],
        tournaments: ['2025 S-OIL 챔피언십'],
        createdAt: '2025-01-10T16:45:00Z',
        description: 'S-OIL 챔피언십 스폰서십 (검토 중)'
      },
      {
        id: 'sponsor_004',
        sponsorName: 'LG전자',
        contactPerson: '최유진',
        email: 'yujin.choi@lge.com',
        phone: '02-4567-8901',
        tier: 'bronze',
        status: 'expired',
        amount: 500000000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        benefits: ['온라인 배너'],
        tournaments: ['2024 LG전자 오픈'],
        createdAt: '2023-12-01T09:15:00Z',
        description: 'LG전자 오픈 스폰서십 (만료됨)'
      }
    ];

    setSponsorships(mockSponsorships);
    setLoading(false);
  }, []);

  const filteredSponsorships = sponsorships.filter(sponsorship => {
    const matchesSearch = sponsorship.sponsorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsorship.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || sponsorship.tier === tierFilter;
    const matchesStatus = statusFilter === 'all' || sponsorship.status === statusFilter;
    
    return matchesSearch && matchesTier && matchesStatus;
  });

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return <Badge variant="blue" className="bg-gray-800 text-white">플래티넘</Badge>;
      case 'gold':
        return <Badge variant="yellow" className="bg-yellow-500 text-white">골드</Badge>;
      case 'silver':
        return <Badge variant="secondary" className="bg-gray-400 text-white">실버</Badge>;
      case 'bronze':
        return <Badge variant="orange" className="bg-orange-600 text-white">브론즈</Badge>;
      default:
        return <Badge variant="secondary">{tier}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="green">활성</Badge>;
      case 'pending':
        return <Badge variant="yellow">검토중</Badge>;
      case 'expired':
        return <Badge variant="red">만료됨</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">취소됨</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalRevenue = sponsorships
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);

  const activeSponsors = sponsorships.filter(s => s.status === 'active').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">스폰서십</h1>
            <p className="text-gray-600 dark:text-gray-400">스폰서십 관리 및 계약</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              엑셀 다운로드
            </Button>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              스폰서 등록
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 스폰서십 수익</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalRevenue.toLocaleString()}원
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">활성 스폰서</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {activeSponsors}개사
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 계약</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {sponsorships.length}건
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">평균 계약금액</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(totalRevenue / activeSponsors || 0).toLocaleString()}원
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardBody className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="스폰서명 또는 담당자명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <Select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full sm:w-48"
              >
                <option value="all">전체 등급</option>
                <option value="platinum">플래티넘</option>
                <option value="gold">골드</option>
                <option value="silver">실버</option>
                <option value="bronze">브론즈</option>
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48"
              >
                <option value="all">전체 상태</option>
                <option value="active">활성</option>
                <option value="pending">검토중</option>
                <option value="expired">만료됨</option>
                <option value="cancelled">취소됨</option>
              </Select>
              <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                필터 적용
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* 스폰서십 목록 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              스폰서십 계약 목록 ({filteredSponsorships.length}건)
            </h3>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      스폰서명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      담당자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      등급
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      계약금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      계약기간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSponsorships.map((sponsorship) => (
                    <tr key={sponsorship.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {sponsorship.sponsorName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {sponsorship.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {sponsorship.contactPerson}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {sponsorship.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTierBadge(sponsorship.tier)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {sponsorship.amount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(sponsorship.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          <div>{new Date(sponsorship.startDate).toLocaleDateString('ko-KR')}</div>
                          <div>~ {new Date(sponsorship.endDate).toLocaleDateString('ko-KR')}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-3 h-3" />}
                            onClick={() => setSelectedSponsorship(sponsorship)}
                          >
                            상세
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Edit className="w-3 h-3" />}
                          >
                            수정
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Trash2 className="w-3 h-3" />}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            삭제
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
