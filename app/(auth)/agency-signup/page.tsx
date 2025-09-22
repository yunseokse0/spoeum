'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Phone, Lock, Building2, FileText, Users, MapPin, Calendar } from 'lucide-react';
import { GolfLogoWithText } from '@/components/ui/GolfLogo';
import { useThemeStore } from '@/store/useThemeStore';

// 에이전시 전용 회원가입 스키마
const agencySignupSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  phone: z.string().regex(/^(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/, '올바른 휴대폰 번호 형식이 아닙니다.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  confirmPassword: z.string(),
  companyName: z.string().min(1, '회사명을 입력해주세요.'),
  businessNumber: z.string().min(1, '사업자등록번호를 입력해주세요.'),
  representativeName: z.string().min(1, '대표자명을 입력해주세요.'),
  companyAddress: z.string().min(1, '회사 주소를 입력해주세요.'),
  companyPhone: z.string().min(1, '회사 전화번호를 입력해주세요.'),
  establishedDate: z.string().min(1, '설립일을 입력해주세요.'),
  employeeCount: z.string().min(1, '직원 수를 입력해주세요.'),
  businessType: z.string().min(1, '업종을 선택해주세요.'),
  services: z.array(z.string()).min(1, '제공 서비스를 최소 1개 이상 선택해주세요.'),
  terms: z.boolean().refine(val => val === true, '이용약관에 동의해주세요.'),
  privacy: z.boolean().refine(val => val === true, '개인정보처리방침에 동의해주세요.')
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword']
});

type AgencySignupForm = z.infer<typeof agencySignupSchema>;

const BUSINESS_TYPES = [
  { value: 'golf_management', label: '골프 매니지먼트' },
  { value: 'event_planning', label: '이벤트 기획' },
  { value: 'talent_agency', label: '연예인 매니지먼트' },
  { value: 'sports_agency', label: '스포츠 에이전시' },
  { value: 'marketing', label: '마케팅 대행' },
  { value: 'other', label: '기타' }
];

const SERVICES = [
  { value: 'player_management', label: '선수 매니지먼트' },
  { value: 'contract_negotiation', label: '계약 협상' },
  { value: 'sponsorship', label: '스폰서십 연계' },
  { value: 'event_planning', label: '대회 기획' },
  { value: 'media_relations', label: '미디어 관계' },
  { value: 'financial_management', label: '재정 관리' },
  { value: 'career_planning', label: '커리어 플래닝' },
  { value: 'training_support', label: '트레이닝 지원' }
];

export default function AgencySignupPage() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<AgencySignupForm>({
    resolver: zodResolver(agencySignupSchema)
  });

  const onSubmit = async (data: AgencySignupForm) => {
    setIsLoading(true);
    try {
      // 에이전시 전용 회원가입 로직
      const agencyData = {
        ...data,
        userType: 'agency' as const,
        services: selectedServices,
        agencyInfo: {
          companyName: data.companyName,
          businessNumber: data.businessNumber,
          representativeName: data.representativeName,
          companyAddress: data.companyAddress,
          companyPhone: data.companyPhone,
          establishedDate: data.establishedDate,
          employeeCount: parseInt(data.employeeCount),
          businessType: data.businessType,
          services: selectedServices
        }
      };

      console.log('에이전시 회원가입 데이터:', agencyData);

      // API 호출 (실제 구현 시)
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(agencyData)
      // });

      // 성공 시 로그인 페이지로 이동 (회원가입 완료 메시지와 함께)
      alert('에이전시 회원가입이 완료되었습니다! 로그인해주세요.');
      router.push('/login?message=signup-success');
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-blue-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-center mb-8">
          <GolfLogoWithText />
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                <Building2 className="h-6 w-6" />
                에이전시 회원가입
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                골프 관련 사업을 하고 계신가요?
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 기본 정보 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    담당자 정보
                  </h3>

                  <Input
                    label="담당자 이름"
                    placeholder="담당자 이름을 입력하세요"
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                    error={errors.name?.message}
                    {...register('name')}
                  />

                  <Input
                    label="이메일"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <Input
                    label="전화번호"
                    type="tel"
                    placeholder="010-1234-5678 또는 01012345678"
                    leftIcon={<Phone className="h-5 w-5 text-gray-400" />}
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>

                {/* 회사 정보 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    회사 정보
                  </h3>

                  <Input
                    label="회사명"
                    placeholder="회사명을 입력하세요"
                    leftIcon={<Building2 className="h-5 w-5 text-gray-400" />}
                    error={errors.companyName?.message}
                    {...register('companyName')}
                  />

                  <Input
                    label="사업자등록번호"
                    placeholder="000-00-00000"
                    leftIcon={<FileText className="h-5 w-5 text-gray-400" />}
                    error={errors.businessNumber?.message}
                    {...register('businessNumber')}
                  />

                  <Input
                    label="대표자명"
                    placeholder="대표자명을 입력하세요"
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                    error={errors.representativeName?.message}
                    {...register('representativeName')}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      회사 주소
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="주소를 입력하세요"
                        {...register('companyAddress')}
                      />
                      <Button type="button" variant="outline" size="sm">
                        주소검색
                      </Button>
                    </div>
                    {errors.companyAddress && <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>}
                  </div>

                  <Input
                    label="회사 전화번호"
                    type="tel"
                    placeholder="02-1234-5678"
                    leftIcon={<Phone className="h-5 w-5 text-gray-400" />}
                    error={errors.companyPhone?.message}
                    {...register('companyPhone')}
                  />

                  <Input
                    label="설립일"
                    type="date"
                    leftIcon={<Calendar className="h-5 w-5 text-gray-400" />}
                    error={errors.establishedDate?.message}
                    {...register('establishedDate')}
                  />

                  <Input
                    label="직원 수"
                    type="number"
                    placeholder="10"
                    leftIcon={<Users className="h-5 w-5 text-gray-400" />}
                    error={errors.employeeCount?.message}
                    {...register('employeeCount')}
                  />
                </div>

                {/* 업종 및 서비스 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    업종 및 서비스
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      업종 *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      {...register('businessType')}
                    >
                      <option value="">업종을 선택하세요</option>
                      {BUSINESS_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      제공 서비스 * (복수 선택 가능)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {SERVICES.map(service => (
                        <div key={service.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${service.value}`}
                            checked={selectedServices.includes(service.value)}
                            onCheckedChange={() => handleServiceToggle(service.value)}
                          />
                          <label htmlFor={`service-${service.value}`} className="text-sm">
                            {service.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services.message}</p>}
                  </div>
                </div>

                {/* 비밀번호 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    보안 정보
                  </h3>

                  <Input
                    label="비밀번호"
                    type="password"
                    placeholder="8자 이상의 영문, 숫자, 특수문자 조합"
                    leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                    error={errors.password?.message}
                    {...register('password')}
                  />

                  <Input
                    label="비밀번호 확인"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                </div>

                {/* 약관 동의 */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      {...register('terms')}
                    />
                    <label htmlFor="terms" className="text-sm">
                      이용약관에 동의합니다 (필수)
                    </label>
                  </div>
                  {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privacy"
                      {...register('privacy')}
                    />
                    <label htmlFor="privacy" className="text-sm">
                      개인정보처리방침에 동의합니다 (필수)
                    </label>
                  </div>
                  {errors.privacy && <p className="text-red-500 text-sm">{errors.privacy.message}</p>}
                </div>

                {/* 회원가입 버튼 */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? '가입 중...' : '에이전시 회원가입'}
                </Button>

                {/* 로그인 링크 */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    이미 계정이 있으신가요?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      로그인
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
