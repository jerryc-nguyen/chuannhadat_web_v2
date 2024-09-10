import { useMutation } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';
import { AxiosError } from 'axios';
import { API_ROUTES } from '@common/router';

export function useNotificationRequest() {
  const { mutateAsync: fetchNotification, isSuccess: isSuccessNotification } = useMutation({
    mutationFn: async (params: { page: number; per_page: number, filter_status: "read" | "unread" | null }) => {
      const response = await axiosInstance.get(API_ROUTES.NOTIFICATION.LIST, {
        params,
      });
      return response.data;
    },
    onError: (err: AxiosError) => {
      console.error('Error fetching notifications', err);
    },
  });

  const { mutateAsync: makeMarkReadAll, isSuccess: isSuccessMarkReadAll } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(API_ROUTES.NOTIFICATION.MARK_ALL_READ);
      return response;
    },
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching balance', err);
    },
  });

  const { mutateAsync: makeMarkRead } = useMutation({
    mutationFn: async (id: number) => {
       await axiosInstance.put(`${API_ROUTES.NOTIFICATION.READ}`, {id});
    },
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching balance', err);
    },
  });

  return {
    fetchNotification,
    makeMarkReadAll,
    makeMarkRead,
    isSuccessMarkReadAll,
    isSuccessNotification,
  };
}
