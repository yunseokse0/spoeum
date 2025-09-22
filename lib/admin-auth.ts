import { User, UserRole } from '@/types';

// 관리자 인증 관련 유틸리티 함수들

export function isAdminUser(user: User | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'superadmin';
}

export function isSuperAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.role === 'superadmin';
}

export function hasAdminAccess(user: User | null): boolean {
  return isAdminUser(user);
}

export function getAdminUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('admin_user');
    if (!userStr) return null;
    
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('관리자 사용자 정보 파싱 오류:', error);
    return null;
  }
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setAdminAuth(user: User, token: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('admin_user', JSON.stringify(user));
  localStorage.setItem('admin_token', token);
}

export function clearAdminAuth(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('admin_user');
  localStorage.removeItem('admin_token');
}

export function isAdminAuthenticated(): boolean {
  const user = getAdminUser();
  const token = getAdminToken();
  
  return user !== null && token !== null && hasAdminAccess(user);
}

// 관리자 권한별 접근 제어
export function canAccessAdminDashboard(user: User | null): boolean {
  return isAdminUser(user);
}

export function canManageUsers(user: User | null): boolean {
  return isAdminUser(user);
}

export function canManageSystem(user: User | null): boolean {
  return isSuperAdmin(user);
}

export function canViewReports(user: User | null): boolean {
  return isAdminUser(user);
}

export function canManageContracts(user: User | null): boolean {
  return isAdminUser(user);
}

export function canManagePayments(user: User | null): boolean {
  return isAdminUser(user);
}

export function canManageSponsorships(user: User | null): boolean {
  return isAdminUser(user);
}

export function canManageTournaments(user: User | null): boolean {
  return isAdminUser(user);
}

export function canManageNotifications(user: User | null): boolean {
  return isAdminUser(user);
}

// 관리자 활동 로그 생성
export function createAdminActivityLog(
  action: string,
  resource: string,
  resourceId?: string,
  details?: any
): void {
  const user = getAdminUser();
  if (!user) return;

  const activityLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    adminId: user.id,
    adminName: user.name,
    action,
    resource,
    resourceId,
    details,
    ipAddress: '127.0.0.1', // 실제로는 클라이언트 IP 추출
    userAgent: navigator.userAgent,
    createdAt: new Date()
  };

  // TODO: 실제로는 서버에 전송
  console.log('관리자 활동 로그:', activityLog);
}

// 관리자 권한 체크 데코레이터 (타입스크립트용)
export function requireAdmin(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const user = getAdminUser();
    if (!hasAdminAccess(user)) {
      throw new Error('관리자 권한이 필요합니다.');
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

export function requireSuperAdmin(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const user = getAdminUser();
    if (!isSuperAdmin(user)) {
      throw new Error('슈퍼관리자 권한이 필요합니다.');
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}
