'use client';

import React, { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { Button } from '@/components/ui/Button';
import { 
  Sun, 
  Moon, 
  Monitor,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'dropdown';
}

export function ThemeToggle({ className, variant = 'button' }: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme, isDark } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 시스템 테마 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const isDark = mediaQuery.matches;
        useThemeStore.setState({ isDark });
        
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '라이트';
      case 'dark':
        return '다크';
      case 'system':
        return '시스템';
      default:
        return '라이트';
    }
  };

  if (variant === 'button') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={`flex items-center space-x-2 ${className || ''}`}
      >
        {getThemeIcon()}
        <span className="hidden sm:inline">{getThemeLabel()}</span>
      </Button>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        {getThemeIcon()}
        <span className="hidden sm:inline">{getThemeLabel()}</span>
        <ChevronDown className="w-3 h-3" />
      </Button>

      {isOpen && (
        <>
          {/* 오버레이 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 드롭다운 메뉴 */}
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-golf-dark-800 border border-golf-green-200 dark:border-golf-dark-700 rounded-lg shadow-lg z-20">
            <div className="py-1">
              <button
                onClick={() => {
                  setTheme('light');
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 hover:bg-golf-green-50 dark:hover:bg-golf-dark-700 ${
                  theme === 'light' ? 'text-golf-green-600 dark:text-golf-green-400' : 'text-golf-dark-700 dark:text-golf-dark-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>라이트</span>
              </button>
              
              <button
                onClick={() => {
                  setTheme('dark');
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 hover:bg-golf-green-50 dark:hover:bg-golf-dark-700 ${
                  theme === 'dark' ? 'text-golf-green-600 dark:text-golf-green-400' : 'text-golf-dark-700 dark:text-golf-dark-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>다크</span>
              </button>
              
              <button
                onClick={() => {
                  setTheme('system');
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 hover:bg-golf-green-50 dark:hover:bg-golf-dark-700 ${
                  theme === 'system' ? 'text-golf-green-600 dark:text-golf-green-400' : 'text-golf-dark-700 dark:text-golf-dark-300'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>시스템</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
