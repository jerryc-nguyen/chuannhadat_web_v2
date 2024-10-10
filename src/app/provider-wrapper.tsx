'use server';
import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { cookies } from 'next/headers';
import { API_TOKEN } from '@common/auth';
import { Toaster } from '@components/ui/sonner';
import { ToastContainer } from 'react-toastify';
import { QueryProvider } from '@components/providers';
import SessionTimeOutPopup from '@components/timeout-popup/SessionTimeOutPopup';
import ListModal from '@components/ListModal';
import { timeOutDuration } from '@common/constants';

type ProviderWrapperProps = {
  children: React.ReactNode;
};

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
  const isLogged = cookies().has(API_TOKEN);
  const handleRemoveToken = () => {
    'use server';
    cookies().delete(API_TOKEN);
  };
  const handleSetToken = (token: string) => {
    'use server';
    cookies().set({
      name: API_TOKEN,
      value: token,
      httpOnly: true,
      maxAge: timeOutDuration / 1000, // in seconds
      secure: true,
      sameSite: 'lax',
    });
  };
  return (
    <QueryProvider>
      <JotaiProvider>
        {children}
        <ListModal />
        <SessionTimeOutPopup
          handleSetToken={handleSetToken}
          isLogged={isLogged}
          handleRemoveToken={handleRemoveToken}
        />
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
