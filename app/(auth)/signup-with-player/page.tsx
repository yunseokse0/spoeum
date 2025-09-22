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
import { PlayerSearchForm } from '@/components/ui/PlayerSearchForm';
import { PlayerCareerCard } from '@/components/ui/PlayerCareerCard';
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
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { PlayerInfo } from '@/types';
import toast from 'react-hot-toast';

interface SignupWithPlayerForm extends SignupFormData {
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

export default function SignupWithPlayerPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [uploadedFiles, setUploadedFiles] = useState<{
    businessRegistration?: File;
    logo?: File;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo | null>(null);
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupWithPlayerForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: 'sponsor'
    }
  });

  const onSubmit = async (data: SignupWithPlayerForm) => {
    setIsLoading(true);
    
    try {
      // TODO: 실제 API 호출
      const mockUser = {
        id: '1',
        email: data.email,
        name: data.name,
        phone: data.phone,
        userType: 'sponsor' as const,
        role: 'user' as const,
        isVerified: false,
        isActive: true,
        status: 'pending' as const,
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
    setValue(`${type}File` as keyof SignupWithPlayerForm, file);
  };

  const handlePlayerFound = (player: PlayerInfo) => {
    setSelectedPlayer(player);
    setShowPlayerSearch(false);
    
    // 선수 정보를 폼에 자동으로 채우기
    setValue('name', player.name);
    
    // 생년월일에서 나이 계산하여 경력 정보로 활용
    const birthYear = new Date(player.birth).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    toast.success(`${player.name} 선수의 정보를 가져왔습니다!`);
  };

  const handlePlayerSearchClear = () => {
    setSelectedPlayer(null);
    setShowPlayerSearch(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-green-50 via-white to-golf-sky-50 dark:from-golf-dark-900 dark:via-golf-dark-800 dark:to-golf-dark-900 relative overflow-hidden">
      {/* 골프장 배경 텍스처 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-golf-green-500 rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-golf-sky-500 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-golf-sand-500 rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-golf-green-400 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-golf-green-600 to-golf-green-800 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <div className="text-3xl">🏌️‍♂️</div>
          </div>
          <h1 className="text-4xl font-bold font-display text-golf-dark-700 mb-2">
            투어프로 회원가입
          </h1>
          <p className="text-golf-dark-600 text-lg">
            골프의 프로가 되어 최고의 캐디와 만나세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 선수 정보 조회 섹션 */}
          <div className="space-y-6">
            <Card className="border-golf-green-200 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-golf-green-500 to-golf-green-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <div className="text-xl">🏆</div>
                  <h2 className="text-lg font-semibold font-display">
                    투어프로 정보 조회
                  </h2>
                </div>
                <p className="text-sm text-golf-green-100">
                  KLPGA/KPGA 정회원 정보를 확인하여 빠르게 가입하세요
                </p>
              </CardHeader>
              <CardBody>
                {showPlayerSearch || !selectedPlayer ? (
                  <PlayerSearchForm
                    onPlayerFound={handlePlayerFound}
                    onClear={handlePlayerSearchClear}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-green-700 dark:text-green-300">
                          선택된 선수
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowPlayerSearch(true)}
                      >
                        변경
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3">
                        {selectedPlayer.profileImage && (
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl overflow-hidden">
                            <img
                              src={selectedPlayer.profileImage}
                              alt={selectedPlayer.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-green-900 dark:text-green-100">
                            {selectedPlayer.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="blue" className="text-xs">
                              {selectedPlayer.association}
                            </Badge>
                            <span className="text-sm text-green-700 dark:text-green-300">
                              {selectedPlayer.birth}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* 선수 경력 정보 */}
            {selectedPlayer && (
              <PlayerCareerCard player={selectedPlayer} />
            )}
          </div>

          {/* 회원가입 폼 */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 투어프로 정보 */}
              <Card className="border-golf-sky-200 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-golf-sky-500 to-golf-sky-600 text-white rounded-t-lg">
                  <div className="flex items-center space-x-2">
                    <div className="text-xl">👤</div>
                    <h2 className="text-lg font-semibold font-display">
                      투어프로 정보
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
            <div className="text-center">
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
      </div>
    </div>
  );
}
