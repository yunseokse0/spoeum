'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Menu, Search, User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearchButton?: boolean;
  showNotificationButton?: boolean;
  showMenuButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

export default function Header({
  title,
  showBackButton = false,
  showSearchButton = false,
  showNotificationButton = true,
  showMenuButton = false,
  onBackClick,
  className,
}: HeaderProps) {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  const handleLogout = () => {
    clearAuth();
    // 현재 페이지 정보를 로그인 페이지로 전달
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const getUserTypeLabel = (userType: string) => {
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

  return (
    <header className={cn('mobile-header safe-area-top', className)}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* 좌측 영역 */}
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          
          {showMenuButton && (
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation">
              <Menu className="w-5 h-5" />
            </button>
          )}

          {title && (
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
          )}
        </div>

        {/* 우측 영역 */}
        <div className="flex items-center space-x-2">
          {showSearchButton && (
            <Link
              href="/search"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            >
              <Search className="w-5 h-5" />
            </Link>
          )}

          {showNotificationButton && (
            <Link
              href="/notifications"
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* 사용자 메뉴 */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
            </button>

            {/* 드롭다운 메뉴 */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.userType && getUserTypeLabel(user.userType)}
                    </p>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    프로필
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    설정
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
