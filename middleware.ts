import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 관리자 페이지 접근 체크
  if (pathname.startsWith('/admin')) {
    // 관리자 로그인 페이지는 제외
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // 403 페이지는 제외
    if (pathname === '/admin/403') {
      return NextResponse.next();
    }

    // 클라이언트 사이드에서 관리자 인증 체크
    // 서버 사이드에서는 기본적인 라우팅만 처리
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
