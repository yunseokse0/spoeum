'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { 
  Shield, 
  Users, 
  FileText, 
  CreditCard, 
  Coins,
  UserCheck,
  Trophy,
  Bell,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Home,
  ChevronRight,
  Bot
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  userType: 'admin' | 'superadmin';
  role: 'admin' | 'superadmin';
}

const adminMenuItems = [
  {
    title: '대시보드',
    href: '/admin/dashboard',
    icon: Home,
    description: '전체 현황 및 통계'
  },
  {
    title: '회원관리',
    href: '/admin/members',
    icon: Users,
    description: '사용자 계정 관리'
  },
  {
    title: '계약관리',
    href: '/admin/contracts',
    icon: FileText,
    description: '계약서 및 파기 관리'
  },
  {
    title: '결제관리',
    href: '/admin/payments',
    icon: CreditCard,
    description: '결제 및 수수료 관리'
  },
  {
    title: '포인트관리',
    href: '/admin/points',
    icon: Coins,
    description: '포인트 충전 및 차감'
  },
  {
    title: '스폰서십',
    href: '/admin/sponsorship',
    icon: UserCheck,
    description: '스폰서십 관리'
  },
  {
    title: '대회관리',
    href: '/admin/tournaments',
    icon: Trophy,
    description: '골프 대회 관리'
  },
  {
    title: '대회 데이터 입력',
    href: '/admin/gemini-tournament',
    icon: Bot,
    description: '자동 검증 및 저장'
  },
  {
    title: '대회결과 조회',
    href: '/admin/tournament-results',
    icon: Trophy,
    description: '저장된 대회 결과'
  },
  {
    title: '알림관리',
    href: '/admin/notifications',
    icon: Bell,
    description: '공지사항 및 알림'
  },
  {
    title: '통계리포트',
    href: '/admin/reports',
    icon: BarChart3,
    description: '분석 및 리포트'
  },
  {
    title: '시스템관리',
    href: '/admin/settings',
    icon: Settings,
    description: '시스템 설정'
  }
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // 관리자 인증 확인
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    
    // 개발/테스트용 임시 관리자 설정
    if (!token || !userStr) {
      // URL에 ?demo=true가 있으면 임시 관리자로 로그인
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('demo') === 'true') {
        const tempAdmin = {
          id: 'temp_admin',
          email: 'demo@spoeum.com',
          name: '데모 관리자',
          userType: 'admin' as const,
          role: 'admin' as const
        };
        localStorage.setItem('admin_token', 'temp_token');
        localStorage.setItem('admin_user', JSON.stringify(tempAdmin));
        setAdminUser(tempAdmin);
        return;
      }
      router.push('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setAdminUser(user);
    } catch (error) {
      console.error('관리자 정보 파싱 오류:', error);
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    // 현재 페이지 정보를 관리자 로그인 페이지로 전달
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/admin';
    router.push(`/admin/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">관리자 인증 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-green-50 via-white to-golf-sky-50 dark:from-golf-dark-900 dark:via-golf-dark-800 dark:to-golf-dark-900">
      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-golf-dark-800/95 backdrop-blur-sm shadow-lg transform transition-transform duration-300 ease-in-out border-r border-golf-green-200 dark:border-golf-dark-700
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        {/* 사이드바 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                관리자
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                SPOEUM
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 관리자 정보 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {adminUser.name}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant={adminUser.role === 'superadmin' ? 'blue' : 'secondary'} className="text-xs">
                  {adminUser.role === 'superadmin' ? '슈퍼관리자' : '관리자'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-colors group
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
              </Link>
            );
          })}
        </nav>

        {/* 로그아웃 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleLogout}
            fullWidth
            leftIcon={<LogOut className="w-4 h-4" />}
            className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            로그아웃
          </Button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="lg:pl-64">
        {/* 상단바 */}
        <header className="bg-white/95 dark:bg-golf-dark-800/95 backdrop-blur-sm shadow-sm border-b border-golf-green-200 dark:border-golf-dark-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {adminMenuItems.find(item => item.href === pathname)?.title || '관리자 페이지'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {adminMenuItems.find(item => item.href === pathname)?.description || ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 다크테마 토글 버튼 */}
              <ThemeToggle variant="button" />
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date().toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              <Badge variant="blue" className="text-xs">
                {adminUser.role === 'superadmin' ? '슈퍼관리자' : '관리자'}
              </Badge>
            </div>
          </div>
        </header>

        {/* 페이지 컨텐츠 */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
