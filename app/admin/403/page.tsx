'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { 
  Shield, 
  AlertTriangle, 
  Home,
  ArrowLeft
} from 'lucide-react';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardBody className="text-center p-8">
            {/* 아이콘 */}
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            {/* 제목 */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              403 Forbidden
            </h1>
            
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              접근 권한이 없습니다
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              관리자 페이지에 접근할 권한이 없습니다.<br />
              관리자 계정으로 로그인하거나 관리자에게 문의하세요.
            </p>

            {/* 버튼 */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/admin/login')}
                fullWidth
                leftIcon={<Shield className="w-5 h-5" />}
                className="bg-blue-600 hover:bg-blue-700"
              >
                관리자 로그인
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                fullWidth
                leftIcon={<Home className="w-5 h-5" />}
              >
                홈으로 돌아가기
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => router.back()}
                fullWidth
                leftIcon={<ArrowLeft className="w-5 h-5" />}
              >
                이전 페이지로
              </Button>
            </div>

            {/* 추가 정보 */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>관리자 계정이 필요하신가요?</strong>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                시스템 관리자에게 문의하여 관리자 권한을 요청하세요.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* 푸터 */}
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            스포이음(SPOEUM) 관리자 페이지
          </p>
        </div>
      </div>
    </div>
  );
}
