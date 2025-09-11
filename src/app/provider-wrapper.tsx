'use client';
import { AuthProvider } from '@common/auth/AuthContext';
import { AppProvider } from '@common/context/AppContext';
import { QueryProvider } from '@components/providers';
import { Toaster } from '@components/ui/sonner';
import { Provider as JotaiProvider } from 'jotai';
import dynamic from 'next/dynamic';
import React from 'react';
import { LocationProvider } from '@contexts/LocationContext';

// ✅ Dynamically import heavy components to reduce Total Blocking Time
const RouteChangeHandler = dynamic(
  () => import('@components/route-change-handler'),
  { ssr: false }
);

const ListModal = dynamic(
  () => import('@components/ImprovedListModal'),
  { ssr: false }
);

const SessionTimeOutPopup = dynamic(
  () => import('@components/features/auth/timeout-popup/SessionTimeOutPopup'),
  { ssr: false }
);

type ProviderWrapperProps = {
  children: React.ReactNode;
  isMobile: boolean;
};

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children, isMobile }) => {
  return (
    <QueryProvider>
      <JotaiProvider>
        <LocationProvider>
          <AppProvider isMobile={isMobile}>
            <AuthProvider>
              {children}
              <ListModal />
              <SessionTimeOutPopup />
              {/* Client-side only component for route change handling */}
              <RouteChangeHandler />
            </AuthProvider>
          </AppProvider>
        </LocationProvider>
      </JotaiProvider>
      <Toaster position={isMobile ? 'top-center' : 'bottom-right'} theme="light" richColors />
    </QueryProvider>
  );
};

export default ProviderWrapper;
