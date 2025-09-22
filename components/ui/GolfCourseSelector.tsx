import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  MapPin, 
  Building, 
  X, 
  Plus,
  Check,
  Clock,
  AlertCircle,
  Loader
} from 'lucide-react';
import { GolfCourse, GolfCourseSearchRequest } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface GolfCourseSelectorProps {
  selectedCourses: string[];
  onSelectionChange: (courses: string[]) => void;
  onPendingCourseChange?: (pendingCourse: string | null) => void;
  freelancer: boolean;
  onFreelancerChange: (freelancer: boolean) => void;
  maxSelections?: number;
  className?: string;
}

export function GolfCourseSelector({
  selectedCourses,
  onSelectionChange,
  onPendingCourseChange,
  freelancer,
  onFreelancerChange,
  maxSelections = 5,
  className
}: GolfCourseSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GolfCourse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pendingCourse, setPendingCourse] = useState<string | null>(null);
  const [isSubmittingPending, setIsSubmittingPending] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 검색 실행
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.searchGolfCourses({
          query: searchQuery.trim(),
          limit: 10
        });

        if (response.success && response.data) {
          setSearchResults(response.data);
          setShowDropdown(true);
        } else {
          setSearchResults([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error('골프장 검색 오류:', error);
        toast.error('골프장 검색 중 오류가 발생했습니다.');
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCourseSelect = (course: GolfCourse) => {
    if (selectedCourses.includes(course.name)) {
      toast.error('이미 선택된 골프장입니다.');
      return;
    }

    if (selectedCourses.length >= maxSelections) {
      toast.error(`최대 ${maxSelections}개의 골프장까지 선택할 수 있습니다.`);
      return;
    }

    onSelectionChange([...selectedCourses, course.name]);
    setSearchQuery('');
    setShowDropdown(false);
    toast.success(`${course.name}이(가) 추가되었습니다.`);
  };

  const handleCourseRemove = (courseName: string) => {
    onSelectionChange(selectedCourses.filter(name => name !== courseName));
    toast.success(`${courseName}이(가) 제거되었습니다.`);
  };

  const handlePendingCourseSubmit = async () => {
    if (!searchQuery.trim()) {
      toast.error('골프장 이름을 입력해주세요.');
      return;
    }

    if (selectedCourses.includes(searchQuery.trim())) {
      toast.error('이미 선택된 골프장입니다.');
      return;
    }

    setIsSubmittingPending(true);
    try {
      // 임시로 승인 대기 상태로 추가
      setPendingCourse(searchQuery.trim());
      onPendingCourseChange?.(searchQuery.trim());
      onSelectionChange([...selectedCourses, searchQuery.trim()]);
      
      // 실제 승인 요청 API 호출
      await api.requestGolfCourseApproval({
        name: searchQuery.trim(),
        region: '미분류',
        city: '미분류',
        address: '미분류',
        requestedBy: 'current_user_id' // 실제 사용자 ID로 교체
      });

      toast.success('골프장 승인 요청이 제출되었습니다. 관리자 검토 후 승인됩니다.');
      setSearchQuery('');
      setShowDropdown(false);
    } catch (error) {
      console.error('골프장 승인 요청 오류:', error);
      toast.error('골프장 승인 요청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingPending(false);
    }
  };

  const handleFreelancerToggle = () => {
    const newFreelancer = !freelancer;
    onFreelancerChange(newFreelancer);
    
    if (newFreelancer) {
      onSelectionChange([]);
      onPendingCourseChange?.(null);
      setPendingCourse(null);
      toast.success('프리랜서 모드로 설정되었습니다.');
    } else {
      toast.success('일반 모드로 설정되었습니다.');
    }
  };

  const getCourseDisplayName = (courseName: string) => {
    if (pendingCourse === courseName) {
      return `${courseName} (승인대기)`;
    }
    return courseName;
  };

  const isPendingCourse = (courseName: string) => {
    return pendingCourse === courseName;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 프리랜서 옵션 */}
      <Card className="border-green-200 dark:border-green-800">
        <CardBody>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="freelancer"
              checked={freelancer}
              onChange={handleFreelancerToggle}
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="freelancer" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              프리랜서 활동 (소속 골프장 없이 활동)
            </label>
          </div>
        </CardBody>
      </Card>

      {/* 골프장 검색 */}
      {!freelancer && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                소속 골프장 선택
              </h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              최대 {maxSelections}개까지 선택 가능
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* 검색 입력 */}
            <div className="relative" ref={dropdownRef}>
              <Input
                ref={inputRef}
                label="골프장 검색"
                placeholder="골프장 이름을 입력하세요 (예: 제주, 블루원)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5 text-blue-400" />}
                disabled={isSubmittingPending}
              />

              {/* 검색 결과 드롭다운 */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleCourseSelect(course)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {course.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {course.region} {course.city}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {course.code}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 검색 결과 없음 */}
              {showDropdown && searchResults.length === 0 && searchQuery.trim().length >= 2 && !isSearching && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <div className="px-4 py-3 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      검색 결과가 없습니다
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePendingCourseSubmit}
                      loading={isSubmittingPending}
                      leftIcon={<Plus className="h-4 w-4" />}
                    >
                      직접 추가 요청
                    </Button>
                  </div>
                </div>
              )}

              {/* 로딩 상태 */}
              {isSearching && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <div className="px-4 py-3 text-center">
                    <Loader className="h-5 w-5 animate-spin mx-auto text-blue-600" />
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      검색 중...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* 선택된 골프장 목록 */}
      {!freelancer && selectedCourses.length > 0 && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <h4 className="text-md font-semibold text-green-900 dark:text-green-100">
                  선택된 골프장
                </h4>
              </div>
              <Badge variant="success" className="text-xs">
                {selectedCourses.length}개
              </Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {selectedCourses.map((courseName, index) => (
                <div
                  key={courseName}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-full text-sm
                    ${isPendingCourse(courseName)
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600'
                      : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                    }
                  `}
                >
                  {index === 0 && (
                    <Badge variant="primary" className="text-xs">
                      주소속
                    </Badge>
                  )}
                  {isPendingCourse(courseName) ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>{getCourseDisplayName(courseName)}</span>
                  <button
                    onClick={() => handleCourseRemove(courseName)}
                    className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* 프리랜서 상태 표시 */}
      {freelancer && (
        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
          <CardBody>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                  프리랜서 모드
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  소속 골프장 없이 자유롭게 활동할 수 있습니다.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
