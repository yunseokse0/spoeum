import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, UserType } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const JWT_EXPIRES_IN = '7d';

export interface AuthToken {
  userId: string;
  email: string;
  userType: UserType;
  iat?: number;
  exp?: number;
}

// JWT 토큰 생성
export function generateToken(user: User): string {
  const payload: AuthToken = {
    userId: user.id,
    email: user.email,
    userType: user.userType,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// JWT 토큰 검증
export function verifyToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthToken;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// 비밀번호 해싱
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// 비밀번호 검증
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// 토큰에서 사용자 정보 추출
export function extractUserFromToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.decode(token) as AuthToken;
    return decoded;
  } catch (error) {
    console.error('Token decode failed:', error);
    return null;
  }
}

// 토큰 만료 확인
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as AuthToken;
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}

// 사용자 타입별 권한 확인
export function hasPermission(userType: UserType, requiredType: UserType | UserType[]): boolean {
  const types = Array.isArray(requiredType) ? requiredType : [requiredType];
  return types.includes(userType);
}

// 관리자 권한 확인
export function isAdmin(userType: UserType): boolean {
  return userType === 'agency';
}

// 캐디 권한 확인
export function isCaddy(userType: UserType): boolean {
  return userType === 'caddy';
}

// 투어프로 권한 확인
export function isTourPro(userType: UserType): boolean {
  return userType === 'tour_pro';
}

// 아마추어 권한 확인
export function isAmateur(userType: UserType): boolean {
  return userType === 'amateur';
}

// 에이전시 권한 확인
export function isAgency(userType: UserType): boolean {
  return userType === 'agency';
}
