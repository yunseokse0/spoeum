'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Building2, 
  FileText, 
  Upload, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Briefcase,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

interface SponsorSignupForm extends SignupFormData {
  businessRegistrationFile?: File;
  logoFile?: File;
}

const industries = [
  '골프용품', '패션/의류', '스포츠용품', '자동차', 
  '금융', '기술', '식음료', '기타'
];

const companySizes = [
  { value: 'small', label: '소규모 (10명 이하)' },
  { value: 'medium', label: '중규모 (11-100명)' },
  { value: 'large', label: '대규모 (101-1000명)' },
  { value: 'enterprise', label: '대기업 (1000명 이상)' }
];

export default function SponsorSignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [uploadedFiles, setUploadedFiles] = useState<{
    businessRegistration?: File;
    logo?: File;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SponsorSignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SponsorSignupForm) => {
    setIsLoading(true);
    
    try {
      // TODO: 실제 API 호출
      const mockUser = {
        id: '1',
        email: data.email,
        name: data.name,
        phone: data.phone,
        userType: 'sponsor' as const,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setAuth(mockUser, 'mock-token');
      toast.success('스폰서 회원가입이 완료되었습니다!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (type: 'businessRegistration' | 'logo', file: File) => {
    setUploadedFiles((prev: any) => ({ ...prev, [type]: file }));
    setValue(`${type}File` as keyof SponsorSignupForm, file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            스폰서 회원가입
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            골프 선수들과 함께 성장하세요
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 회사 정보 */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  회사 정보
                </h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="회사명"
                placeholder="회사명을 입력하세요"
                leftIcon={<Building2 className="h-5 w-5 text-blue-400" />}
                error={errors.companyName?.message}
                {...register('companyName', { required: '회사명은 필수입니다.' })}
              />

              <Input
                label="사업자등록번호"
                placeholder="123-45-67890"
                leftIcon={<FileText className="h-5 w-5 text-blue-400" />}
                error={errors.businessLicense?.message}
                {...register('businessLicense', { 
                  required: '사업자등록번호는 필수입니다.',
                  pattern: {
                    value: /^\d{3}-\d{2}-\d{5}$/,
                    message: '올바른 형식으로 입력해주세요 (예: 123-45-67890)'
                  }
                })}
              />

              <Input
                label="대표자명"
                placeholder="대표자명을 입력하세요"
                leftIcon={<User className="h-5 w-5 text-blue-400" />}
                error={errors.representative?.message}
                {...register('representative', { required: '대표자명은 필수입니다.' })}
              />

              <Input
                label="회사 주소"
                placeholder="회사 주소를 입력하세요"
                leftIcon={<MapPin className="h-5 w-5 text-blue-400" />}
                error={errors.address?.message}
                {...register('address', { required: '회사 주소는 필수입니다.' })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    업종
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                    {...register('industry', { required: '업종을 선택해주세요.' })}
                  >
                    <option value="">업종을 선택하세요</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    회사 규모
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                    {...register('companySize', { required: '회사 규모를 선택해주세요.' })}
                  >
                    <option value="">회사 규모를 선택하세요</option>
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 서류 업로드 */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  서류 업로드
                </h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    사업자등록증
                  </label>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('businessRegistration', file);
                      }}
                      className="hidden"
                      id="business-registration"
                    />
                    <label htmlFor="business-registration" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        사업자등록증을 업로드하세요
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, JPG, PNG 파일만 가능
                      </p>
                    </label>
                  </div>
                  {uploadedFiles.businessRegistration && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>{uploadedFiles.businessRegistration.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    브랜드 로고
                  </label>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.svg"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('logo', file);
                      }}
                      className="hidden"
                      id="logo"
                    />
                    <label htmlFor="logo" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        브랜드 로고를 업로드하세요
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, SVG 파일만 가능
                      </p>
                    </label>
                  </div>
                  {uploadedFiles.logo && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>{uploadedFiles.logo.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 담당자 정보 */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  담당자 정보
                </h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="담당자명"
                placeholder="담당자명을 입력하세요"
                leftIcon={<User className="h-5 w-5 text-blue-400" />}
                error={errors.name?.message}
                {...register('name', { required: '담당자명은 필수입니다.' })}
              />

              <Input
                label="연락처"
                placeholder="010-1234-5678"
                leftIcon={<Phone className="h-5 w-5 text-blue-400" />}
                error={errors.phone?.message}
                {...register('phone', { 
                  required: '연락처는 필수입니다.',
                  pattern: {
                    value: /^010-\d{4}-\d{4}$/,
                    message: '올바른 형식으로 입력해주세요 (예: 010-1234-5678)'
                  }
                })}
              />

              <Input
                label="이메일"
                type="email"
                placeholder="contact@company.com"
                leftIcon={<Mail className="h-5 w-5 text-blue-400" />}
                error={errors.email?.message}
                {...register('email', { 
                  required: '이메일은 필수입니다.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '올바른 이메일 형식이 아닙니다.'
                  }
                })}
              />
            </CardBody>
          </Card>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            loading={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg"
            leftIcon={<CheckCircle className="h-5 w-5" />}
          >
            스폰서 회원가입 완료
          </Button>
        </form>

        {/* 로그인 링크 */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
