'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const adminLoginSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

// Mock 관리자 데이터
const mockAdmins = [
  {
    id: 'admin_001',
    email: 'admin@spoeum.com',
    password: 'admin123',
    name: '관리자',
    userType: 'admin' as const,
    role: 'admin' as const,
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'superadmin_001',
    email: 'superadmin@spoeum.com',
    password: 'super123',
    name: '슈퍼관리자',
    userType: 'superadmin' as const,
    role: 'superadmin' as const,
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    
    try {
      // Mock 인증 로직
      const admin = mockAdmins.find(
        admin => admin.email === data.email && admin.password === data.password
      );

      if (admin) {
        // JWT 토큰 생성 (Mock)
        const token = `admin_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // 로컬 스토리지에 저장
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(admin));
        
        toast.success(`${admin.name}님, 관리자 페이지에 오신 것을 환영합니다.`);
        router.push('/admin/dashboard');
      } else {
        toast.error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('관리자 로그인 오류:', error);
      toast.error('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            관리자 로그인
          </h1>
          <p className="text-blue-200">
            스포이음(SPOEUM) 관리자 전용 페이지
          </p>
        </div>

        {/* 로그인 폼 */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              관리자 인증
            </h2>
            <p className="text-sm text-gray-600">
              관리자 계정으로 로그인하세요
            </p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="이메일"
                type="email"
                placeholder="admin@spoeum.com"
                leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="비밀번호"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                rightIcon={
                  showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                  )
                }
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg"
              >
                {isLoading ? '로그인 중...' : '관리자 로그인'}
              </Button>
            </form>

            {/* 테스트 계정 정보 */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <p className="font-medium mb-1">테스트 계정:</p>
                  <p>관리자: admin@spoeum.com / admin123</p>
                  <p>슈퍼관리자: superadmin@spoeum.com / super123</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 푸터 */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            일반 사용자이신가요?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-white hover:text-blue-100 underline"
            >
              사용자 로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
