'use server';
import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { cookies } from 'next/headers';
import { API_TOKEN_SERVER } from '@common/auth';
import { Toaster } from '@components/ui/sonner';
import { ToastContainer } from 'react-toastify';
import { QueryProvider } from '@components/providers';
import SessionTimeOutPopup from '@components/timeout-popup/SessionTimeOutPopup';
import ListModal from '@components/ListModal';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import { AuthProvider } from '@common/auth/AuthContext';

type ProviderWrapperProps = {
  children: React.ReactNode;
};

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
  const isLogged = cookies().has(API_TOKEN_SERVER);
  const { isMobile } = useGetUserAgentInfo();
  return (
    <QueryProvider>
      <JotaiProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ListModal />
        <SessionTimeOutPopup isLogged={isLogged} />
      </JotaiProvider>
      <Toaster position={isMobile ? 'top-center' : 'bottom-right'} theme="light" richColors />
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
