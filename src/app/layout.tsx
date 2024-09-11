import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './index.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import { QueryProvider } from '@components/providers';
import { Toaster } from '@components/ui/sonner';
import SSROptionsProvider from '@components/providers/SSROptionsProvider';
import { cookies } from 'next/headers';
import { API_TOKEN } from '@common/auth';
import { Provider as JotaiProvider } from 'jotai';

import { ThemeProvider } from '@components/providers';
import { HeaderDashboard, SidebarDashboard } from '@desktop/dashboard/layout/components';
// import SidebarDashboard from '@desktop/dashboard/sidebar';
// import HeaderDashboard from '@desktop/dashboard/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chuẩn nhà đất',
  description: 'Tìm bđs với chuẩn nhà đất',
};

const selectedCookies = (): Record<string, string | undefined | null> => {
  const results: Record<string, string | undefined | null> = {};
  const cookieStore = cookies();
  results[API_TOKEN] = cookieStore.get(API_TOKEN)?.value;
  return results;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile } = useGetUserAgentInfo();
  const mobileClass = isMobile ? 'isMobile' : '';
  const cookies = selectedCookies();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + ` ${mobileClass} overflow-hidden`}>
        <QueryProvider>
          <JotaiProvider>
            <SSROptionsProvider isMobile={isMobile} selectedCookies={cookies}>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <section className="flex">
                  <SidebarDashboard />
                  <main className="h-full w-full flex-1 overflow-hidden">
                    <HeaderDashboard />
                    {children}
                  </main>
                </section>
              </ThemeProvider>
            </SSROptionsProvider>
          </JotaiProvider>
          <Toaster richColors />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </QueryProvider>
      </body>
    </html>
  );
}
