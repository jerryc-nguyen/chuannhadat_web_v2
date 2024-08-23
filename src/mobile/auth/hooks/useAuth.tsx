import { useEffect, useMemo } from 'react';
import { getFromStorage } from '@common/localstorage';
import { userLocalStorage } from '@common/constants';
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

  useEffect(() => {
    setCurrentUser(storedCurrentUser);
  }, []);

  return {
    currentUser,
    isLogged,
  };
}
