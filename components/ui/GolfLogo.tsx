'use client';

import React from 'react';

interface GolfLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function GolfLogo({ size = 'md', className = '' }: GolfLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 골프공 배경 원 */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#2E7D32"
          stroke="#1B5E20"
          strokeWidth="2"
        />
        
        {/* 골프공 디멀 (작은 원들) */}
        <circle
          cx="35"
          cy="35"
          r="3"
          fill="#4CAF50"
        />
        <circle
          cx="65"
          cy="35"
          r="3"
          fill="#4CAF50"
        />
        <circle
          cx="35"
          cy="65"
          r="3"
          fill="#4CAF50"
        />
        <circle
          cx="65"
          cy="65"
          r="3"
          fill="#4CAF50"
        />
        <circle
          cx="50"
          cy="25"
          r="2.5"
          fill="#4CAF50"
        />
        <circle
          cx="25"
          cy="50"
          r="2.5"
          fill="#4CAF50"
        />
        <circle
          cx="75"
          cy="50"
          r="2.5"
          fill="#4CAF50"
        />
        <circle
          cx="50"
          cy="75"
          r="2.5"
          fill="#4CAF50"
        />
        
        {/* 골프 클럽 실루엣 */}
        <path
          d="M15 20 L25 15 L30 25 L20 30 Z"
          fill="#8D6E63"
          stroke="#5D4037"
          strokeWidth="1"
        />
        
        {/* 골프 클럽 헤드 */}
        <ellipse
          cx="22.5"
          cy="22.5"
          rx="8"
          ry="3"
          fill="#8D6E63"
          stroke="#5D4037"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

// 텍스트와 함께 사용하는 로고 컴포넌트
export function GolfLogoWithText({ 
  size = 'md', 
  showText = true, 
  className = '' 
}: GolfLogoProps & { showText?: boolean }) {
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <GolfLogo size={size} />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-display font-bold text-golf-dark-700 dark:text-white ${textSizeClasses[size]}`}>
            스포이음
          </span>
          <span className={`text-golf-dark-500 dark:text-golf-dark-400 text-xs ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            골프 캐디 매칭 플랫폼
          </span>
        </div>
      )}
    </div>
  );
}
