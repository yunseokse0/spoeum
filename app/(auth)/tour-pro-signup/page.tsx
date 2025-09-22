'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Phone, Lock, Trophy, Search, Calendar, Award, FileText, Users } from 'lucide-react';
import { GolfLogoWithText } from '@/components/ui/GolfLogo';
import { PlayerCareerCard } from '@/components/ui/PlayerCareerCard';
import { useThemeStore } from '@/store/useThemeStore';

// 투어프로 전용 회원가입 스키마
const tourProSignupSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  phone: z.string().regex(/^(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/, '올바른 휴대폰 번호 형식이 아닙니다.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  confirmPassword: z.string(),
  association: z.enum(['KLPGA', 'KPGA'], { required_error: '소속 협회를 선택해주세요.' }),
  memberId: z.string().min(1, '회원번호를 입력해주세요.'),
  turningProDate: z.string().min(1, '프로 전향일을 입력해주세요.'),
  currentRanking: z.string().optional(),
  preferredCaddyType: z.array(z.string()).optional(),
  tournamentExperience: z.array(z.string()).min(1, '참가 경험이 있는 대회를 최소 1개 이상 선택해주세요.'),
  specialSkills: z.array(z.string()).optional(),
  terms: z.boolean().refine(val => val === true, '이용약관에 동의해주세요.'),
  privacy: z.boolean().refine(val => val === true, '개인정보처리방침에 동의해주세요.')
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword']
});

type TourProSignupForm = z.infer<typeof tourProSignupSchema>;

const TOURNAMENT_EXPERIENCE = [
  { value: 'klpga_tour', label: 'KLPGA 투어' },
  { value: 'kpga_tour', label: 'KPGA 투어' },
  { value: 'korean_open', label: '한국 오픈' },
  { value: 'asia_tour', label: '아시아 투어' },
  { value: 'lpga_tour', label: 'LPGA 투어' },
  { value: 'pga_tour', label: 'PGA 투어' },
  { value: 'major_championship', label: '메이저 챔피언십' },
  { value: 'olympic', label: '올림픽' }
];

const PREFERRED_CADDY_TYPE = [
  { value: 'experienced', label: '경험 많은 캐디' },
  { value: 'young', label: '젊은 캐디' },
  { value: 'local', label: '현지 캐디' },
  { value: 'specialized', label: '전문 캐디' },
  { value: 'bilingual', label: '외국어 가능 캐디' }
];

const SPECIAL_SKILLS = [
  { value: 'long_drive', label: '롱 드라이브' },
  { value: 'short_game', label: '숏 게임' },
  { value: 'putting', label: '퍼팅' },
  { value: 'course_management', label: '코스 관리' },
  { value: 'mental_game', label: '멘탈 게임' },
  { value: 'recovery_shot', label: '리커버리 샷' }
];

export default function TourProSignupPage() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const [playerInfo, setPlayerInfo] = useState<any>(null);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false);
  const [selectedCaddyTypes, setSelectedCaddyTypes] = useState<string[]>([]);
  const [selectedTournaments, setSelectedTournaments] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<TourProSignupForm>({
    resolver: zodResolver(tourProSignupSchema)
  });

  const association = watch('association');
  const memberId = watch('memberId');

  // 선수 정보 자동 조회
  useEffect(() => {
    if (association && memberId && memberId.length >= 5) {
      fetchPlayerInfo(association, memberId);
    }
  }, [association, memberId]);

  const fetchPlayerInfo = async (assoc: string, id: string) => {
    setIsLoadingPlayer(true);
    try {
      const response = await fetch(`/api/player/${assoc}/${id}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setPlayerInfo(data.data);
        // 자동으로 이름 채우기
        setValue('name', data.data.name);
      } else {
        setPlayerInfo(null);
      }
    } catch (error) {
      console.error('선수 정보 조회 오류:', error);
      setPlayerInfo(null);
    } finally {
      setIsLoadingPlayer(false);
    }
  };

  const onSubmit = async (data: TourProSignupForm) => {
    setIsLoading(true);
    try {
      // 투어프로 전용 회원가입 로직
      const tourProData = {
        ...data,
        userType: 'tour_pro' as const,
        // gender: data.association === 'KLPGA' ? 'female' : 'male', // 협회에 따라 성별 자동 결정
        preferredCaddyType: selectedCaddyTypes,
        tournamentExperience: selectedTournaments,
        specialSkills: selectedSkills,
        tourProInfo: {
          association: data.association,
          memberId: data.memberId,
          turningProDate: data.turningProDate,
          currentRanking: parseInt(data.currentRanking || '0'),
          preferredCaddyType: selectedCaddyTypes,
          tournamentExperience: selectedTournaments,
          specialSkills: selectedSkills,
          playerInfo: playerInfo
        }
      };

      console.log('투어프로 회원가입 데이터:', tourProData);

      // API 호출 (실제 구현 시)
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(tourProData)
      // });

      // 성공 시 로그인 페이지로 이동 (회원가입 완료 메시지와 함께)
      alert('투어프로 회원가입이 완료되었습니다! 로그인해주세요.');
      router.push('/login?message=signup-success');
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaddyTypeToggle = (type: string) => {
    setSelectedCaddyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleTournamentToggle = (tournament: string) => {
    setSelectedTournaments(prev => 
      prev.includes(tournament) 
        ? prev.filter(t => t !== tournament)
        : [...prev, tournament]
    );
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-blue-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-center mb-8">
          <GolfLogoWithText />
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6" />
                투어프로 회원가입
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                프로 골퍼로서 스포이음에 오신 것을 환영합니다
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 왼쪽: 기본 정보 */}
                  <div className="space-y-6">
                    {/* 협회 및 회원번호 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        프로 정보
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          소속 협회 *
                        </label>
                        <Select onValueChange={(value) => setValue('association', value as 'KLPGA' | 'KPGA')}>
                          <SelectTrigger>
                            <SelectValue placeholder="소속 협회를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="KLPGA">KLPGA (한국여자프로골프협회)</SelectItem>
                            <SelectItem value="KPGA">KPGA (한국프로골프협회)</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.association && <p className="text-red-500 text-sm mt-1">{errors.association.message}</p>}
                      </div>

                      <Input
                        label="회원번호"
                        placeholder="회원번호를 입력하세요"
                        leftIcon={<FileText className="h-5 w-5 text-gray-400" />}
                        error={errors.memberId?.message}
                        {...register('memberId')}
                      />

                      {isLoadingPlayer && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Search className="h-4 w-4 animate-spin" />
                          <span className="text-sm">선수 정보 조회 중...</span>
                        </div>
                      )}

                      {playerInfo && (
                        <div className="mt-4">
                          <PlayerCareerCard player={playerInfo} />
                        </div>
                      )}
                    </div>

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

                      <Input
                        label="프로 전향일"
                        type="date"
                        leftIcon={<Calendar className="h-5 w-5 text-gray-400" />}
                        error={errors.turningProDate?.message}
                        {...register('turningProDate')}
                      />

                      <Input
                        label="현재 랭킹 (선택사항)"
                        type="number"
                        placeholder="1"
                        leftIcon={<Award className="h-5 w-5 text-gray-400" />}
                        error={errors.currentRanking?.message}
                        {...register('currentRanking')}
                      />
                    </div>
                  </div>

                  {/* 오른쪽: 선호 설정 */}
                  <div className="space-y-6">
                    {/* 선호 캐디 타입 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        선호 캐디 타입
                      </h3>

                      <div className="grid grid-cols-1 gap-2">
                        {PREFERRED_CADDY_TYPE.map(type => (
                          <div key={type.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`caddy-${type.value}`}
                              checked={selectedCaddyTypes.includes(type.value)}
                              onCheckedChange={() => handleCaddyTypeToggle(type.value)}
                            />
                            <label htmlFor={`caddy-${type.value}`} className="text-sm">
                              {type.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 대회 경험 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        대회 경험
                      </h3>

                      <div className="grid grid-cols-1 gap-2">
                        {TOURNAMENT_EXPERIENCE.map(tournament => (
                          <div key={tournament.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tournament-${tournament.value}`}
                              checked={selectedTournaments.includes(tournament.value)}
                              onCheckedChange={() => handleTournamentToggle(tournament.value)}
                            />
                            <label htmlFor={`tournament-${tournament.value}`} className="text-sm">
                              {tournament.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.tournamentExperience && <p className="text-red-500 text-sm mt-1">{errors.tournamentExperience.message}</p>}
                    </div>

                    {/* 전문 분야 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        전문 분야
                      </h3>

                      <div className="grid grid-cols-1 gap-2">
                        {SPECIAL_SKILLS.map(skill => (
                          <div key={skill.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`skill-${skill.value}`}
                              checked={selectedSkills.includes(skill.value)}
                              onCheckedChange={() => handleSkillToggle(skill.value)}
                            />
                            <label htmlFor={`skill-${skill.value}`} className="text-sm">
                              {skill.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 비밀번호 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    보안 정보
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {isLoading ? '가입 중...' : '투어프로 회원가입'}
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