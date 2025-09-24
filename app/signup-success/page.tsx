'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GolfLogoWithText } from '@/components/ui/GolfLogo';
import { useThemeStore } from '@/store/useThemeStore';
import { CheckCircle, ArrowRight, Home, User } from 'lucide-react';

const USER_TYPE_LABELS = {
  caddy: '캐디',
  tour_pro: '투어프로',
  amateur: '아마추어',
  agency: '에이전시',
  sponsor: '스폰서'
};

function SignupSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useThemeStore();
  const [userType, setUserType] = useState<string>('');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setUserType(type);
    }
  }, [searchParams]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoToProfile = () => {
    router.push('/profile');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-blue-50'}`}>
      {/* 다크테마 토글 버튼 */}
      <div className="absolute top-4 right-4">
        <ThemeToggle variant="button" />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-center mb-8">
          <GolfLogoWithText />
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              
              <CardTitle className="text-3xl font-bold text-green-600 mb-4">
                회원가입 완료!
              </CardTitle>
              
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {userType && USER_TYPE_LABELS[userType as keyof typeof USER_TYPE_LABELS]} 회원가입이 성공적으로 완료되었습니다.
              </p>
              
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                스포이음에서 새로운 골프 여정을 시작해보세요!
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 다음 단계 안내 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  다음 단계
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• 프로필을 완성해주세요</li>
                  <li>• 이메일 인증을 완료해주세요</li>
                  <li>• 서비스 이용 약관에 동의해주세요</li>
                  {userType === 'caddy' && (
                    <>
                      <li>• 캐디 자격증을 업로드해주세요</li>
                      <li>• 경력 증명서를 제출해주세요</li>
                    </>
                  )}
                  {userType === 'tour_pro' && (
                    <>
                      <li>• 협회 자격을 인증해주세요</li>
                      <li>• 커리어 정보를 입력해주세요</li>
                    </>
                  )}
                </ul>
              </div>

              {/* 액션 버튼들 */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoToProfile}
                  variant="primary"
                  size="lg"
                  className="w-full py-3 text-lg"
                >
                  <User className="h-5 w-5 mr-2" />
                  프로필 완성하기
                </Button>
                
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  size="lg"
                  className="w-full py-3 text-lg"
                >
                  <Home className="h-5 w-5 mr-2" />
                  홈으로 이동
                </Button>
              </div>

              {/* 추가 정보 */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>
                  문의사항이 있으시면{' '}
                  <a href="mailto:support@spoeum.com" className="text-green-600 hover:text-green-700">
                    support@spoeum.com
                  </a>
                  으로 연락해주세요.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SignupSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <SignupSuccessContent />
    </Suspense>
  );
}
