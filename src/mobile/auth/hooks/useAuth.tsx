import React, { useMemo } from 'react';
import { removeTokenClient, setTokenClient } from '@common/cookies';
import { currentUserAtom } from '@mobile/auth/states';
import { useAtom } from 'jotai';
import { AuthUtils } from '@common/auth';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = () => {
    setCurrentUser(null);
    AuthUtils.removeCurrentUser();
    removeTokenClient();
    BalanceUtils.removeBalanceInfo();
  };

  const handleLogin = (user: ILoginResponse) => {
    updateCurrentUser(user);
    setTokenClient(user.api_token);
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
