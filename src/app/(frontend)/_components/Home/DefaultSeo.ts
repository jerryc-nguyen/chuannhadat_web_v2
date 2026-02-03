import { createMetadata } from '@common/seo';
import { getServerSideURL } from '@common/getURL';
import type { Metadata } from 'next';

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
  manifest: '/manifest.json',

  icons: {
    icon: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        url: '/favicon-96x96.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/android-icon-192x192.png',
      },
    ],
    apple: [
      {
        rel: 'apple-touch-icon',
        sizes: '57x57',
        url: '/apple-icon-57x57.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '60x60',
        url: '/apple-icon-60x60.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '72x72',
        url: '/apple-icon-72x72.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '76x76',
        url: '/apple-icon-76x76.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '114x114',
        url: '/apple-icon-114x114.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        url: '/apple-icon-120x120.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '144x144',
        url: '/apple-icon-144x144.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        url: '/apple-icon-152x152.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/apple-icon-180x180.png',
      },
    ],
  },
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/ms-icon-144x144.png',
  },
});
