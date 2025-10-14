'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Bell, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Plus,
  Edit,
  Trash2,
  Send,
  Users,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'event' | 'system' | 'warning' | 'info';
  status: 'sent' | 'scheduled' | 'draft' | 'cancelled';
  targetUsers: 'all' | 'members' | 'admins' | 'specific';
  recipients: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Mock 데이터 생성
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 'notif_001',
        title: '2025 KLPGA 시즌 개막전 안내',
        content: '2025 KLPGA 시즌 개막전이 11월 15일부터 18일까지 제주 핀크스 골프클럽에서 개최됩니다. 참가 신청은 10월 31일까지 가능합니다.',
        type: 'announcement',
        status: 'sent',
        targetUsers: 'all',
        recipients: 1250,
        sentAt: '2025-01-15T10:30:00Z',
        createdAt: '2025-01-15T10:00:00Z',
        createdBy: '김관리자',
        priority: 'high'
      },
      {
        id: 'notif_002',
        title: '시스템 점검 안내',
        content: '1월 20일 오전 2시부터 4시까지 시스템 점검이 예정되어 있습니다. 해당 시간 동안 서비스 이용이 제한될 수 있습니다.',
        type: 'system',
        status: 'scheduled',
        targetUsers: 'all',
        recipients: 1250,
        scheduledAt: '2025-01-20T02:00:00Z',
        createdAt: '2025-01-14T14:20:00Z',
        createdBy: '박관리자',
        priority: 'medium'
      },
      {
        id: 'notif_003',
        title: '신규 기능 출시 안내',
        content: '골프 대회 실시간 스코어링 기능이 출시되었습니다. 새로운 기능을 체험해보세요!',
        type: 'info',
        status: 'sent',
        targetUsers: 'members',
        recipients: 980,
        sentAt: '2025-01-12T16:45:00Z',
        createdAt: '2025-01-12T16:00:00Z',
        createdBy: '이관리자',
        priority: 'low'
      },
      {
        id: 'notif_004',
        title: '중요 보안 업데이트',
        content: '계정 보안을 위해 비밀번호를 변경해주시기 바랍니다. 2월 1일부터 기존 비밀번호로 로그인이 제한됩니다.',
        type: 'warning',
        status: 'draft',
        targetUsers: 'all',
        recipients: 0,
        createdAt: '2025-01-13T09:15:00Z',
        createdBy: '최관리자',
        priority: 'urgent'
      },
      {
        id: 'notif_005',
        title: '월간 이벤트 안내',
        content: '1월 한정 골프 용품 할인 이벤트가 진행 중입니다. 최대 50% 할인된 가격으로 구매하세요!',
        type: 'event',
        status: 'sent',
        targetUsers: 'members',
        recipients: 980,
        sentAt: '2025-01-10T11:30:00Z',
        createdAt: '2025-01-10T11:00:00Z',
        createdBy: '정관리자',
        priority: 'medium'
      }
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Badge variant="blue" leftIcon={<Bell className="w-3 h-3" />}>공지</Badge>;
      case 'event':
        return <Badge variant="green" leftIcon={<Calendar className="w-3 h-3" />}>이벤트</Badge>;
      case 'system':
        return <Badge variant="purple" leftIcon={<Info className="w-3 h-3" />}>시스템</Badge>;
      case 'warning':
        return <Badge variant="orange" leftIcon={<AlertTriangle className="w-3 h-3" />}>경고</Badge>;
      case 'info':
        return <Badge variant="blue" leftIcon={<Info className="w-3 h-3" />}>정보</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="green" leftIcon={<CheckCircle className="w-3 h-3" />}>발송완료</Badge>;
      case 'scheduled':
        return <Badge variant="yellow" leftIcon={<Calendar className="w-3 h-3" />}>예약됨</Badge>;
      case 'draft':
        return <Badge variant="secondary" leftIcon={<Edit className="w-3 h-3" />}>임시저장</Badge>;
      case 'cancelled':
        return <Badge variant="red" leftIcon={<XCircle className="w-3 h-3" />}>취소됨</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="red" className="bg-red-600 text-white">긴급</Badge>;
      case 'high':
        return <Badge variant="orange" className="bg-orange-500 text-white">높음</Badge>;
      case 'medium':
        return <Badge variant="yellow" className="bg-yellow-500 text-white">보통</Badge>;
      case 'low':
        return <Badge variant="blue" className="bg-blue-500 text-white">낮음</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const totalSent = notifications.filter(n => n.status === 'sent').length;
  const totalRecipients = notifications
    .filter(n => n.status === 'sent')
    .reduce((sum, n) => sum + n.recipients, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">알림관리</h1>
            <p className="text-gray-600 dark:text-gray-400">공지사항 및 알림 발송 관리</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              엑셀 다운로드
            </Button>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              알림 작성
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 발송 알림</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalSent}건
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 수신자</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalRecipients.toLocaleString()}명
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">예약된 알림</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {notifications.filter(n => n.status === 'scheduled').length}건
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">임시저장</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {notifications.filter(n => n.status === 'draft').length}건
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Edit className="w-6 h-6 text-gray-600" />
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
                  placeholder="제목 또는 내용으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full sm:w-48"
              >
                <option value="all">전체 유형</option>
                <option value="announcement">공지</option>
                <option value="event">이벤트</option>
                <option value="system">시스템</option>
                <option value="warning">경고</option>
                <option value="info">정보</option>
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48"
              >
                <option value="all">전체 상태</option>
                <option value="sent">발송완료</option>
                <option value="scheduled">예약됨</option>
                <option value="draft">임시저장</option>
                <option value="cancelled">취소됨</option>
              </Select>
              <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                필터 적용
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* 알림 목록 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              알림 목록 ({filteredNotifications.length}건)
            </h3>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      유형
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      우선순위
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      수신자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      발송일시
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {notification.content.substring(0, 50)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(notification.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(notification.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(notification.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {notification.recipients.toLocaleString()}명
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {notification.sentAt 
                          ? new Date(notification.sentAt).toLocaleString('ko-KR')
                          : notification.scheduledAt
                          ? new Date(notification.scheduledAt).toLocaleString('ko-KR')
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-3 h-3" />}
                            onClick={() => setSelectedNotification(notification)}
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
                          {notification.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Send className="w-3 h-3" />}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              발송
                            </Button>
                          )}
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
