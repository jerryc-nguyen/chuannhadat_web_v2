import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import { cn } from '@common/utils';
import './index.scss';
import ProviderWrapper from './provider-wrapper';
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
    <html lang="en" suppressHydrationWarning={true}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      <body className={cn(inter.className, isMobile ? 'isMobile' : '', 'bg-neutral_03')}>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
