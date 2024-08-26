import { useEffect, useMemo } from 'react';
import {
  getFromStorage,
} from '@common/localstorage';
import { balanceLocalStorage} from '@common/constants';
import { balanceInfoAtom } from '@mobile/main-financial-management/states';
import { useAtom } from 'jotai';

export default function useBalance() {
  const [balanceInfo, setBalanceInfo] =
    useAtom(balanceInfoAtom);

  const storedBalanceInfo = useMemo(() => {
    const balanceInfoData = getFromStorage(balanceLocalStorage);
    if (balanceInfoData) {
      return JSON.parse(balanceInfoData);
    } else {
      return null;
    }
  }, []);


  useEffect(() => {
    setBalanceInfo(storedBalanceInfo);
  }, []);

  return {
    balanceInfo,
  };
}
