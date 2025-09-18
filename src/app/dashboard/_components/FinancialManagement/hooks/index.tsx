import { useEffect, useMemo } from 'react';
import { balanceInfoAtom } from '@dashboard/FinancialManagement/states';
import { useAtom } from 'jotai';
import { IBalanceResponse } from '@dashboard/FinancialManagement/types';
import { BalanceUtils } from '@common/balance';

export default function useBalance() {
  const storedBalanceInfo = useMemo((): IBalanceResponse | null => {
    return BalanceUtils.getBalanceInfo();
  }, []);

  const [balanceInfo, setBalanceInfo] =
    useAtom(balanceInfoAtom);

  useEffect(() => {
    setBalanceInfo(storedBalanceInfo || undefined);
  }, []);

  return {
    balanceInfo,
  };
}
