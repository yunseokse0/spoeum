'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
// 인라인 컴포넌트 정의
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { onValueChange?: (value: string) => void }>(
  ({ className, onValueChange, ...props }, ref) => (
    <select
      ref={ref}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-blue-400 ${className || ''}`}
      onChange={(e) => {
        if (onValueChange) onValueChange(e.target.value);
        if (props.onChange) props.onChange(e);
      }}
      {...props}
    />
  )
);
Select.displayName = 'Select';

const Table = ({ children, className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className || ''}`} {...props}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={`[&_tr]:border-b ${className || ''}`} {...props}>
    {children}
  </thead>
);

const TableBody = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className || ''}`} {...props}>
    {children}
  </tbody>
);

const TableRow = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800 ${className || ''}`} {...props}>
    {children}
  </tr>
);

const TableHead = ({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400 ${className || ''}`} {...props}>
    {children}
  </th>
);

const TableCell = ({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`} {...props}>
    {children}
  </td>
);
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';
import { User as UserType, Gender, MemberStatus } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useRouter } from 'next/navigation';

interface AmateurUser extends UserType {
  amateurInfo: {
    gender?: Gender;
    handicap?: number;
    preferredRegions?: string[];
  };
}

export default function AdminAmateurMembersPage() {
  const [users, setUsers] = useState<AmateurUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AmateurUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<Gender | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<MemberStatus | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<AmateurUser | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser, isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated || !currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
      router.push('/admin/login');
      return;
    }

    fetchAmateurMembers();
  }, [currentUser, isAuthenticated, isLoading, router]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterGender, filterStatus]);

  const fetchAmateurMembers = async () => {
    try {
      const response = await api.get('/admin/members/amateur');
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        toast.error(response.error || '아마추어 회원 정보를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to fetch amateur members:', error);
      toast.error('아마추어 회원 정보를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 성별 필터
    if (filterGender !== 'all') {
      filtered = filtered.filter((user) => user.amateurInfo?.gender === filterGender);
    }

    // 상태 필터
    if (filterStatus !== 'all') {
      filtered = filtered.filter((user) => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
  };

  const handleStatusChange = async (userId: string, newStatus: MemberStatus) => {
    try {
      const response = await api.put(`/admin/members/${userId}/status`, { status: newStatus });
      if (response.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
        toast.success('회원 상태가 변경되었습니다.');
      } else {
        toast.error(response.error || '상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast.error('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const openDetailModal = (user: AmateurUser) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status: MemberStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'pending': return 'warning';
      case 'suspended': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p>아마추어 회원 정보 로딩 중...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">아마추어 회원 관리</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            총 {filteredUsers.length}명 (전체 {users.length}명)
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <User className="h-6 w-6 mr-2 text-green-500" /> 아마추어 회원 목록
            </h2>
          </CardHeader>
          <CardBody>
            {/* 필터 및 검색 */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="이름, 이메일로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
                className="flex-1"
              />
              <Select
                value={filterGender}
                onValueChange={(value) => setFilterGender(value as Gender | 'all')}
                className="w-full sm:w-40"
              >
                <option value="all">모든 성별</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </Select>
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as MemberStatus | 'all')}
                className="w-full sm:w-40"
              >
                <option value="all">모든 상태</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="pending">승인대기</option>
                <option value="suspended">정지</option>
              </Select>
            </div>

            {/* 회원 목록 테이블 */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>성별</TableHead>
                    <TableHead>핸디캡</TableHead>
                    <TableHead>선호 지역</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 dark:text-gray-400 py-8">
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {user.amateurInfo?.gender ? 
                              (user.amateurInfo.gender === 'male' ? '남성' : '여성') : '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {user.amateurInfo?.handicap ? `${user.amateurInfo.handicap}` : '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {user.amateurInfo?.preferredRegions?.join(', ') || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(user.status)}>
                            {user.status === 'active' ? '활성' : 
                             user.status === 'inactive' ? '비활성' :
                             user.status === 'pending' ? '승인대기' : '정지'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDetailModal(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                const newStatus = user.status === 'active' ? 'suspended' : 'active';
                                handleStatusChange(user.id, newStatus);
                              }}
                            >
                              {user.status === 'active' ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>

        {/* 상세보기 모달 */}
        <Modal 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)}
          size="lg"
        >
          <ModalHeader>
            <h3 className="text-lg font-semibold">아마추어 상세 정보</h3>
          </ModalHeader>
          <ModalBody>
            {selectedUser && (
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">이름</p>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">이메일</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">전화번호</p>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">가입일</p>
                      <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* 아마추어 정보 */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold mb-4">아마추어 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">성별</p>
                      <p className="font-medium mt-1">
                        {selectedUser.amateurInfo?.gender ? 
                          (selectedUser.amateurInfo.gender === 'male' ? '남성' : '여성') : '미입력'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">핸디캡</p>
                      <p className="font-medium mt-1">
                        {selectedUser.amateurInfo?.handicap ? `${selectedUser.amateurInfo.handicap}` : '미입력'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">선호 지역</p>
                      <p className="font-medium mt-1">
                        {selectedUser.amateurInfo?.preferredRegions?.join(', ') || '미입력'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              닫기
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </AdminLayout>
  );
}
