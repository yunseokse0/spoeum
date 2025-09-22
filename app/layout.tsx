import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '스포이음 - 골프 캐디 매칭 플랫폼',
  description: '골프 캐디와 골퍼를 연결하는 최고의 매칭 플랫폼',
  keywords: ['골프', '캐디', '매칭', '투어프로', '아마추어'],
  authors: [{ name: 'SPOEUM Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0369a1' },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '스포이음',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: '스포이음 - 골프 캐디 매칭 플랫폼',
    description: '골프 캐디와 골퍼를 연결하는 최고의 매칭 플랫폼',
    type: 'website',
    locale: 'ko_KR',
    siteName: '스포이음',
  },
  twitter: {
    card: 'summary',
    title: '스포이음 - 골프 캐디 매칭 플랫폼',
    description: '골프 캐디와 골퍼를 연결하는 최고의 매칭 플랫폼',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
