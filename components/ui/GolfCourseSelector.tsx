'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, X } from 'lucide-react';

export interface GolfCourse {
  name: string;
  region: string;
  city: string;
  address: string;
  source: string;
}

export interface GolfCourseSelectorProps {
  value?: GolfCourse | null;
  onChange: (course: GolfCourse | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export function GolfCourseSelector({
  value,
  onChange,
  placeholder = "골프장을 검색하세요...",
  className = "",
  disabled = false,
  error
}: GolfCourseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<GolfCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  // 검색 쿼리 변경 시 디바운스 적용
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchQuery.length >= 1) {
        searchCourses(searchQuery);
      } else {
        setCourses([]);
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const searchCourses = async (query: string) => {
    if (!query.trim()) {
      setCourses([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        limit: '20'
      });

      const response = await fetch(`/api/golf-courses/search?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.data.courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('골프장 검색 오류:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course: GolfCourse) => {
    onChange(course);
    setSearchQuery(course.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setSearchQuery('');
    setCourses([]);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (searchQuery.length >= 1) {
      searchCourses(searchQuery);
    }
  };

  const handleInputClick = () => {
    setIsOpen(true);
    if (searchQuery.length >= 1) {
      searchCourses(searchQuery);
    }
  };

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && searchQuery.length >= 1) {
      searchCourses(searchQuery);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 입력 필드 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        
        <button
          type="button"
          onClick={toggleDropdown}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* 드롭다운 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* 검색 결과 */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2">검색 중...</p>
              </div>
            ) : courses.length > 0 ? (
              courses.map((course, index) => (
                <button
                  key={`${course.name}-${index}`}
                  onClick={() => handleCourseSelect(course)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {course.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {course.region} {course.city}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {course.address}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : searchQuery.length >= 1 ? (
              <div className="p-4 text-center text-gray-500">
                <p>검색 결과가 없습니다.</p>
                <p className="text-xs mt-1">다른 검색어를 시도해보세요.</p>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>골프장 이름을 입력하세요.</p>
                <p className="text-xs mt-1">최소 1글자 이상 입력해주세요.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}