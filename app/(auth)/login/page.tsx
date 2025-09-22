'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GolfLogoWithText } from '@/components/ui/GolfLogo';
import { useAuthStore } from '@/store/useAuthStore';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { User } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // URL 파라미터에서 리다이렉트 경로와 메시지 가져오기
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const redirectTo = searchParams.get('redirect') || null;
  const message = searchParams.get('message') || null;
  
  // 회원가입 완료 메시지 표시
  React.useEffect(() => {
    if (message === 'signup-success') {
      toast.success('회원가입이 완료되었습니다! 로그인해주세요.');
    }
  }, [message]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      // TODO: API 호출로 실제 로그인 처리
      // const response = await api.login(data.email, data.password);
      
      // 임시 데이터 (실제 구현 시 제거)
      const mockUser: User = {
        id: '1',
        email: data.email,
        name: '테스트 사용자',
        phone: '010-1234-5678',
        userType: 'caddy',
        role: 'user',
        isVerified: true,
        isActive: true,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const mockToken = 'mock-jwt-token';
      
      setAuth(mockUser, mockToken);
      toast.success('로그인에 성공했습니다.');
      
      // 리다이렉트 경로가 있으면 해당 페이지로, 없으면 사용자 타입에 따른 기본 페이지로
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        // 사용자 타입에 따른 기본 리다이렉트
        const getDefaultRedirect = (userType: string) => {
          switch (userType) {
            case 'admin':
            case 'superadmin':
              return '/admin';
            case 'agency':
              return '/admin';
            default:
              return '/dashboard';
          }
        };
        
        router.push(getDefaultRedirect(mockUser.userType));
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GolfLogoWithText size="lg" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            골프 캐디 매칭 플랫폼에 오신 것을 환영합니다
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 이메일 입력 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  이메일
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    className={`pl-10 ${errors.email ? 'input-error' : ''}`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                )}
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    className={`pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
                )}
              </div>

              {/* 로그인 옵션 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    로그인 상태 유지
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                  >
                    비밀번호 찾기
                  </Link>
                </div>
              </div>

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                className="w-full"
              >
                로그인
              </Button>
            </form>
          </div>

          {/* 회원가입 링크 */}
          <div className="card-footer text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              아직 계정이 없으신가요?{' '}
              <Link
                href="/signup"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* 소셜 로그인 */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 text-gray-500 dark:text-gray-400">
                또는
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>

            <Button variant="outline" className="w-full">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
              Kakao
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
