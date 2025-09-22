'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Briefcase, Trophy, Users, Building2, DollarSign, ArrowRight } from 'lucide-react';
import { GolfLogoWithText } from '@/components/ui/GolfLogo';
import { useThemeStore } from '@/store/useThemeStore';

type UserType = 'caddy' | 'tour_pro' | 'amateur' | 'agency' | 'sponsor';

const USER_TYPES = [
  {
    type: 'caddy' as UserType,
    title: '캐디',
    description: '프로 골퍼들과 함께할 캐디가 되어보세요',
    icon: Briefcase,
    color: 'bg-blue-500',
    features: ['골프장 소속', '프리랜서 활동', '시간당 요금 설정', '전문 분야 선택']
  },
  {
    type: 'tour_pro' as UserType,
    title: '투어프로',
    description: 'KLPGA/KPGA 정회원이신가요?',
    icon: Trophy,
    color: 'bg-yellow-500',
    features: ['협회 자동 인증', '자동 커리어 생성', '캐디 매칭', '스폰서 연계']
  },
  {
    type: 'amateur' as UserType,
    title: '아마추어',
    description: '프로 캐디와 함께 골프 실력을 향상시켜보세요',
    icon: Users,
    color: 'bg-green-500',
    features: ['핸디캡 관리', '레슨 예약', '골프장 추천', '실력 향상']
  },
  {
    type: 'agency' as UserType,
    title: '에이전시',
    description: '골프 관련 사업을 하고 계신가요?',
    icon: Building2,
    color: 'bg-purple-500',
    features: ['선수 매니지먼트', '계약 협상', '스폰서십 연계', '이벤트 기획']
  },
  {
    type: 'sponsor' as UserType,
    title: '스폰서',
    description: '골프 선수 스폰서십을 제공하고 싶어요',
    icon: DollarSign,
    color: 'bg-orange-500',
    features: ['브랜드 노출', '선수 스폰서십', '대회 스폰서십', '마케팅 효과']
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-blue-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-center mb-8">
          <GolfLogoWithText />
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-600 mb-4">
                회원가입
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                스포이음에 오신 것을 환영합니다
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                어떤 역할로 스포이음에 참여하시나요?
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {USER_TYPES.map((userType) => {
                  const Icon = userType.icon;
                  const isSelected = selectedType === userType.type;
                  
                  return (
                    <div
                      key={userType.type}
                      className={`relative cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'transform scale-105 shadow-lg' 
                          : 'hover:transform hover:scale-102 hover:shadow-md'
                      }`}
                      onClick={() => handleTypeSelect(userType.type)}
                    >
                      <Card className={`h-full border-2 ${
                        isSelected 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                      }`}>
                        <CardContent className="p-6">
                          {/* 아이콘 */}
                          <div className={`w-16 h-16 rounded-full ${userType.color} flex items-center justify-center mb-4 mx-auto`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>

                          {/* 제목 */}
                          <h3 className="text-xl font-bold text-center mb-2">
                            {userType.title}
                          </h3>

                          {/* 설명 */}
                          <p className="text-gray-600 dark:text-gray-400 text-center mb-4 text-sm">
                            {userType.description}
                          </p>

                          {/* 특징 */}
                          <ul className="space-y-2">
                            {userType.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {/* 선택 표시 */}
                          {isSelected && (
                            <div className="absolute top-4 right-4">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
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
                  <Button
                    onClick={handleContinue}
                    variant="primary"
                    size="lg"
                    className="px-8 py-3 text-lg"
                  >
                    {USER_TYPES.find(t => t.type === selectedType)?.title} 회원가입 계속하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* 로그인 링크 */}
              <div className="text-center mt-8">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}