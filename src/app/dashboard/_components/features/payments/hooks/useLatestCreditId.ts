import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { latestCreditIdAtom } from '@dashboard/features/payments/states';
import { paymentApi } from '../api';

export const useLatestCreditId = () => {
  const [latestCreditId, setLatestCreditId] = useAtom(latestCreditIdAtom);

  const { mutateAsync: fetchLatestCreditId, isPending } = useMutation({
    mutationFn: paymentApi.lastCreditId,
    onSuccess: (response) => {
      if (response.status && response.data) {
        setLatestCreditId(typeof response.data === 'number' ? response.data : null);
      }
    },
    onError: (error) => {
      console.error('❌ Error fetching latest credit ID:', error);
    },
  });

  return {
    latestCreditId,
    setLatestCreditId,
    fetchLatestCreditId,
    isLoading: isPending,
  };
};
