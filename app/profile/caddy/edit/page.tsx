'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GolfCourseSelector, GolfCourse } from '@/components/ui/GolfCourseSelector';
import { GolfLogoWithText } from '@/components/ui/GolfLogo';
import { useThemeStore } from '@/store/useThemeStore';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Star, 
  CheckCircle, 
  Sparkles, 
  Shield, 
  Clock, 
  Trophy, 
  Target, 
  Heart, 
  DollarSign, 
  FileText,
  Save
} from 'lucide-react';

export default function CaddyProfileEditPage() {
  const router = useRouter();
  const { theme } = useThemeStore();
  
  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    specialties: [] as string[],
    cutOffRate: '', // 컷오프시 금액
    cutPassRate: '', // 컷통과시 금액
    bio: '',
    golfCourse: null as GolfCourse | null
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 전문 분야 옵션
  const specialtyOptions = [
    '코스 관리', '클럽 선택', '거리 측정', '퍼팅 조언', 
    '심리 코칭', '기술 분석', '경기 전략', '체력 관리'
  ];

  // 경력 옵션
  const experienceOptions = [
    { value: '0-1', label: '1년 미만' },
    { value: '1-3', label: '1-3년' },
    { value: '3-5', label: '3-5년' },
    { value: '5-10', label: '5-10년' },
    { value: '10+', label: '10년 이상' }
  ];

  // 컴포넌트 마운트시 기존 데이터 로드
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      // TODO: 실제 API 호출로 사용자 프로필 데이터 가져오기
      // const response = await fetch('/api/profile/caddy');
      // const data = await response.json();
      
      // 임시 데이터 (실제로는 API에서 가져옴)
      const mockData = {
        name: '김캐디',
        email: 'kim.caddy@example.com',
        phone: '010-1234-5678',
        experience: '3-5',
        specialties: ['코스 관리', '심리 코칭'],
        cutOffRate: '300000',
        cutPassRate: '500000',
        bio: '8년 경력의 전문 캐디입니다.',
        golfCourse: {
          name: '제주 블루원',
          region: '제주도',
          city: '제주시',
          address: '제주시 애월읍',
          source: '데이터베이스'
        }
      };
      
      setFormData(mockData);
    } catch (error) {
      console.error('프로필 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '올바른 이메일 형식이 아닙니다.';
    if (!formData.phone.trim()) newErrors.phone = '전화번호를 입력해주세요.';
    if (!formData.experience) newErrors.experience = '경력을 선택해주세요.';
    if (formData.specialties.length === 0) newErrors.specialties = '최소 1개의 전문 분야를 선택해주세요.';
    
    // 컷오프시 금액 검증
    if (!formData.cutOffRate.trim()) newErrors.cutOffRate = '컷오프시 금액을 입력해주세요.';
    else if (isNaN(Number(formData.cutOffRate)) || Number(formData.cutOffRate) <= 0) newErrors.cutOffRate = '유효한 금액을 입력해주세요.';
    
    // 컷통과시 금액 검증
    if (!formData.cutPassRate.trim()) newErrors.cutPassRate = '컷통과시 금액을 입력해주세요.';
    else if (isNaN(Number(formData.cutPassRate)) || Number(formData.cutPassRate) <= 0) newErrors.cutPassRate = '유효한 금액을 입력해주세요.';
    
    // 컷통과시 금액이 컷오프시 금액보다 높은지 확인
    if (formData.cutOffRate && formData.cutPassRate) {
      if (Number(formData.cutPassRate) <= Number(formData.cutOffRate)) {
        newErrors.cutPassRate = '컷통과시 금액은 컷오프시 금액보다 높아야 합니다.';
      }
    }
    
    if (!formData.bio.trim()) newErrors.bio = '자기소개를 입력해주세요.';
    if (!formData.golfCourse) newErrors.golfCourse = '소속 골프장을 선택해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: 실제 API 호출로 프로필 업데이트
      console.log('프로필 업데이트 데이터:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

      router.push('/profile?updated=true');
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      setErrors({ submit: '업데이트 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">프로필 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50'}`}>
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      {/* 네비게이션 */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          뒤로가기
        </button>
        <ThemeToggle />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-center mb-8">
          <GolfLogoWithText />
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className={`${theme === 'dark' ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'} shadow-2xl`}>
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
                캐디 프로필 수정
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                프로필 정보를 수정하고 업데이트하세요
              </p>
              <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>실시간 저장</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-500 mr-1" />
                  <span>즉시 반영</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>전문 지원</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 기본 정보 */}
                <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    기본 정보
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <User className="h-4 w-4 mr-1 text-blue-500" />
                        이름 *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-300'
                        }`}
                        placeholder="홍길동"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-green-500" />
                        이메일 *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-green-300'
                        }`}
                        placeholder="example@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-purple-500" />
                      전화번호 *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                        errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-300'
                      }`}
                      placeholder="010-1234-5678"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.phone}</p>}
                  </div>
                </div>

                {/* 골프장 정보 */}
                <div className="space-y-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    골프장 정보
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-green-500" />
                      소속 골프장 *
                    </label>
                    <GolfCourseSelector
                      value={formData.golfCourse}
                      onChange={(course) => handleInputChange('golfCourse', course)}
                      placeholder="골프장을 검색하세요..."
                      error={errors.golfCourse}
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      검색하여 골프장을 선택하거나 새로 추가할 수 있습니다
                    </p>
                    {formData.golfCourse && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                              {formData.golfCourse.name}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {formData.golfCourse.region} {formData.golfCourse.city}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 경력 및 전문 분야 */}
                <div className="space-y-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    경력 및 전문 분야
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Trophy className="h-4 w-4 mr-1 text-purple-500" />
                      캐디 경력 *
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                        errors.experience ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <option value="">경력을 선택하세요</option>
                      {experienceOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.experience && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.experience}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <Star className="h-4 w-4 mr-1 text-pink-500" />
                      전문 분야 * (최소 1개 선택)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {specialtyOptions.map(specialty => (
                        <button
                          key={specialty}
                          type="button"
                          onClick={() => handleSpecialtyToggle(specialty)}
                          className={`p-4 text-sm font-semibold rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                            formData.specialties.includes(specialty)
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-gray-300 dark:border-gray-600 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            {formData.specialties.includes(specialty) && (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            {specialty}
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.specialties && <p className="text-red-500 text-sm mt-2 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.specialties}</p>}
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      선택한 전문 분야는 프로필에 표시됩니다
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-yellow-500" />
                      대회당 요금 설정 *
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <Target className="h-4 w-4 mr-1 text-red-500" />
                          컷오프시 금액 (원) *
                        </label>
                        <input
                          type="number"
                          value={formData.cutOffRate}
                          onChange={(e) => handleInputChange('cutOffRate', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                            errors.cutOffRate ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-300'
                          }`}
                          placeholder="예: 300000"
                          min="0"
                        />
                        {errors.cutOffRate && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.cutOffRate}</p>}
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          컷오프된 경우 받는 금액
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <Trophy className="h-4 w-4 mr-1 text-green-500" />
                          컷통과시 금액 (원) *
                        </label>
                        <input
                          type="number"
                          value={formData.cutPassRate}
                          onChange={(e) => handleInputChange('cutPassRate', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                            errors.cutPassRate ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-green-300'
                          }`}
                          placeholder="예: 500000"
                          min="0"
                        />
                        {errors.cutPassRate && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.cutPassRate}</p>}
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          컷통과한 경우 받는 금액
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                      <div className="flex items-start">
                        <Sparkles className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                            💡 요금 설정 가이드
                          </h5>
                          <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                            <li>• 컷통과시 금액은 컷오프시 금액보다 높게 설정하세요</li>
                            <li>• 시장 가격을 참고하여 경쟁력 있는 금액을 설정하세요</li>
                            <li>• 경력과 전문성에 따라 차등 적용 가능합니다</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 자기소개 */}
                <div className="space-y-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    자기소개
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-indigo-500" />
                      자기소개 *
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                        errors.bio ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-300'
                      }`}
                      placeholder="자신의 경력과 전문성을 간단히 소개해주세요..."
                    />
                    {errors.bio && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.bio}</p>}
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      프로 골퍼들이 선택할 수 있도록 매력적으로 작성해주세요
                    </p>
                  </div>
                </div>

                {/* 에러 메시지 */}
                {errors.submit && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* 제출 버튼 */}
                <div className="text-center pt-6">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 p-1 rounded-2xl inline-block shadow-lg">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full py-4 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-50 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                          업데이트 중...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Save className="h-5 w-5 mr-2 text-blue-500" />
                          프로필 저장
                          <CheckCircle className="h-5 w-5 ml-2 text-green-500" />
                        </div>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    <Clock className="inline h-4 w-4 mr-1" />
                    변경사항이 즉시 반영됩니다
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
