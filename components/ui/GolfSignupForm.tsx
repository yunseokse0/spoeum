'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Upload,
  CheckCircle,
  Users,
  Trophy,
  Building,
  Shield
} from 'lucide-react';

interface GolfSignupFormProps {
  className?: string;
}

type UserType = 'tour_pro' | 'amateur' | 'caddy' | 'sponsor' | 'agency';

export function GolfSignupForm({ className }: GolfSignupFormProps) {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [step, setStep] = useState<'select' | 'form'>('select');

  const userTypes = [
    {
      id: 'tour_pro' as UserType,
      title: '투어프로',
      description: 'KLPGA/KPGA 정회원',
      icon: '🏆',
      color: 'golf-green',
      requirements: ['협회 인증', '회원번호']
    },
    {
      id: 'amateur' as UserType,
      title: '아마추어 골퍼',
      description: '골프를 즐기는 일반인',
      icon: '🏌️‍♂️',
      color: 'golf-sky',
      requirements: ['핸디캡 정보']
    },
    {
      id: 'caddy' as UserType,
      title: '캐디',
      description: '전문 골프 캐디',
      icon: '🎒',
      color: 'golf-sand',
      requirements: ['골프장 소속', '경력 정보']
    },
    {
      id: 'sponsor' as UserType,
      title: '스폰서',
      description: '골프 스폰서십 제공',
      icon: '💰',
      color: 'golf-dark',
      requirements: ['사업자등록증', '회사 정보']
    },
    {
      id: 'agency' as UserType,
      title: '에이전시',
      description: '골프 매니지먼트',
      icon: '🏢',
      color: 'golf-dark',
      requirements: ['사업자등록증', '회사 정보']
    }
  ];

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep('form');
  };

  const handleBackToSelection = () => {
    setStep('select');
    setUserType(null);
  };

  if (step === 'select') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-golf-green-50 via-white to-golf-sky-50 dark:from-golf-dark-900 dark:via-golf-dark-800 dark:to-golf-dark-900 relative overflow-hidden ${className || ''}`}>
        {/* 잔디 텍스처 배경 */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%232E7D32" fill-opacity="0.1"%3E%3Cpath d="M20 20c0-11.046-8.954-20-20-20v20h20z"/%3E%3Cpath d="M20 20c11.046 0 20-8.954 20-20H20v20z"/%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-golf-green-600 rounded-full mb-6">
              <span className="text-3xl">🏌️‍♂️</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-golf-dark-700 mb-4">
              스포이음에 오신 것을 환영합니다
            </h1>
            <p className="text-lg text-golf-dark-600 max-w-2xl mx-auto">
              골프 전문 매칭 플랫폼에서 당신의 역할을 선택하고 시작해보세요
            </p>
          </div>

          {/* 사용자 타입 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTypes.map((type) => (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-${type.color}-400 bg-white/90 backdrop-blur-sm`}
                onClick={() => handleUserTypeSelect(type.id)}
              >
                <CardHeader className={`bg-gradient-to-r from-${type.color}-500 to-${type.color}-600 text-white text-center`}>
                  <div className="text-4xl mb-2">{type.icon}</div>
                  <h3 className="text-xl font-bold">{type.title}</h3>
                  <p className="text-sm opacity-90">{type.description}</p>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-golf-dark-700 mb-3">필요 정보:</h4>
                    {type.requirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-golf-dark-600">{req}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full mt-4 bg-${type.color}-600 hover:bg-${type.color}-700 text-white`}
                  >
                    선택하기
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* 로그인 링크 */}
          <div className="text-center mt-12">
            <p className="text-golf-dark-600">
              이미 계정이 있으신가요?{' '}
              <Button variant="link" className="text-golf-green-600 hover:text-golf-green-700">
                로그인하기
              </Button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 폼 단계
  const selectedType = userTypes.find(type => type.id === userType);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-golf-green-50 via-white to-golf-sky-50 dark:from-golf-dark-900 dark:via-golf-dark-800 dark:to-golf-dark-900 ${className || ''}`}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-golf-green-600 rounded-full mb-4">
            <span className="text-2xl">{selectedType?.icon}</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-golf-dark-700 mb-2">
            {selectedType?.title} 회원가입
          </h1>
          <p className="text-golf-dark-600">{selectedType?.description}</p>
        </div>

        {/* 회원가입 폼 */}
        <Card className="border-golf-green-200 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className={`bg-gradient-to-r from-${selectedType?.color}-500 to-${selectedType?.color}-600 text-white`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">기본 정보 입력</h2>
              <Badge variant="outline" className="text-white border-white/30">
                {selectedType?.title}
              </Badge>
            </div>
          </CardHeader>
          <CardBody className="p-8">
            <form className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    이름
                  </label>
                  <Input 
                    placeholder="이름을 입력하세요"
                    className="border-golf-green-300 focus:border-golf-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    이메일
                  </label>
                  <Input 
                    type="email"
                    placeholder="이메일을 입력하세요"
                    className="border-golf-green-300 focus:border-golf-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    전화번호
                  </label>
                  <Input 
                    placeholder="010-1234-5678"
                    className="border-golf-green-300 focus:border-golf-green-500"
                  />
                </div>
                {userType === 'tour_pro' && (
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <Trophy className="w-4 h-4 inline mr-2" />
                      협회
                    </label>
                    <select className="w-full px-3 py-2 border border-golf-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golf-green-500">
                      <option value="">협회를 선택하세요</option>
                      <option value="KLPGA">KLPGA (한국여자프로골프협회)</option>
                      <option value="KPGA">KPGA (한국프로골프협회)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 타입별 특별 정보 */}
              {userType === 'tour_pro' && (
                <div>
                  <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    회원번호
                  </label>
                  <Input 
                    placeholder="회원번호를 입력하세요"
                    className="border-golf-green-300 focus:border-golf-green-500"
                  />
                </div>
              )}

              {userType === 'caddy' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      소속 골프장
                    </label>
                    <Input 
                      placeholder="골프장명을 입력하세요"
                      className="border-golf-green-300 focus:border-golf-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      경력 (년)
                    </label>
                    <Input 
                      type="number"
                      placeholder="경력 년수를 입력하세요"
                      className="border-golf-green-300 focus:border-golf-green-500"
                    />
                  </div>
                </div>
              )}

              {(userType === 'sponsor' || userType === 'agency') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <Building className="w-4 h-4 inline mr-2" />
                      회사명
                    </label>
                    <Input 
                      placeholder="회사명을 입력하세요"
                      className="border-golf-green-300 focus:border-golf-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      사업자등록증
                    </label>
                    <div className="border-2 border-dashed border-golf-green-300 rounded-lg p-6 text-center hover:border-golf-green-400 transition-colors">
                      <Upload className="w-8 h-8 text-golf-green-500 mx-auto mb-2" />
                      <p className="text-golf-dark-600">파일을 드래그하거나 클릭하여 업로드</p>
                      <p className="text-sm text-golf-dark-500 mt-1">PDF, JPG, PNG 파일만 가능</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 비밀번호 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                    <Shield className="w-4 h-4 inline mr-2" />
                    비밀번호
                  </label>
                  <Input 
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    className="border-golf-green-300 focus:border-golf-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                    <Shield className="w-4 h-4 inline mr-2" />
                    비밀번호 확인
                  </label>
                  <Input 
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    className="border-golf-green-300 focus:border-golf-green-500"
                  />
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-golf-green-300" />
                  <span className="text-sm text-golf-dark-600">
                    <span className="text-golf-green-600 cursor-pointer hover:underline">서비스 이용약관</span>에 동의합니다
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-golf-green-300" />
                  <span className="text-sm text-golf-dark-600">
                    <span className="text-golf-green-600 cursor-pointer hover:underline">개인정보 처리방침</span>에 동의합니다
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-golf-green-300" />
                  <span className="text-sm text-golf-dark-600">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </span>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex space-x-4 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1 border-golf-green-300 text-golf-green-700 hover:bg-golf-green-50"
                  onClick={handleBackToSelection}
                >
                  이전
                </Button>
                <Button 
                  type="submit"
                  className={`flex-1 bg-${selectedType?.color}-600 hover:bg-${selectedType?.color}-700 text-white`}
                >
                  회원가입 완료
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
