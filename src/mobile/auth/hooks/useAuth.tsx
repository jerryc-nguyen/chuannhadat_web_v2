import React, { useMemo } from 'react';
import { removeCookie, removeTokenClient, setTokenClient } from '@common/cookies';
import { currentUserAtom } from '@mobile/auth/states';
import { useAtom } from 'jotai';
import { AuthUtils, REFERRAL_CODE } from '@common/auth';
import { ILoginResponse } from '../types';
import { BalanceUtils } from '@common/balance';
import { setTokenServer } from '@app/action';

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

  const handleSignOut = () => {
    setCurrentUser(null);
    AuthUtils.removeCurrentUser();
    removeTokenClient();
    BalanceUtils.removeBalanceInfo();
  };

  const handleSignIn = (user: ILoginResponse) => {
    setTokenServer.call(null, user.api_token);
    updateCurrentUser(user);
    setTokenClient(user.api_token);
    removeCookie(REFERRAL_CODE);
  };

  const updateCurrentUser = (user: ILoginResponse) => {
    setCurrentUser(user);
    AuthUtils.updateCurrentUser(user);
  };

  return {
    currentUser,
    setCurrentUser,
    isLogged,
    handleSignOut,
    handleSignIn,
    updateCurrentUser,
  };
}
