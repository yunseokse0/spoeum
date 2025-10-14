'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Settings, 
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Database,
  Server,
  Shield,
  Bell,
  Globe,
  Lock,
  Key,
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  Users,
  Trash2
} from 'lucide-react';

interface SystemStatus {
  service: string;
  status: 'online' | 'offline' | 'maintenance';
  uptime: string;
  lastCheck: string;
}

interface SystemConfig {
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  apiRateLimit: number;
  sessionTimeout: number;
}

export default function SettingsPage() {
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    siteName: 'SPOEUM',
    siteUrl: 'https://spoeum.vercel.app',
    adminEmail: 'admin@spoeum.com',
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'png', 'pdf', 'doc'],
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    apiRateLimit: 1000,
    sessionTimeout: 30
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    {
      service: '웹 서버',
      status: 'online',
      uptime: '99.9%',
      lastCheck: '2025-01-15 10:30:00'
    },
    {
      service: '데이터베이스',
      status: 'online',
      uptime: '99.8%',
      lastCheck: '2025-01-15 10:30:00'
    },
    {
      service: 'Gemini API',
      status: 'online',
      uptime: '99.5%',
      lastCheck: '2025-01-15 10:30:00'
    },
    {
      service: '이메일 서비스',
      status: 'maintenance',
      uptime: '98.2%',
      lastCheck: '2025-01-15 10:30:00'
    },
    {
      service: '파일 저장소',
      status: 'online',
      uptime: '99.7%',
      lastCheck: '2025-01-15 10:30:00'
    }
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="green" leftIcon={<CheckCircle className="w-3 h-3" />}>온라인</Badge>;
      case 'offline':
        return <Badge variant="red" leftIcon={<XCircle className="w-3 h-3" />}>오프라인</Badge>;
      case 'maintenance':
        return <Badge variant="yellow" leftIcon={<AlertTriangle className="w-3 h-3" />}>점검중</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleConfigChange = (key: keyof SystemConfig, value: any) => {
    setSystemConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveConfig = () => {
    // 설정 저장 로직
    setHasChanges(false);
    alert('설정이 저장되었습니다.');
  };

  const handleSystemCheck = () => {
    alert('시스템 상태를 확인했습니다.');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">시스템관리</h1>
            <p className="text-gray-600 dark:text-gray-400">시스템 설정 및 상태 관리</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={handleSystemCheck}
            >
              시스템 체크
            </Button>
            <Button 
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSaveConfig}
              disabled={!hasChanges}
            >
              설정 저장
            </Button>
          </div>
        </div>

        {/* 시스템 상태 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">시스템 상태</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemStatus.map((service, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {service.service === '웹 서버' && <Server className="w-4 h-4 text-blue-600" />}
                      {service.service === '데이터베이스' && <Database className="w-4 h-4 text-green-600" />}
                      {service.service === 'Gemini API' && <Globe className="w-4 h-4 text-purple-600" />}
                      {service.service === '이메일 서비스' && <Mail className="w-4 h-4 text-orange-600" />}
                      {service.service === '파일 저장소' && <Monitor className="w-4 h-4 text-gray-600" />}
                      <span className="font-medium text-gray-900 dark:text-white">{service.service}</span>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>가동률: <span className="font-medium">{service.uptime}</span></p>
                    <p>마지막 체크: {service.lastCheck}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 기본 설정 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">기본 설정</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  사이트 이름
                </label>
                <Input
                  value={systemConfig.siteName}
                  onChange={(e) => handleConfigChange('siteName', e.target.value)}
                  placeholder="사이트 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  사이트 URL
                </label>
                <Input
                  value={systemConfig.siteUrl}
                  onChange={(e) => handleConfigChange('siteUrl', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  관리자 이메일
                </label>
                <Input
                  type="email"
                  value={systemConfig.adminEmail}
                  onChange={(e) => handleConfigChange('adminEmail', e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  최대 파일 크기 (MB)
                </label>
                <Input
                  type="number"
                  value={systemConfig.maxFileSize}
                  onChange={(e) => handleConfigChange('maxFileSize', parseInt(e.target.value))}
                  placeholder="10"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 기능 설정 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">기능 설정</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">유지보수 모드</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">사이트를 임시로 비활성화합니다</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemConfig.maintenanceMode}
                    onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">회원가입 허용</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">새로운 사용자 등록을 허용합니다</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemConfig.registrationEnabled}
                    onChange={(e) => handleConfigChange('registrationEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">이메일 알림</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">이메일 알림을 활성화합니다</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemConfig.emailNotifications}
                    onChange={(e) => handleConfigChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">SMS 알림</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">SMS 알림을 활성화합니다</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemConfig.smsNotifications}
                    onChange={(e) => handleConfigChange('smsNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 보안 설정 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">보안 설정</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API 요청 제한 (시간당)
                </label>
                <Input
                  type="number"
                  value={systemConfig.apiRateLimit}
                  onChange={(e) => handleConfigChange('apiRateLimit', parseInt(e.target.value))}
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  세션 타임아웃 (분)
                </label>
                <Input
                  type="number"
                  value={systemConfig.sessionTimeout}
                  onChange={(e) => handleConfigChange('sessionTimeout', parseInt(e.target.value))}
                  placeholder="30"
                />
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">보안 경고</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    보안 설정을 변경할 때는 신중하게 검토하세요. 잘못된 설정은 보안 취약점을 야기할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 데이터베이스 관리 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">데이터베이스 관리</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" leftIcon={<Database className="w-4 h-4" />}>
                백업 생성
              </Button>
              <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
                백업 복원
              </Button>
              <Button variant="outline" leftIcon={<Trash2 className="w-4 h-4" />} className="text-red-600 border-red-200 hover:bg-red-50">
                캐시 삭제
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
