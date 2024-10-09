import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { cookies } from 'next/headers';
import { API_TOKEN } from '@common/auth';
import { Toaster } from '@components/ui/sonner';
import { ToastContainer } from 'react-toastify';
import { QueryProvider } from '@components/providers';
import SSROptionsProvider from '@components/providers/SSROptionsProvider';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';

type ProviderWrapperProps = {
  children: React.ReactNode;
};
const selectedCookies = (): Record<string, string | undefined | null> => {
  const results: Record<string, string | undefined | null> = {};
  const cookieStore = cookies();
  results[API_TOKEN] = cookieStore.get(API_TOKEN)?.value;
  return results;
};
const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
  const cookies = selectedCookies();
  const { isMobile } = useGetUserAgentInfo();

  return (
    <QueryProvider>
      <JotaiProvider>
        <SSROptionsProvider isMobile={isMobile} selectedCookies={cookies}>
          {children}
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
  );
};

export default ProviderWrapper;
