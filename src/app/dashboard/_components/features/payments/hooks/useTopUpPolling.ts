import { useDepositModal, useLatestCreditId } from '@dashboard/features/payments';
import { useCallback, useEffect, useRef } from 'react';

export const useTopUpPolling = () => {
  const { isOpenDepositModal, checkDepositMutate } = useDepositModal();
  const { latestCreditId, fetchLatestCreditId } = useLatestCreditId();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized polling function
  const startPolling = useCallback((creditId: number) => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      checkDepositMutate(creditId);
    }, 3000);
  }, [checkDepositMutate]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Effect: Fetch credit ID when modal opens
  useEffect(() => {
    const fetchCreditId = async () => {
      if (isOpenDepositModal && !latestCreditId) {
        try {
          await fetchLatestCreditId();
        } catch (error) {
          console.error('Error fetching latest credit ID:', error);
        }
      }
    };

    fetchCreditId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenDepositModal, latestCreditId]);

  // Effect: Start/stop polling based on modal state and credit ID
  useEffect(() => {
    if (isOpenDepositModal && latestCreditId) {
      // Only start polling if we don't already have an active interval
      if (!pollingIntervalRef.current) {
        startPolling(latestCreditId);
      }
    } else {
      stopPolling();
    }

    // Cleanup on unmount
    return stopPolling;
  }, [isOpenDepositModal, latestCreditId, startPolling, stopPolling]);
};
