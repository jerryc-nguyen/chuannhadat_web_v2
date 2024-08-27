import { useEffect, useMemo } from 'react';
import { removeCookie } from '@common/cookies';
import { currentUserAtom } from '@mobile/auth/states';
import { useAtom } from 'jotai';
import { AuthUtils, API_TOKEN } from '@common/auth';
import { ILoginResponse } from '../types';

export default function useAuth() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const storedCurrentUser = useMemo((): ILoginResponse | null => {
    return AuthUtils.getCurrentUser();
  }, []);

  const isLogged = useMemo(() => {
    return currentUser?.id != undefined;
  }, []);

  const signout = () => {
    setCurrentUser(null);
    AuthUtils.removeCurrentUser();
    removeCookie(API_TOKEN);
  };

  useEffect(() => {
    setCurrentUser(storedCurrentUser);
  }, []);

  return {
    currentUser,
    setCurrentUser,
    isLogged,
    signout,
  };
}
