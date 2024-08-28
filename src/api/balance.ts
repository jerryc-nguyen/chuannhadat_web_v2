import { useMutation } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';
import { AxiosError } from 'axios';
import { API_ROUTES } from '@common/router';
import { saveToStorage } from '@common/localstorage';
import { BALANCE_INFO_KEY } from '@common/balance';

export function useBalanceRequest() {
  const {
    mutateAsync: fetchBalance,
    isSuccess: isSuccessBalance,
  } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(
        API_ROUTES.BALANCE.OVERVIEW,
      );
      saveToStorage(
        BALANCE_INFO_KEY,
        JSON.stringify(response.data.data),
      );
      return response.data;
    },
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching balance', err);
    },
  });

  const {
    mutateAsync: fetchTransaction,
    isSuccess: isSuccessTransaction,
  } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(
        API_ROUTES.BALANCE.TRANSACTION,
      );
      return response.data;
    },
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching balance', err);
    },
  });

  const {
    mutateAsync: fetchHistoryTransaction,
    isSuccess: isSuccessHistoryTransaction,
  } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(
        API_ROUTES.BALANCE.HISTORY,
      );
      return response.data;
    },
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching balance', err);
    },
  });

  return {
    fetchBalance,
    fetchTransaction,
    fetchHistoryTransaction,
    isSuccessBalance,
    isSuccessTransaction,
    isSuccessHistoryTransaction,
  };
}
