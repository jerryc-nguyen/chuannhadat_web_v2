import React, { useMemo } from 'react';
import { removeCookie, setToken } from '@common/cookies';
import { currentUserAtom } from '@mobile/auth/states';
import { useAtom } from 'jotai';
import { AuthUtils, API_TOKEN } from '@common/auth';
import { ILoginResponse } from '../types';
import { BalanceUtils } from '@common/balance';

export default function useAuth() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const isLogged = useMemo(() => {
    return currentUser?.id != undefined;
  }, [currentUser]);

  React.useEffect(() => {
    const currentUser = AuthUtils.getCurrentUser();
    setCurrentUser(currentUser);
  }, []);

  const signOut = () => {
    setCurrentUser(null);
    AuthUtils.removeCurrentUser();
    removeCookie(API_TOKEN);
    BalanceUtils.removeBalanceInfo();
  };

  const handleLogin = (user: ILoginResponse) => {
    updateCurrentUser(user);
    setToken(user.api_token);
  };

  const updateCurrentUser = (user: ILoginResponse) => {
    setCurrentUser(user);
    AuthUtils.updateCurrentUser(user);
  };

  return {
    currentUser,
    setCurrentUser,
    isLogged,
    signOut,
    handleLogin,
    updateCurrentUser,
  };
}
