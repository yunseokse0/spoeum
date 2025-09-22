'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Phone, Lock, Trophy, Target, Calendar, MapPin } from 'lucide-react';
import { GolfLogoWithText } from '@/components/ui/GolfLogo';
import { useThemeStore } from '@/store/useThemeStore';

// 아마추어 전용 회원가입 스키마
const amateurSignupSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  phone: z.string().regex(/^(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/, '올바른 휴대폰 번호 형식이 아닙니다.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  confirmPassword: z.string(),
  gender: z.enum(['male', 'female']).optional(),
  handicap: z.string().optional(),
  golfExperience: z.string().min(1, '골프 경력을 선택해주세요.'),
  preferredLocation: z.array(z.string()).optional(),
  availableDays: z.array(z.string()).optional(),
  preferredTime: z.string().optional(),
  budgetRange: z.string().optional(),
  specialRequests: z.string().optional(),
  terms: z.boolean().refine(val => val === true, '이용약관에 동의해주세요.'),
  privacy: z.boolean().refine(val => val === true, '개인정보처리방침에 동의해주세요.')
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword']
});

type AmateurSignupForm = z.infer<typeof amateurSignupSchema>;

const GOLF_EXPERIENCE = [
  { value: 'beginner', label: '초급 (1년 미만)' },
  { value: 'intermediate', label: '중급 (1-3년)' },
  { value: 'advanced', label: '고급 (3-5년)' },
  { value: 'expert', label: '전문가 (5년 이상)' }
];

const HANDICAP_RANGE = [
  { value: '0-10', label: '0-10 (싱글핸디캡)' },
  { value: '11-20', label: '11-20 (중급)' },
  { value: '21-30', label: '21-30 (초급)' },
  { value: '30+', label: '30+ (입문)' },
  { value: 'unknown', label: '모르겠음' }
];

const PREFERRED_LOCATIONS = [
  { value: 'seoul', label: '서울' },
  { value: 'gyeonggi', label: '경기' },
  { value: 'incheon', label: '인천' },
  { value: 'gangwon', label: '강원' },
  { value: 'jeju', label: '제주' },
  { value: 'busan', label: '부산' },
  { value: 'any', label: '지역 무관' }
];

const AVAILABLE_DAYS = [
  { value: 'weekday', label: '평일' },
  { value: 'weekend', label: '주말' },
  { value: 'both', label: '평일/주말 모두' }
];

const PREFERRED_TIME = [
  { value: 'morning', label: '오전 (6:00-12:00)' },
  { value: 'afternoon', label: '오후 (12:00-18:00)' },
  { value: 'evening', label: '저녁 (18:00 이후)' },
  { value: 'any', label: '시간 무관' }
];

const BUDGET_RANGE = [
  { value: '50k-100k', label: '5만원 - 10만원' },
  { value: '100k-200k', label: '10만원 - 20만원' },
  { value: '200k-300k', label: '20만원 - 30만원' },
  { value: '300k+', label: '30만원 이상' }
];

export default function AmateurSignupPage() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<AmateurSignupForm>({
    resolver: zodResolver(amateurSignupSchema)
  });

  const onSubmit = async (data: AmateurSignupForm) => {
    setIsLoading(true);
    try {
      // 아마추어 전용 회원가입 로직
      const amateurData = {
        ...data,
        userType: 'amateur' as const,
        preferredLocation: preferredLocations,
        availableDays,
        amateurInfo: {
          handicap: data.handicap,
          golfExperience: data.golfExperience,
          preferredLocation: preferredLocations,
          availableDays,
          preferredTime: data.preferredTime,
          budgetRange: data.budgetRange,
          specialRequests: data.specialRequests
        }
      };

      console.log('아마추어 회원가입 데이터:', amateurData);

      // API 호출 (실제 구현 시)
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(amateurData)
      // });

      // 성공 시 로그인 페이지로 이동 (회원가입 완료 메시지와 함께)
      alert('아마추어 회원가입이 완료되었습니다! 로그인해주세요.');
      router.push('/login?message=signup-success');
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationToggle = (location: string) => {
    setPreferredLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handleDayToggle = (day: string) => {
    setAvailableDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
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
                <Trophy className="h-6 w-6" />
                아마추어 회원가입
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                프로 캐디와 함께 골프 실력을 향상시켜보세요
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 기본 정보 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    기본 정보
                  </h3>

                  <Input
                    label="이름"
                    placeholder="이름을 입력하세요"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      성별 (선택사항)
                    </label>
                    <Select onValueChange={(value) => setValue('gender', value as 'male' | 'female')}>
                      <SelectTrigger>
                        <SelectValue placeholder="성별을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">남성</SelectItem>
                        <SelectItem value="female">여성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 골프 정보 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    골프 정보
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      골프 경력 *
                    </label>
                    <Select onValueChange={(value) => setValue('golfExperience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="골프 경력을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {GOLF_EXPERIENCE.map(exp => (
                          <SelectItem key={exp.value} value={exp.value}>
                            {exp.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.golfExperience && <p className="text-red-500 text-sm mt-1">{errors.golfExperience.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      핸디캡 (선택사항)
                    </label>
                    <Select onValueChange={(value) => setValue('handicap', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="핸디캡을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {HANDICAP_RANGE.map(handicap => (
                          <SelectItem key={handicap.value} value={handicap.value}>
                            {handicap.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 선호 지역 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    선호 지역
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      희망 지역 (복수 선택 가능)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PREFERRED_LOCATIONS.map(location => (
                        <div key={location.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`location-${location.value}`}
                            checked={preferredLocations.includes(location.value)}
                            onCheckedChange={() => handleLocationToggle(location.value)}
                          />
                          <label htmlFor={`location-${location.value}`} className="text-sm">
                            {location.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 이용 가능 시간 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    이용 가능 시간
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      이용 가능 요일
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {AVAILABLE_DAYS.map(day => (
                        <div key={day.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day.value}`}
                            checked={availableDays.includes(day.value)}
                            onCheckedChange={() => handleDayToggle(day.value)}
                          />
                          <label htmlFor={`day-${day.value}`} className="text-sm">
                            {day.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      선호 시간대
                    </label>
                    <Select onValueChange={(value) => setValue('preferredTime', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="선호 시간대를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREFERRED_TIME.map(time => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      예산 범위
                    </label>
                    <Select onValueChange={(value) => setValue('budgetRange', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="예산 범위를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_RANGE.map(budget => (
                          <SelectItem key={budget.value} value={budget.value}>
                            {budget.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 특별 요청사항 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600">
                    특별 요청사항
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      추가 요청사항 (선택사항)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows={3}
                      placeholder="캐디에게 전달하고 싶은 특별한 요청사항이 있다면 입력해주세요..."
                      {...register('specialRequests')}
                    />
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
                  {isLoading ? '가입 중...' : '아마추어 회원가입'}
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
