'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  Trophy,
  Users,
  Building2,
  Heart,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface GolfSignupFormProps {
  className?: string;
}

const userTypes = [
  {
    value: 'tour_pro',
    label: '투어프로',
    description: 'KLPGA/KPGA 정회원',
    icon: '🏆',
    color: 'golf-green'
  },
  {
    value: 'amateur',
    label: '아마추어',
    description: '아마추어 골퍼',
    icon: '🏌️‍♂️',
    color: 'golf-sky'
  },
  {
    value: 'caddy',
    label: '캐디',
    description: '전문 골프 캐디',
    icon: '🎒',
    color: 'golf-sand'
  },
  {
    value: 'agency',
    label: '에이전시',
    description: '골프 관련 사업',
    icon: '🏢',
    color: 'golf-dark'
  },
  {
    value: 'sponsor',
    label: '스폰서',
    description: '스폰서십 제공',
    icon: '💎',
    color: 'purple'
  }
];

export function GolfSignupForm({ className }: GolfSignupFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [selectedType, setSelectedType] = useState<typeof userTypes[0] | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
    privacyAgreed: false
  });

  const handleUserTypeSelect = (userType: typeof userTypes[0]) => {
    setSelectedType(userType);
    setStep('form');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!formData.termsAgreed || !formData.privacyAgreed) {
      alert('약관에 동의해주세요.');
      return;
    }

    // 회원가입 로직
    console.log('회원가입 데이터:', { ...formData, userType: selectedType?.value });
    
    // 투어 프로인 경우 별도 페이지로 리다이렉트
    if (selectedType?.value === 'tour_pro') {
      router.push('/tour-pro-signup');
      return;
    }

    alert('회원가입이 완료되었습니다!');
    router.push('/dashboard');
  };

  if (step === 'select') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-golf-green-50 via-white to-golf-sky-50 dark:from-golf-dark-900 dark:via-golf-dark-800 dark:to-golf-dark-900 relative overflow-hidden ${className || ''}`}>
        {/* 잔디 텍스처 배경 */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232E7D32%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M20%2020c0-11.046-8.954-20-20-20v20h20z%22/%3E%3Cpath%20d%3D%22M20%2020c11.046%200%2020-8.954%2020-20H20v20z%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-golf-dark-700 mb-4">
              🏌️‍♂️ 스포이음
            </h1>
            <p className="text-xl text-golf-dark-600">
              골프 전문 매칭 플랫폼에 오신 것을 환영합니다
            </p>
            <p className="text-golf-dark-500 mt-2">
              어떤 역할로 참여하시나요?
            </p>
          </div>

          {/* 사용자 타입 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTypes.map((userType) => (
              <Card
                key={userType.value}
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-golf-green-200 bg-white/95 backdrop-blur-sm"
                onClick={() => handleUserTypeSelect(userType)}
              >
                <CardBody className="p-8 text-center">
                  <div className="text-6xl mb-4">{userType.icon}</div>
                  <h3 className="text-xl font-display font-bold text-golf-dark-700 mb-2">
                    {userType.label}
                  </h3>
                  <p className="text-golf-dark-600 mb-4">
                    {userType.description}
                  </p>
                  <div className="flex items-center justify-center text-golf-green-600">
                    <span className="text-sm font-medium mr-2">시작하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* 로그인 링크 */}
          <div className="text-center mt-12">
            <p className="text-golf-dark-600">
              이미 계정이 있으신가요?{' '}
              <Button 
                variant="ghost" 
                className="text-golf-green-600 hover:text-golf-green-700 p-0 h-auto"
                onClick={() => router.push('/login')}
              >
                로그인하기
              </Button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-golf-green-50 via-white to-golf-sky-50 dark:from-golf-dark-900 dark:via-golf-dark-800 dark:to-golf-dark-900 ${className || ''}`}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-golf-dark-700 mb-2">
            {selectedType?.icon} {selectedType?.label} 회원가입
          </h1>
          <p className="text-golf-dark-600">
            {selectedType?.description}으로 스포이음에 참여하세요
          </p>
        </div>

        <Card className="border-golf-green-200 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-golf-green-500 to-golf-green-600 text-white">
            <h2 className="text-xl font-semibold">기본 정보</h2>
          </CardHeader>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  이름
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="이름을 입력하세요"
                  className="border-golf-green-300 focus:border-golf-green-500"
                  required
                />
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  이메일
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                  className="border-golf-green-300 focus:border-golf-green-500"
                  required
                />
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  전화번호
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-1234-5678"
                  className="border-golf-green-300 focus:border-golf-green-500"
                  required
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  비밀번호
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 입력하세요"
                    className="border-golf-green-300 focus:border-golf-green-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-golf-dark-400 hover:text-golf-dark-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label className="block text-sm font-medium text-golf-dark-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    className="border-golf-green-300 focus:border-golf-green-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-golf-dark-400 hover:text-golf-dark-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    name="termsAgreed"
                    type="checkbox"
                    checked={formData.termsAgreed}
                    onChange={handleInputChange}
                    className="rounded border-golf-green-300"
                    required
                  />
                  <span className="text-sm text-golf-dark-600">
                    <span className="text-golf-green-600 cursor-pointer hover:underline">서비스 이용약관</span>에 동의합니다 (필수)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    name="privacyAgreed"
                    type="checkbox"
                    checked={formData.privacyAgreed}
                    onChange={handleInputChange}
                    className="rounded border-golf-green-300"
                    required
                  />
                  <span className="text-sm text-golf-dark-600">
                    <span className="text-golf-green-600 cursor-pointer hover:underline">개인정보 처리방침</span>에 동의합니다 (필수)
                  </span>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('select')}
                  className="flex-1 border-golf-green-300 text-golf-green-600 hover:bg-golf-green-50"
                >
                  이전
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-golf-green-600 hover:bg-golf-green-700 text-white"
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
