import { useEffect, useMemo } from 'react';
import {
  removeFromStorage,
  getFromStorage,
} from '@common/localstorage';
import { removeCookie } from '@common/cookies';
import { userLocalStorage, TOKEN } from '@common/constants';
import { currentUserAtom } from '@mobile/auth/states';
import { useAtom } from 'jotai';

export default function useAuth() {
  const [currentUser, setCurrentUser] =
    useAtom(currentUserAtom);

  const storedCurrentUser = useMemo(() => {
    const userData = getFromStorage(userLocalStorage);
    if (userData) {
      return JSON.parse(userData);
    } else {
      return null;
    }
  }, []);

  const isLogged = useMemo(() => {
    return currentUser?.id != undefined;
  }, []);

  const signout = () => {
    setCurrentUser(undefined);
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
