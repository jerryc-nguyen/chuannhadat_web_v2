import { useEffect, useMemo } from 'react';
import { removeFromStorage, getFromStorage } from '@common/localstorage';
import { removeCookie } from '@common/cookies';
import { userLocalStorage, TOKEN } from '@common/constants';
import { currentUserAtom } from '@mobile/auth/states';
import { useAtom } from 'jotai';
import { AuthUtils } from '@common/auth';
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
    removeFromStorage(userLocalStorage);
    removeCookie(TOKEN);
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
