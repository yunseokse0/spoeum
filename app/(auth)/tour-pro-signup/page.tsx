'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PlayerCareerCard } from '@/components/ui/PlayerCareerCard';
import { 
  Trophy, 
  User, 
  Mail, 
  Phone,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  FileText,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { PlayerInfo, GolfAssociation } from '@/types';
import toast from 'react-hot-toast';

const tourProSignupSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  confirmPassword: z.string(),
  association: z.enum(['KLPGA', 'KPGA']),
  memberNumber: z.string().min(1, '회원번호를 입력해주세요'),
  termsAgreed: z.boolean().refine(val => val === true, '이용약관에 동의해주세요'),
  privacyAgreed: z.boolean().refine(val => val === true, '개인정보처리방침에 동의해주세요'),
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

type TourProSignupFormData = z.infer<typeof tourProSignupSchema>;

export default function TourProSignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [showCareerCard, setShowCareerCard] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TourProSignupFormData>({
    resolver: zodResolver(tourProSignupSchema)
  });

  const watchedAssociation = watch('association');
  const watchedMemberNumber = watch('memberNumber');

  // 회원번호 입력 시 자동으로 선수 정보 검색
  useEffect(() => {
    if (watchedAssociation && watchedMemberNumber && watchedMemberNumber.length >= 5) {
      handlePlayerSearch();
    }
  }, [watchedAssociation, watchedMemberNumber]);

  const handlePlayerSearch = async () => {
    if (!watchedAssociation || !watchedMemberNumber) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/player/mock/${watchedAssociation}/${watchedMemberNumber}`);
      const data = await response.json();

      if (data.success && data.data) {
        setPlayerInfo(data.data);
        setShowCareerCard(true);
        
        // 자동으로 폼 필드 채우기
        setValue('name', data.data.name);
        
        toast.success('선수 정보를 성공적으로 불러왔습니다!');
      } else {
        setPlayerInfo(null);
        setShowCareerCard(false);
        toast.error('해당 회원번호의 선수 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('선수 정보 검색 오류:', error);
      toast.error('선수 정보 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = async (data: TourProSignupFormData) => {
    if (!playerInfo) {
      toast.error('선수 정보를 먼저 검색해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userType: 'tour_pro',
          playerInfo: playerInfo,
          profileImage: playerInfo.profileImage,
          gender: watchedAssociation === 'KLPGA' ? 'female' : 'male'
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('회원가입이 완료되었습니다!');
        setAuth(result.data.user, result.data.token);
        router.push('/dashboard');
      } else {
        toast.error(result.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      toast.error('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-green-50 via-white to-golf-sky-50 dark:from-golf-dark-900 dark:via-golf-dark-800 dark:to-golf-dark-900">
      {/* 골프장 배너 */}
      <div className="relative h-48 bg-gradient-to-r from-golf-green-600 to-golf-green-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            <div className="text-4xl mb-2">🏆</div>
            <h1 className="text-2xl font-display font-bold">투어프로 회원가입</h1>
            <p className="text-sm opacity-90">KLPGA/KPGA 정회원 인증</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 회원가입 폼 */}
          <Card className="border-golf-green-200 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-golf-green-500 to-golf-green-600 text-white">
              <h2 className="text-xl font-semibold">기본 정보</h2>
            </CardHeader>
            <CardBody className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 협회 및 회원번호 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <Trophy className="w-4 h-4 inline mr-2" />
                      협회
                    </label>
                    <select
                      {...register('association')}
                      className="w-full px-3 py-2 border border-golf-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golf-green-500"
                    >
                      <option value="">협회를 선택하세요</option>
                      <option value="KLPGA">KLPGA (한국여자프로골프협회)</option>
                      <option value="KPGA">KPGA (한국프로골프협회)</option>
                    </select>
                    {errors.association && (
                      <p className="text-red-500 text-xs mt-1">{errors.association.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      회원번호
                    </label>
                    <div className="relative">
                      <Input
                        {...register('memberNumber')}
                        placeholder="회원번호를 입력하세요"
                        className="border-golf-green-300 focus:border-golf-green-500 pr-10"
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-4 h-4 animate-spin text-golf-green-600" />
                        </div>
                      )}
                    </div>
                    {errors.memberNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.memberNumber.message}</p>
                    )}
                  </div>
                </div>

                {/* 자동 검색 안내 */}
                {watchedAssociation && watchedMemberNumber && (
                  <div className="p-4 bg-golf-sky-50 border border-golf-sky-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-golf-sky-600" />
                      <span className="text-sm text-golf-sky-700">
                        회원번호를 입력하면 자동으로 선수 정보를 검색합니다
                      </span>
                    </div>
                  </div>
                )}

                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      이름
                    </label>
                    <Input
                      {...register('name')}
                      placeholder="이름을 입력하세요"
                      className="border-golf-green-300 focus:border-golf-green-500"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      이메일
                    </label>
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="이메일을 입력하세요"
                      className="border-golf-green-300 focus:border-golf-green-500"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      전화번호
                    </label>
                    <Input
                      {...register('phone')}
                      placeholder="010-1234-5678"
                      className="border-golf-green-300 focus:border-golf-green-500"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      성별
                    </label>
                    <Input
                      value={watchedAssociation === 'KLPGA' ? '여성' : watchedAssociation === 'KPGA' ? '남성' : ''}
                      disabled
                      className="border-golf-green-300 bg-gray-100"
                    />
                    <p className="text-xs text-golf-dark-500 mt-1">
                      협회에 따라 자동 결정됩니다
                    </p>
                  </div>
                </div>

                {/* 비밀번호 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <Shield className="w-4 h-4 inline mr-2" />
                      비밀번호
                    </label>
                    <Input
                      {...register('password')}
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      className="border-golf-green-300 focus:border-golf-green-500"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <Shield className="w-4 h-4 inline mr-2" />
                      비밀번호 확인
                    </label>
                    <Input
                      {...register('confirmPassword')}
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      className="border-golf-green-300 focus:border-golf-green-500"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* 약관 동의 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      {...register('termsAgreed')}
                      type="checkbox"
                      className="rounded border-golf-green-300"
                    />
                    <span className="text-sm text-golf-dark-600">
                      <span className="text-golf-green-600 cursor-pointer hover:underline">서비스 이용약관</span>에 동의합니다 (필수)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      {...register('privacyAgreed')}
                      type="checkbox"
                      className="rounded border-golf-green-300"
                    />
                    <span className="text-sm text-golf-dark-600">
                      <span className="text-golf-green-600 cursor-pointer hover:underline">개인정보 처리방침</span>에 동의합니다 (필수)
                    </span>
                  </div>
                </div>

                {/* 제출 버튼 */}
                <Button
                  type="submit"
                  disabled={isLoading || !playerInfo}
                  className="w-full bg-golf-green-600 hover:bg-golf-green-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      회원가입 중...
                    </>
                  ) : (
                    '회원가입 완료'
                  )}
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* 선수 정보 및 커리어 */}
          <div className="space-y-6">
            {showCareerCard && playerInfo && (
              <PlayerCareerCard 
                playerInfo={playerInfo}
                className="border-golf-sky-200 shadow-lg"
              />
            )}

            {/* 인증 안내 */}
            <Card className="border-golf-sand-200 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-golf-sand-500 to-golf-sand-600 text-white">
                <h3 className="text-lg font-semibold">투어프로 인증 안내</h3>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-golf-dark-700">자동 인증</h4>
                      <p className="text-sm text-golf-dark-600">
                        KLPGA/KPGA 회원번호를 입력하면 자동으로 선수 정보를 검증합니다
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-golf-dark-700">커리어 자동 생성</h4>
                      <p className="text-sm text-golf-dark-600">
                        선수 정보가 확인되면 경력과 성과가 자동으로 등록됩니다
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-golf-dark-700">즉시 매칭</h4>
                      <p className="text-sm text-golf-dark-600">
                        가입 즉시 캐디 매칭 서비스를 이용할 수 있습니다
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* 로그인 링크 */}
            <div className="text-center">
              <p className="text-golf-dark-600">
                이미 계정이 있으신가요?{' '}
                <Button variant="link" className="text-golf-green-600 hover:text-golf-green-700">
                  로그인하기
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
