import { useDepositModal } from '@dashboard/features/payments';
import { useEffect } from 'react';

export const useTopUpPolling = () => {
  const { isOpenDepositModal, statusTransaction, checkDepositMutate, latestCreditId } = useDepositModal();

  useEffect(() => {
    let timmerId: NodeJS.Timeout;
    // Call Api check deposit interval when statusTransaction is false and isOpenDepositModal is false
    // Avoid call API 2 times when Modal Deposit is open
    if (!statusTransaction && !isOpenDepositModal && latestCreditId) {
      timmerId = setInterval(() => {
        checkDepositMutate(latestCreditId);
      }, 5000);
    }
    return () => {
      clearInterval(timmerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTransaction, isOpenDepositModal, latestCreditId]);
};
