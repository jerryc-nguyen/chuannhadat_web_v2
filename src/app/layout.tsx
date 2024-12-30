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
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile } = useGetUserAgentInfo();

  return (
    <html lang="vi-VN" suppressHydrationWarning={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(defaultJsonLd) }}
        />
        <link rel="canonical" href={`${getServerSideURL()}`}></link>
        <meta charSet="utf-8" />
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
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
