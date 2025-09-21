import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { latestCreditIdAtom } from '@dashboard/features/payments/states';
import { paymentApi } from '../api';

export const useLatestCreditId = () => {
  const [latestCreditId, setLatestCreditId] = useAtom(latestCreditIdAtom);

  const { mutate: fetchLatestCreditId, isLoading } = useMutation({
    mutationFn: paymentApi.lastCreditId,
    onSuccess: (data) => {
      if (data.status && data.data?.last_credit_id) {
        setLatestCreditId(data.data.last_credit_id);
      }
    },
    onError: (error) => {
      console.error('Error fetching latest credit ID:', error);
    },
  });

  return {
    latestCreditId,
    setLatestCreditId,
    fetchLatestCreditId,
    isLoading,
  };
};
