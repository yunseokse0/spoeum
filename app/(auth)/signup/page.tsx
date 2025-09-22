'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { Eye, EyeOff, Mail, Lock, User, Phone, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserType } from '@/types';

const userTypeOptions = [
  { value: 'caddy', label: '캐디', description: '골프 캐디로 활동하고 싶어요' },
  { value: 'tour_pro', label: '투어프로', description: '투어프로 골퍼예요' },
  { value: 'amateur', label: '아마추어', description: '아마추어 골퍼예요' },
  { value: 'agency', label: '에이전시', description: '골프 관련 사업을 하고 있어요' },
  { value: 'sponsor', label: '스폰서', description: '골프 선수 스폰서십을 제공하고 싶어요' },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const selectedUserType = watch('userType');

  const onSubmit = async (data: SignupFormData) => {
    if (!agreedToTerms || !agreedToPrivacy) {
      toast.error('약관에 동의해주세요.');
      return;
    }

    // 투어 프로인 경우 별도 페이지로 리다이렉트
    if (data.userType === 'tour_pro') {
      router.push('/tour-pro-signup');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: API 호출로 실제 회원가입 처리
      // const response = await api.signup(data);
      
      // 임시 데이터 (실제 구현 시 제거)
      const mockUser = {
        id: '1',
        email: data.email,
        name: data.name,
        phone: data.phone,
        userType: data.userType,
        role: 'user' as const,
        isVerified: false,
        isActive: true,
        status: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const mockToken = 'mock-jwt-token';
      
      setAuth(mockUser, mockToken);
      toast.success('회원가입에 성공했습니다.');
      
      // 사용자 타입에 따른 리다이렉트
      switch (data.userType) {
        case 'caddy':
          router.push('/profile/setup');
          break;
        case 'amateur':
          router.push('/dashboard');
          break;
        case 'agency':
          router.push('/profile/setup');
          break;
        case 'sponsor':
          router.push('/profile/setup');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            회원가입
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            스포이음에 오신 것을 환영합니다
          </p>
        </div>

        {/* 회원가입 폼 */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 사용자 타입 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  사용자 유형을 선택해주세요
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {userTypeOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedUserType === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        className="sr-only"
                        {...register('userType')}
                      />
                      <div className="flex items-center">
                        <UserCheck className="h-5 w-5 text-primary-600 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.userType && (
                  <p className="mt-1 text-sm text-error-600">{errors.userType.message}</p>
                )}
              </div>

              {/* 이름 입력 */}
              <Input
                label="이름"
                placeholder="이름을 입력하세요"
                leftIcon={<User className="h-5 w-5 text-gray-400" />}
                error={errors.name?.message}
                {...register('name')}
              />

              {/* 이메일 입력 */}
              <Input
                label="이메일"
                type="email"
                placeholder="이메일을 입력하세요"
                leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                error={errors.email?.message}
                {...register('email')}
              />

              {/* 전화번호 입력 */}
              <Input
                label="전화번호"
                type="tel"
                placeholder="010-1234-5678"
                leftIcon={<Phone className="h-5 w-5 text-gray-400" />}
                error={errors.phone?.message}
                {...register('phone')}
              />

              {/* 비밀번호 입력 */}
              <div>
                <Input
                  label="비밀번호"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  }
                  error={errors.password?.message}
                  helperText="8자 이상의 영문, 숫자, 특수문자 조합"
                  {...register('password')}
                />
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <Input
                  label="비밀번호 확인"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 입력하세요"
                  leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  }
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>

              {/* 스폰서 전용 필드 */}
              {selectedUserType === 'sponsor' && (
                <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    회사 정보
                  </h3>
                  
                  <Input
                    label="회사명"
                    placeholder="회사명을 입력하세요"
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                    {...register('companyName')}
                  />

                  <Input
                    label="사업자등록번호"
                    placeholder="123-45-67890"
                    leftIcon={<UserCheck className="h-5 w-5 text-gray-400" />}
                    {...register('businessLicense')}
                  />

                  <Input
                    label="대표자명"
                    placeholder="대표자명을 입력하세요"
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                    {...register('representative')}
                  />

                  <Input
                    label="회사 주소"
                    placeholder="회사 주소를 입력하세요"
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                    {...register('address')}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      업종
                    </label>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                      {...register('industry')}
                    >
                      <option value="">업종을 선택하세요</option>
                      <option value="골프용품">골프용품</option>
                      <option value="패션/의류">패션/의류</option>
                      <option value="스포츠용품">스포츠용품</option>
                      <option value="자동차">자동차</option>
                      <option value="금융">금융</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      회사 규모
                    </label>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                      {...register('companySize')}
                    >
                      <option value="">회사 규모를 선택하세요</option>
                      <option value="small">소규모 (10명 이하)</option>
                      <option value="medium">중규모 (11-100명)</option>
                      <option value="large">대규모 (101-1000명)</option>
                      <option value="enterprise">대기업 (1000명 이상)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 약관 동의 */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                      이용약관
                    </Link>
                    에 동의합니다 (필수)
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    id="privacy"
                    type="checkbox"
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="privacy" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                      개인정보처리방침
                    </Link>
                    에 동의합니다 (필수)
                  </label>
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={!agreedToTerms || !agreedToPrivacy}
                className="w-full"
              >
                회원가입
              </Button>
            </form>
          </div>

          {/* 로그인 링크 */}
          <div className="card-footer text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              이미 계정이 있으신가요?{' '}
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
