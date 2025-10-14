import { useState, useEffect } from 'react';
import { User } from '@/types';

interface AdminAuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAdminAuth(): AdminAuthState {
  const [authState, setAuthState] = useState<AdminAuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;

    try {
      const token = localStorage.getItem('admin_token');
      const userStr = localStorage.getItem('admin_user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('관리자 인증 상태 확인 오류:', error);
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  return authState;
}
