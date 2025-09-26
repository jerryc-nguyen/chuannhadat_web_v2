import { useEffect, useMemo } from 'react';
import { balanceInfoAtom } from '@dashboard/FinancialManagement/states';
import { useAtom } from 'jotai';
import { IBalanceResponse } from '@dashboard/FinancialManagement/types';
import { BalanceUtils } from '@common/balance';

const defaultBalanceData: IBalanceResponse = {
  tk_chinh: '0 Xu',
  tk_km: '0 Xu',
  total: '0 Xu',
  total_amount: 0,
};

export default function useBalance() {
  const storedBalanceInfo = useMemo((): IBalanceResponse | null => {
    return BalanceUtils.getBalanceInfo();
  }, []);

  const [balanceInfo, setBalanceInfo] = useAtom(balanceInfoAtom);

  useEffect(() => {
    setBalanceInfo(storedBalanceInfo || undefined);
  }, [storedBalanceInfo, setBalanceInfo]);

  // Return the balance data with fallback to default values
  const balanceData = balanceInfo || defaultBalanceData;

  return {
    balanceInfo,
    balanceData, // ✅ Pre-processed balance data with defaults
  };
}
