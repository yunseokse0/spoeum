'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Briefcase, Trophy, Users, Building2, DollarSign, ArrowRight, Sparkles, Shield, Clock, MapPin, Star, CheckCircle } from 'lucide-react';
import { GolfLogoWithText } from '@/components/ui/GolfLogo';
import { useThemeStore } from '@/store/useThemeStore';

type UserType = 'caddy' | 'tour_pro' | 'amateur' | 'agency' | 'sponsor';

const USER_TYPES = [
  {
    type: 'caddy' as UserType,
    title: '캐디',
    description: '프로 골퍼들과 함께할 캐디가 되어보세요',
    icon: Briefcase,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-700',
    features: ['골프장 소속', '프리랜서 활동', '시간당 요금 설정', '전문 분야 선택'],
    benefits: ['안정적인 수입', '유연한 근무', '전문성 향상', '네트워킹 기회'],
    popular: false
  },
  {
    type: 'tour_pro' as UserType,
    title: '투어프로',
    description: 'KLPGA/KPGA 정회원이신가요?',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-700',
    features: ['협회 자동 인증', '자동 커리어 생성', '캐디 매칭', '스폰서 연계'],
    benefits: ['프리미엄 서비스', '전용 지원', '우선 매칭', '수익 최적화'],
    popular: true
  },
  {
    type: 'amateur' as UserType,
    title: '아마추어',
    description: '프로 캐디와 함께 골프 실력을 향상시켜보세요',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-700',
    features: ['핸디캡 관리', '레슨 예약', '골프장 추천', '실력 향상'],
    benefits: ['개인 맞춤 서비스', '실력 향상', '편리한 예약', '전문 가이드'],
    popular: false
  },
  {
    type: 'agency' as UserType,
    title: '에이전시',
    description: '골프 관련 사업을 하고 계신가요?',
    icon: Building2,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-700',
    features: ['선수 매니지먼트', '계약 협상', '스폰서십 연계', '이벤트 기획'],
    benefits: ['비즈니스 도구', '수익 창출', '네트워크 확장', '전문 지원'],
    popular: false
  },
  {
    type: 'sponsor' as UserType,
    title: '스폰서',
    description: '골프 선수 스폰서십을 제공하고 싶어요',
    icon: DollarSign,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-700',
    features: ['브랜드 노출', '선수 스폰서십', '대회 스폰서십', '마케팅 효과'],
    benefits: ['브랜드 인지도', '마케팅 ROI', '선수 연계', '비즈니스 성장'],
    popular: false
  }
];

export default function SignupPage() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleTypeSelect = (type: UserType) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (!selectedType) return;

    // 각 회원 타입별 전용 회원가입 페이지로 이동
    switch (selectedType) {
      case 'caddy':
        router.push('/caddy-signup');
        break;
      case 'tour_pro':
        router.push('/tour-pro-signup');
        break;
      case 'amateur':
        router.push('/amateur-signup');
        break;
      case 'agency':
        router.push('/agency-signup');
        break;
      case 'sponsor':
        router.push('/sponsor-signup');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-purple-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      {/* 다크테마 토글 버튼 */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle variant="button" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-center mb-12">
          <div className="text-center">
            <GolfLogoWithText />
            <div className="mt-4 flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-300">골프 커뮤니티의 새로운 시작</span>
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-green-600 mr-3" />
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  회원가입
                </CardTitle>
              </div>
              <p className="text-gray-300 text-xl mb-2">
                스포이음에 오신 것을 환영합니다
              </p>
              <p className="text-gray-400 text-base">
                어떤 역할로 스포이음에 참여하시나요?
              </p>
              <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>무료 가입</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>빠른 승인</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>전문 지원</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {USER_TYPES.map((userType) => {
                  const Icon = userType.icon;
                  const isSelected = selectedType === userType.type;
                  
                  return (
                    <div
                      key={userType.type}
                      className={`relative cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'transform scale-105 shadow-2xl' 
                          : 'hover:transform hover:scale-102 hover:shadow-xl'
                      }`}
                      onClick={() => handleTypeSelect(userType.type)}
                    >
                      {/* 인기 배지 */}
                      {userType.popular && (
                        <div className="absolute -top-3 -right-3 z-20">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            인기
                          </div>
                        </div>
                      )}

                      <Card className={`h-full border-2 transition-all duration-300 ${
                        isSelected 
                          ? `border-green-500 ${userType.bgColor} shadow-green-200 dark:shadow-green-900/50` 
                          : `border-gray-200 dark:border-gray-700 hover:${userType.borderColor} ${userType.bgColor}`
                      }`}>
                        <CardContent className="p-8">
                          {/* 아이콘 */}
                          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${userType.color} flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                            <Icon className="h-10 w-10 text-white" />
                          </div>

                          {/* 제목 */}
                          <h3 className="text-2xl font-bold text-center mb-3 text-gray-900 dark:text-white">
                            {userType.title}
                          </h3>

                          {/* 설명 */}
                          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-base leading-relaxed">
                            {userType.description}
                          </p>

                          {/* 특징 */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              주요 기능
                            </h4>
                            <ul className="space-y-2">
                              {userType.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3"></div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 혜택 */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                              <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                              혜택
                            </h4>
                            <ul className="space-y-2">
                              {userType.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-3"></div>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 선택 표시 */}
                          {isSelected && (
                            <div className="absolute top-4 right-4">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>

              {/* 계속하기 버튼 */}
              {selectedType && (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-1 rounded-2xl inline-block shadow-lg">
                    <Button
                      onClick={handleContinue}
                      variant="primary"
                      size="lg"
                      className="px-12 py-4 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-50 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                      {USER_TYPES.find(t => t.type === selectedType)?.title} 회원가입 시작하기
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    <Clock className="inline h-4 w-4 mr-1" />
                    가입 완료까지 약 3분 소요
                  </p>
                </div>
              )}

              {/* 로그인 링크 */}
              <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <p className="text-base text-gray-600 dark:text-gray-400">
                  이미 계정이 있으신가요?{' '}
                  <button
                    onClick={() => router.push('/login')}
                    className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors duration-200"
                  >
                    로그인하기
                  </button>
                </p>
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1 text-green-500" />
                    <span>보안 인증</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                    <span>전국 서비스</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-purple-500" />
                    <span>커뮤니티</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}