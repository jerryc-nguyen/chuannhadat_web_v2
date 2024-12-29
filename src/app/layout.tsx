import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import { cn } from '@common/utils';
import './index.scss';
import ProviderWrapper from './provider-wrapper';
import { defaultJsonLd, JsonLdScript } from '@common/seo';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chuẩn nhà đất',
  description: 'Tìm bđs với chuẩn nhà đất',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile } = useGetUserAgentInfo();

  return (
    <html lang="vi-VN" suppressHydrationWarning={true}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      <JsonLdScript jsonLd={defaultJsonLd} />
      <body
        className={cn(
          inter.className,
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
