'use server';
import { AuthProvider } from '@common/auth/AuthContext';
import { AppProvider } from '@common/context/AppContext';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import ListModal from '@components/ListModal';
import { QueryProvider } from '@components/providers';
import SessionTimeOutPopup from '@components/timeout-popup/SessionTimeOutPopup';
import { Toaster } from '@components/ui/sonner';
import { Provider as JotaiProvider } from 'jotai';
import React from 'react';

type ProviderWrapperProps = {
  children: React.ReactNode;
};

const ProviderWrapper: React.FC<ProviderWrapperProps> = async ({ children }) => {
  const { isMobile } = await getUserAgentInfo();

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
    </QueryProvider>
  );
};

export default ProviderWrapper;
