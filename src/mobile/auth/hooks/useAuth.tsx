import React, { useMemo } from 'react';
import { removeCookie } from '@common/cookies';
import { currentUserAtom } from '@mobile/auth/states';
import { useAtom } from 'jotai';
import { AuthUtils, API_TOKEN } from '@common/auth';
import { ILoginResponse } from '../types';
import { BalanceUtils } from '@common/balance';

export default function useAuth() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const storedCurrentUser = useMemo((): ILoginResponse | null => {
    return AuthUtils.getCurrentUser();
  }, []);

  const isLogged = useMemo(() => {
    return currentUser?.id != undefined;
  }, [currentUser?.id]);

  React.useEffect(() => {
    const handleLocalStorageChange = () => {
      const data = AuthUtils.getCurrentUser();
      setCurrentUser(data);
    };

    window.addEventListener('storage', handleLocalStorageChange);
    setCurrentUser(storedCurrentUser);
    return () => {
      window.removeEventListener('storage', handleLocalStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const signout = () => {
    setCurrentUser(null);
    AuthUtils.removeCurrentUser();
    BalanceUtils.removeBalanceInfo();
    removeCookie(API_TOKEN);
  };

  return {
    currentUser,
    setCurrentUser,
    isLogged,
    signout,
  };
}
