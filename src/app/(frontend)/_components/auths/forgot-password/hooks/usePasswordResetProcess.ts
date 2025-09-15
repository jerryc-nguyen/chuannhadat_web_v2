'use client';
import { useEffect } from 'react';

interface UsePasswordResetProcessProps {
  openPopupResetPassword: boolean;
  resetPassword: (phone: string) => void;
  resetPhone: string;
}

export const usePasswordResetProcess = ({
  openPopupResetPassword,
  resetPassword,
  resetPhone,
}: UsePasswordResetProcessProps) => {
  useEffect(() => {
    const intervalId: NodeJS.Timeout = setInterval(() => {
      openPopupResetPassword && resetPassword(resetPhone);
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [openPopupResetPassword, resetPassword, resetPhone]);
};
