'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Camera,
  Star,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  DollarSign
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { UserType } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, userType, isAuthenticated, clearAuth } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const getUserTypeLabel = (userType: UserType) => {
    switch (userType) {
      case 'caddy':
        return '캐디';
      case 'tour_pro':
        return '투어프로';
      case 'amateur':
        return '아마추어';
      case 'agency':
        return '에이전시';
      default:
        return '사용자';
    }
  };

  const getUserTypeColor = (userType: UserType) => {
    switch (userType) {
      case 'caddy':
        return 'blue';
      case 'tour_pro':
        return 'success';
      case 'amateur':
        return 'warning';
      case 'agency':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // 임시 프로필 데이터
  const profileData = {
    rating: 4.8,
    totalContracts: 25,
    completedContracts: 23,
    totalEarnings: 15000000,
    joinDate: new Date('2023-06-15'),
    lastActive: new Date('2024-01-15T14:30:00'),
    isVerified: user?.isVerified || false,
    specializations: ['PGA 투어', '아마추어 대회', '레슨 캐디'],
    achievements: ['2023년 최우수 캐디', '100회 계약 달성'],
    availableRegions: ['서울', '경기도', '제주도'],
    hourlyRate: 50000,
    career: 5,
  };

  const handleSave = () => {
    // TODO: 프로필 업데이트 API 호출
    console.log('프로필 업데이트:', editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const menuItems = [
    {
      icon: Settings,
      label: '계정 설정',
      onClick: () => router.push('/profile/settings'),
    },
    {
      icon: Bell,
      label: '알림 설정',
      onClick: () => router.push('/profile/notifications'),
    },
    {
      icon: Shield,
      label: '개인정보 보호',
      onClick: () => router.push('/profile/privacy'),
    },
    {
      icon: HelpCircle,
      label: '도움말 및 지원',
      onClick: () => router.push('/help'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <Header 
        title="프로필" 
        showNotificationButton={true}
        showMenuButton={false}
      />

      {/* 메인 콘텐츠 */}
      <main className="px-4 py-6 space-y-6">
        {/* 프로필 헤더 */}
        <Card>
          <CardBody className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
                <User className="h-12 w-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700">
                <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {user?.name}
              </h2>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Badge variant={getUserTypeColor(userType!)}>
                  {getUserTypeLabel(userType!)}
                </Badge>
                {profileData.isVerified && (
                  <Badge variant="success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    인증됨
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="h-4 w-4 text-warning-500 mr-1" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profileData.rating}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">평균 평점</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {profileData.totalContracts}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">총 계약</p>
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              leftIcon={<Edit className="h-4 w-4" />}
            >
              프로필 수정
            </Button>
          </CardBody>
        </Card>

        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              기본 정보
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">이메일</p>
                <p className="text-gray-900 dark:text-white">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">전화번호</p>
                {isEditing ? (
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user?.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">가입일</p>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(profileData.joinDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">마지막 활동</p>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(profileData.lastActive)}
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSave} size="sm" className="flex-1">
                  저장
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                  취소
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* 전문 정보 (캐디인 경우) */}
        {userType === 'caddy' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                전문 정보
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">경력</p>
                  <p className="text-gray-900 dark:text-white">{profileData.career}년</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">시간당 요금</p>
                  <p className="text-gray-900 dark:text-white">
                    {formatCurrency(profileData.hourlyRate)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">전문 분야</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">활동 지역</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.availableRegions.map((region, index) => (
                    <Badge key={index} variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">성과</p>
                <div className="space-y-1">
                  {profileData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-warning-500" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {achievement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* 수익 통계 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              수익 통계
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <p className="text-2xl font-bold text-success-600 mb-1">
                  {formatCurrency(profileData.totalEarnings).replace('₩', '')}원
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">총 수익</p>
              </div>
              <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p className="text-2xl font-bold text-primary-600 mb-1">
                  {profileData.completedContracts}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">완료 계약</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 설정 메뉴 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              설정
            </h3>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{item.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <LogOut className="h-5 w-5 text-error-500" />
                <span className="text-error-600">로그아웃</span>
              </button>
            </div>
          </CardBody>
        </Card>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
