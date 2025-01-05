import { getServerSideURL } from '@common/getURL';
import { createMetadata, defaultJsonLd } from '@common/seo';
import { cn } from '@common/utils';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';
import ProviderWrapper from './provider-wrapper';

const vietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['300', '400', '700', '600', '500', '800', '900'],
});

export const metadata: Metadata = createMetadata({
  title: 'Đăng tin nhà đất, bất động sản chuyên nghiệp | Chuẩn Nhà Đất',
  description:
    'Web đăng tin nhà đất, rao vặt bất động sản chuyên nghiệp số 1 Việt Nam. Hơn 10.000 môi giới tin dùng.',
  keywords:
    'đăng tin nhà đất chuyên nghiệp, đăng tin bất động sản chuyên nghiệp, mua nhà, bán nhà, mua đất, bán đất, mua bán nhà đất, mua căn hộ, cho thuê căn hộ toàn quốc, giá rẻ',
  openGraph: {
    images: ['https://images.chuannhadat.com/images/logos/cnd_logo_1.jpg?w=400'],
    type: 'website',
    title: 'Đăng tin nhà đất, bất động sản chuyên nghiệp | Chuẩn Nhà Đất',
    description:
      'Web đăng tin nhà đất, rao vặt bất động sản chuyên nghiệp số 1 Việt Nam. Hơn 10.000 môi giới tin dùng.',
    siteName: 'chuannhadat.com',
    url: getServerSideURL(),
  },
  manifest: "/manifest.json",
  themeColor: "#ffffff",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile } = useGetUserAgentInfo();

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

        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      </Head>
      {/* ---------------- */}
      <body
        id="body-root"
        className={cn(
          vietnam.className,
          isMobile ? 'isMobile' : '',
          'bg-white',
          'selection:bg-primary_color/20 selection:text-primary_color',
        )}
      >
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
