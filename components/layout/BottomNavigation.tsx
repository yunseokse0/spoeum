'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Search, 
  FileText, 
  CreditCard, 
  User,
  Settings,
  Users,
  Calendar,
  Trophy
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  userTypes: string[];
  badge?: number;
}

export default function BottomNavigation() {
  const pathname = usePathname();
  const { userType } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const tabs: TabItem[] = [
    {
      id: 'home',
      label: '홈',
      icon: Home,
      href: '/dashboard',
      userTypes: ['caddy', 'tour_pro', 'amateur', 'agency'],
    },
    {
      id: 'tournaments',
      label: '대회',
      icon: Trophy,
      href: '/tournaments',
      userTypes: ['caddy', 'tour_pro', 'amateur', 'agency', 'sponsor'],
    },
    {
      id: 'sponsorship',
      label: '스폰서십',
      icon: Users,
      href: '/sponsorship',
      userTypes: ['sponsor', 'tour_pro', 'amateur'],
    },
    {
      id: 'matching',
      label: '매칭',
      icon: Search,
      href: '/matching',
      userTypes: ['caddy', 'tour_pro', 'amateur', 'agency'],
    },
    {
      id: 'contracts',
      label: '계약',
      icon: FileText,
      href: '/contracts',
      userTypes: ['caddy', 'tour_pro', 'amateur', 'agency', 'sponsor'],
    },
    {
      id: 'profile',
      label: '프로필',
      icon: User,
      href: '/profile',
      userTypes: ['caddy', 'tour_pro', 'amateur', 'agency', 'sponsor'],
    },
  ];

  // 관리자용 탭
  const adminTabs: TabItem[] = [
    {
      id: 'admin-home',
      label: '관리',
      icon: Settings,
      href: '/admin',
      userTypes: ['agency'],
    },
    {
      id: 'admin-users',
      label: '회원',
      icon: Users,
      href: '/admin/users',
      userTypes: ['agency'],
    },
    {
      id: 'admin-payments',
      label: '결제',
      icon: CreditCard,
      href: '/admin/payments',
      userTypes: ['agency'],
    },
    {
      id: 'admin-notifications',
      label: '알림',
      icon: Calendar,
      href: '/admin/notifications',
      userTypes: ['agency'],
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  // 사용자 타입에 따른 탭 필터링
  const availableTabs = userType === 'agency' ? adminTabs : tabs;

  const isActiveTab = (href: string) => {
    if (href === '/dashboard' || href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bottom-tab safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {availableTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isActiveTab(tab.href);
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                'tab-item touch-manipulation',
                isActive ? 'tab-item-active' : 'tab-item-inactive'
              )}
            >
              <div className="relative">
                <Icon className="h-6 w-6 mx-auto mb-1" />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
