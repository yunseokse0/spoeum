'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { User } from '@/types';

// Mock 회원 데이터
const mockUsers: User[] = [
  {
    id: 'user_001',
    email: 'golfer1@example.com',
    name: '김골퍼',
    phone: '010-1234-5678',
    userType: 'tour_pro',
    role: 'user',
    profileImage: undefined,
    isVerified: true,
    isActive: true,
    lastLoginAt: new Date('2024-01-15T10:30:00Z'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'user_002',
    email: 'caddy1@example.com',
    name: '이캐디',
    phone: '010-2345-6789',
    userType: 'caddy',
    role: 'user',
    profileImage: undefined,
    isVerified: true,
    isActive: true,
    lastLoginAt: new Date('2024-01-14T15:20:00Z'),
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 'user_003',
    email: 'sponsor1@example.com',
    name: '박스폰서',
    phone: '010-3456-7890',
    userType: 'sponsor',
    role: 'user',
    profileImage: undefined,
    isVerified: false,
    isActive: false,
    lastLoginAt: new Date('2024-01-10T09:15:00Z'),
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'user_004',
    email: 'amateur1@example.com',
    name: '최아마추어',
    phone: '010-4567-8901',
    userType: 'amateur',
    role: 'user',
    profileImage: undefined,
    isVerified: true,
    isActive: true,
    lastLoginAt: new Date('2024-01-13T14:45:00Z'),
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: 'user_005',
    email: 'agency1@example.com',
    name: '정에이전시',
    phone: '010-5678-9012',
    userType: 'agency',
    role: 'user',
    profileImage: undefined,
    isVerified: true,
    isActive: true,
    lastLoginAt: new Date('2024-01-12T11:30:00Z'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  }
];

export default function AdminMembersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    filterUsers();
  }, [searchQuery, statusFilter, typeFilter, users]);

  const filterUsers = () => {
    let filtered = users;

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query)
      );
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.isActive);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(user => !user.isActive);
      } else if (statusFilter === 'verified') {
        filtered = filtered.filter(user => user.isVerified);
      } else if (statusFilter === 'unverified') {
        filtered = filtered.filter(user => !user.isVerified);
      }
    }

    // 유형 필터
    if (typeFilter !== 'all') {
      filtered = filtered.filter(user => user.userType === typeFilter);
    }

    setFilteredUsers(filtered);
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'tour_pro':
        return '투어프로';
      case 'amateur':
        return '아마추어';
      case 'caddy':
        return '캐디';
      case 'sponsor':
        return '스폰서';
      case 'agency':
        return '에이전시';
      case 'admin':
        return '관리자';
      case 'superadmin':
        return '슈퍼관리자';
      default:
        return userType;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'tour_pro':
        return 'primary';
      case 'amateur':
        return 'secondary';
      case 'caddy':
        return 'success';
      case 'sponsor':
        return 'warning';
      case 'agency':
        return 'error';
      case 'admin':
        return 'primary';
      case 'superadmin':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const handleToggleActive = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive, updatedAt: new Date() }
        : user
    ));
  };

  const handleToggleVerified = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isVerified: !user.isVerified, updatedAt: new Date() }
        : user
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              회원 관리
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              전체 회원 정보를 관리하고 모니터링하세요
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              내보내기
            </Button>
            <Button leftIcon={<Upload className="w-4 h-4" />}>
              회원 추가
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 회원</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">활성 회원</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(u => u.isActive).length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">인증 회원</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(u => u.isVerified).length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">비활성 회원</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(u => !u.isActive).length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="이름, 이메일, 전화번호로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-5 w-5 text-gray-400" />}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">전체 상태</option>
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                  <option value="verified">인증됨</option>
                  <option value="unverified">미인증</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">전체 유형</option>
                  <option value="tour_pro">투어프로</option>
                  <option value="amateur">아마추어</option>
                  <option value="caddy">캐디</option>
                  <option value="sponsor">스폰서</option>
                  <option value="agency">에이전시</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 회원 목록 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              회원 목록 ({filteredUsers.length}명)
            </h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">회원</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">유형</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">상태</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">마지막 로그인</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">가입일</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getUserTypeColor(user.userType)}>
                          {getUserTypeLabel(user.userType)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.isActive ? 'success' : 'error'} className="text-xs">
                            {user.isActive ? '활성' : '비활성'}
                          </Badge>
                          <Badge variant={user.isVerified ? 'primary' : 'secondary'} className="text-xs">
                            {user.isVerified ? '인증' : '미인증'}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('ko-KR') : '없음'}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(user.id)}
                          >
                            {user.isActive ? '비활성화' : '활성화'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleVerified(user.id)}
                          >
                            {user.isVerified ? '인증해제' : '인증'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
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
