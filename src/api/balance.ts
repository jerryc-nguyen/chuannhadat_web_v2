import { useMutation } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';
import { AxiosError } from 'axios';
import { API_ROUTES } from '@common/router';
import { saveToStorage } from '@common/localstorage';
import { BALANCE_INFO_KEY } from '@common/balance';
import { useAtom } from 'jotai';
import { balanceDataAtom } from '@dashboard/DashboardLayout/states';

export function useBalanceRequest() {
  const [balanceData, setBalanceData] = useAtom(balanceDataAtom);

  const { mutateAsync: fetchBalance, isSuccess: isSuccessBalance } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(API_ROUTES.BALANCE.OVERVIEW);
      setBalanceData(response.data);
      saveToStorage(BALANCE_INFO_KEY, JSON.stringify(response.data));
      return response;
    },
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching balance', err);
    },
  });

  const { mutateAsync: fetchTransaction, isSuccess: isSuccessTransaction } = useMutation({
    mutationFn: () => axiosInstance.get(API_ROUTES.BALANCE.TRANSACTION),
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching balance', err);
    },
  });

  const { mutateAsync: fetchHistoryTransaction, isSuccess: isSuccessHistoryTransaction } =
    useMutation({
      mutationFn: () => axiosInstance.get(API_ROUTES.BALANCE.HISTORY),
      onError: (err: AxiosError<A>) => {
        console.error('Error fetching balance', err);
      },
    });

  return {
    balanceData,
    fetchBalance,
    fetchTransaction,
    fetchHistoryTransaction,
    isSuccessBalance,
    isSuccessTransaction,
    isSuccessHistoryTransaction,
  };
}
