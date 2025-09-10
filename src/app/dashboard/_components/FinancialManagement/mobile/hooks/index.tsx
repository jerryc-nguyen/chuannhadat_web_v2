import { useEffect, useMemo } from 'react';
import { balanceInfoAtom } from '../states';
import { useAtom } from 'jotai';
import { IBalanceResponse } from '../types';
import { BalanceUtils } from '@common/balance';

export default function useBalance() {
  const storedBalanceInfo = useMemo((): IBalanceResponse | null => {
    return BalanceUtils.getBalanceInfo();
  }, []);

  const [balanceInfo, setBalanceInfo] =
    useAtom(balanceInfoAtom);

  useEffect(() => {
    setBalanceInfo(storedBalanceInfo);
  }, [setBalanceInfo, storedBalanceInfo]);

  return {
    balanceInfo,
  };
}
