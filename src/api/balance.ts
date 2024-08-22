import { useMutation } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';
import { AxiosError } from 'axios';
import { API_ROUTES } from '@common/router';

export function useBalance() {
  const {
    mutateAsync: fetchBalance,
    isSuccess: isSuccessBalance,
  } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(
        API_ROUTES.BALANCE.OVERVIEW,
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
