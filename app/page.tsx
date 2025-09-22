'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { GolfLogoWithText } from '@/components/ui/GolfLogo';
import { 
  Users, 
  Target, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Smartphone,
  Zap,
  Heart
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, userType } = useAuthStore();

  useEffect(() => {
    // 로그인된 사용자는 대시보드로 리다이렉트
    if (isAuthenticated) {
      if (userType === 'agency') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, userType, router]);

  const features = [
    {
      icon: Users,
      title: '스마트 매칭',
      description: '전문적인 매칭 시스템으로 최적의 캐디와 골퍼를 연결합니다.',
    },
    {
      icon: Target,
      title: '정확한 매칭',
      description: '경력, 전문 분야, 지역 등을 고려한 정확한 매칭을 제공합니다.',
    },
    {
      icon: Shield,
      title: '안전한 거래',
      description: '검증된 사용자와 안전한 계약 시스템으로 보호받으세요.',
    },
    {
      icon: Star,
      title: '높은 품질',
      description: '엄선된 캐디와 투어프로만 등록하여 최고의 서비스를 제공합니다.',
    },
  ];

  const userTypes = [
    {
      type: 'caddy',
      title: '캐디',
      description: '전문 캐디로 등록하여 다양한 골퍼와 매칭되세요.',
      icon: Users,
      color: 'primary',
    },
    {
      type: 'tour_pro',
      title: '투어프로',
      description: '투어프로 골퍼로 등록하여 최고의 캐디를 찾으세요.',
      icon: Target,
      color: 'success',
    },
    {
      type: 'amateur',
      title: '아마추어',
      description: '아마추어 골퍼로 등록하여 경험 있는 캐디와 함께하세요.',
      icon: Star,
      color: 'warning',
    },
    {
      type: 'agency',
      title: '에이전시',
      description: '골프 관련 사업자로 등록하여 비즈니스 기회를 확장하세요.',
      icon: Globe,
      color: 'secondary',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400';
      case 'success':
        return 'bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400';
      case 'warning':
        return 'bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400';
      case 'secondary':
        return 'bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <GolfLogoWithText size="md" />
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/login')}
              >
                로그인
              </Button>
              <Button
                onClick={() => router.push('/signup')}
              >
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            골프 캐디와 골퍼를
            <br />
            <span className="text-primary-600 dark:text-primary-400">
              스마트하게 연결
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            전문적인 매칭 시스템으로 최적의 캐디와 골퍼를 찾아보세요.
            안전하고 편리한 골프 경험을 제공합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              지금 시작하기
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/login')}
            >
              로그인
            </Button>
          </div>
        </div>
      </section>


      {/* 사용자 타입 섹션 */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              누구나 참여할 수 있습니다
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              다양한 사용자 타입으로 스포이음에 참여하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userTypes.map((userType, index) => {
              const Icon = userType.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardBody className="p-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${getColorClasses(userType.color)}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {userType.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {userType.description}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/signup')}
                    >
                      등록하기
                    </Button>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              스포이음의 특징
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              최고의 골프 경험을 위한 혁신적인 기능들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h3>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            최고의 골프 경험을 위한 첫 걸음을 내딛어보세요.
            스포이음과 함께 골프의 새로운 차원을 경험하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/signup')}
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              무료로 시작하기
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/login')}
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              로그인
            </Button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 dark:bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">S</span>
                </div>
                <span className="text-xl font-bold text-white">스포이음</span>
              </div>
              <p className="text-gray-400">
                골프 캐디와 골퍼를 연결하는 최고의 플랫폼
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li>매칭 서비스</li>
                <li>계약 관리</li>
                <li>결제 시스템</li>
                <li>후기 시스템</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li>도움말</li>
                <li>FAQ</li>
                <li>1:1 문의</li>
                <li>공지사항</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">연락처</h4>
              <ul className="space-y-2 text-gray-400">
                <li>이메일: support@spoeum.com</li>
                <li>전화: 02-1234-5678</li>
                <li>운영시간: 09:00 - 18:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 스포이음. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
