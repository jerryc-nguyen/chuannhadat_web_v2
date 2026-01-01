import { getUserAgentInfo } from '@common/getUserAgentInfo';
import { defaultJsonLd } from '@common/seo';
import { cn } from '@common/utils';
import { getServerSideURL } from '@common/getURL';
import type { Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import Head from 'next/head';
import NextTopLoaderDynamic from '@/components/NextTopLoaderDynamic';
import './index.scss';
import ProviderWrapper from './provider-wrapper';
import { checkIsLoggedInServer } from './action';

const vietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: true,
  variable: '--font-vietnam',
});

// GOOD to know: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#unsupported-metadata
// Metadata moved to /src/app/(frontend)/page.tsx

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile } = await getUserAgentInfo();
  const isLoggedIn = await checkIsLoggedInServer();

  return (
    <html lang="vi-VN" suppressHydrationWarning={true}>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(defaultJsonLd) }}
        />
        <link rel="canonical" href={`${getServerSideURL()}`}></link>
        <meta charSet="utf-8" />
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        {/* Preconnect/DNS Prefetch to speed up image fetches */}
        <link rel="preconnect" href="https://images.chuannhadat.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//images.chuannhadat.com" />
      </Head>
      {/* ---------------- */}
      <body
        id="body-root"
        className={cn(
          vietnam.variable,
          'font-vietnam',
          isMobile ? 'isMobile' : 'isDesktop',
          'bg-white',
          'selection:bg-primary_color/20 selection:text-primary_color',
        )}
        cz-shortcut-listen="true"
        {...(isLoggedIn && { 'data-testid': 'userLoggedIn' })}
      >
        <NextTopLoaderDynamic />
        <ProviderWrapper isMobile={isMobile}>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
