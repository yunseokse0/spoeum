import React from 'react';
import { Loader2 } from 'lucide-react';

interface FullScreenLoaderProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
}

export function FullScreenLoader({ isVisible, message = '로딩 중...', progress }: FullScreenLoaderProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl max-w-md w-full mx-4">
        <div className="text-center">
          {/* 스피너 */}
          <div className="flex justify-center mb-6">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
          
          {/* 메시지 */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {message}
          </h3>
          
          {/* 프로그레스 바 */}
          {progress !== undefined && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}
          
          {/* 진행률 텍스트 */}
          {progress !== undefined && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% 완료
            </p>
          )}
          
          {/* 하단 설명 */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            잠시만 기다려주세요. 작업이 진행 중입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
