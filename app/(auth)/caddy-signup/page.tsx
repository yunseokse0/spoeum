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
import { GolfCourseSelector } from '@/components/ui/GolfCourseSelector';
import { 
  User, 
  Mail, 
  Phone,
  MapPin,
  Briefcase,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Star,
  Award
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

interface CaddySignupForm extends SignupFormData {
  licenseNumber: string;
  career: number;
  specializations: string[];
  availableRegions: string[];
  hourlyRate: number;
  profileImage?: File;
  selectedGolfCourses: string[];
  pendingGolfCourse?: string;
  freelancer: boolean;
}

const specializations = [
  '코스 관리', '그린 리딩', '클럽 추천', '코스 전략',
  '심리 코칭', '기술 분석', '라운드 매니지먼트', '경기 분석'
];

const regions = [
  '서울', '경기', '인천', '강원', '충북', '충남',
  '전북', '전남', '경북', '경남', '제주', '부산',
  '대구', '광주', '대전', '울산'
];

export default function CaddySignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedGolfCourses, setSelectedGolfCourses] = useState<string[]>([]);
  const [pendingGolfCourse, setPendingGolfCourse] = useState<string | null>(null);
  const [freelancer, setFreelancer] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CaddySignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: 'caddy',
      specializations: [],
      availableRegions: [],
      selectedGolfCourses: [],
      freelancer: false
    }
  });

  const onSubmit = async (data: CaddySignupForm) => {
    // 골프장 선택 검증
    if (!freelancer && selectedGolfCourses.length === 0) {
      toast.error('소속 골프장을 선택하거나 프리랜서 옵션을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: 실제 API 호출
      const mockUser = {
        id: '1',
        email: data.email,
        name: data.name,
        phone: data.phone,
        userType: 'caddy' as const,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setAuth(mockUser, 'mock-token');
      toast.success('캐디 회원가입이 완료되었습니다!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecializationToggle = (specialization: string) => {
    const newSpecializations = selectedSpecializations.includes(specialization)
      ? selectedSpecializations.filter(s => s !== specialization)
      : [...selectedSpecializations, specialization];
    
    setSelectedSpecializations(newSpecializations);
    setValue('specializations', newSpecializations);
  };

  const handleRegionToggle = (region: string) => {
    const newRegions = selectedRegions.includes(region)
      ? selectedRegions.filter(r => r !== region)
      : [...selectedRegions, region];
    
    setSelectedRegions(newRegions);
    setValue('availableRegions', newRegions);
  };

  const handleGolfCourseChange = (courses: string[]) => {
    setSelectedGolfCourses(courses);
    setValue('selectedGolfCourses', courses);
  };

  const handlePendingCourseChange = (pendingCourse: string | null) => {
    setPendingGolfCourse(pendingCourse);
    setValue('pendingGolfCourse', pendingCourse || undefined);
  };

  const handleFreelancerChange = (freelancer: boolean) => {
    setFreelancer(freelancer);
    setValue('freelancer', freelancer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            캐디 회원가입
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            전문적인 골프 캐디로 활동하세요
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 기본 정보 */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  기본 정보
                </h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="이름"
                  placeholder="이름을 입력하세요"
                  leftIcon={<User className="h-5 w-5 text-blue-400" />}
                  error={errors.name?.message}
                  {...register('name', { required: '이름은 필수입니다.' })}
                />
                <Input
                  label="라이센스 번호"
                  placeholder="캐디 라이센스 번호"
                  leftIcon={<Award className="h-5 w-5 text-blue-400" />}
                  error={errors.licenseNumber?.message}
                  {...register('licenseNumber', { required: '라이센스 번호는 필수입니다.' })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="caddy@example.com"
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
              </div>
            </CardBody>
          </Card>

          {/* 전문 분야 */}
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                  전문 분야
                </h2>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                자신의 전문 분야를 선택해주세요 (복수 선택 가능)
              </p>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {specializations.map((specialization) => (
                  <button
                    key={specialization}
                    type="button"
                    onClick={() => handleSpecializationToggle(specialization)}
                    className={`
                      p-3 rounded-lg text-sm font-medium transition-colors
                      ${selectedSpecializations.includes(specialization)
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-2 border-purple-500'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-purple-300'
                      }
                    `}
                  >
                    {specialization}
                  </button>
                ))}
              </div>
              {selectedSpecializations.length === 0 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  최소 하나의 전문 분야를 선택해주세요.
                </p>
              )}
            </CardBody>
          </Card>

          {/* 가능 지역 */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                  가능 지역
                </h2>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                활동 가능한 지역을 선택해주세요 (복수 선택 가능)
              </p>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => handleRegionToggle(region)}
                    className={`
                      p-2 rounded-lg text-sm font-medium transition-colors
                      ${selectedRegions.includes(region)
                        ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-2 border-orange-500'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-orange-300'
                      }
                    `}
                  >
                    {region}
                  </button>
                ))}
              </div>
              {selectedRegions.length === 0 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  최소 하나의 가능 지역을 선택해주세요.
                </p>
              )}
            </CardBody>
          </Card>

          {/* 골프장 선택 */}
          <GolfCourseSelector
            selectedCourses={selectedGolfCourses}
            onSelectionChange={handleGolfCourseChange}
            onPendingCourseChange={handlePendingCourseChange}
            freelancer={freelancer}
            onFreelancerChange={handleFreelancerChange}
            maxSelections={5}
          />

          {/* 경력 및 요금 */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-green-900 dark:text-green-100">
                  경력 및 요금
                </h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="캐디 경력 (년)"
                  type="number"
                  placeholder="0"
                  min="0"
                  leftIcon={<Star className="h-5 w-5 text-green-400" />}
                  error={errors.career?.message}
                  {...register('career', { 
                    required: '경력은 필수입니다.',
                    valueAsNumber: true,
                    min: { value: 0, message: '경력은 0년 이상이어야 합니다.' }
                  })}
                />
                <Input
                  label="시간당 요금 (원)"
                  type="number"
                  placeholder="50000"
                  min="0"
                  leftIcon={<Award className="h-5 w-5 text-green-400" />}
                  error={errors.hourlyRate?.message}
                  {...register('hourlyRate', { 
                    required: '시간당 요금은 필수입니다.',
                    valueAsNumber: true,
                    min: { value: 0, message: '시간당 요금은 0원 이상이어야 합니다.' }
                  })}
                />
              </div>
            </CardBody>
          </Card>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            loading={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl shadow-lg"
            leftIcon={<CheckCircle className="h-5 w-5" />}
          >
            캐디 회원가입 완료
          </Button>
        </form>

        {/* 로그인 링크 */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
