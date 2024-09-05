import React, { useMemo } from 'react';
import { removeCookie, setCookie } from '@common/cookies';
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
  }, [currentUser]);

  React.useEffect(() => {
    setCurrentUser(storedCurrentUser);
  }, [setCurrentUser, storedCurrentUser]);

  const signout = () => {
    setCurrentUser(null);
    AuthUtils.removeCurrentUser();
    removeCookie(API_TOKEN);
    BalanceUtils.removeBalanceInfo();
  };

  const handleLogin = (user: ILoginResponse) => {
    updateCurrentUser(user);
    setCookie(API_TOKEN, user.api_token);
  };

  const updateCurrentUser = (user: ILoginResponse) => {
    setCurrentUser(user);
    AuthUtils.updateCurrentUser(user);
  };

  return {
    currentUser,
    setCurrentUser,
    isLogged,
    signout,
    handleLogin,
    updateCurrentUser,
  };
}
