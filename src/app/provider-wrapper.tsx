'use server';
import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { Toaster } from '@components/ui/sonner';
import { ToastContainer } from 'react-toastify';
import { QueryProvider } from '@components/providers';
import SessionTimeOutPopup from '@components/timeout-popup/SessionTimeOutPopup';
import ListModal from '@components/ListModal';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import { AuthProvider } from '@common/auth/AuthContext';
import { AppProvider } from '@common/context/AppContext';

type ProviderWrapperProps = {
  children: React.ReactNode;
};

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
  const { isMobile } = useGetUserAgentInfo();

  return (
    <QueryProvider>
      <JotaiProvider>
        <AppProvider isMobile={isMobile}>
          <AuthProvider>
            {children}
            <ListModal />
            <SessionTimeOutPopup />
          </AuthProvider>
        </AppProvider>
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
