import { useBalanceRequest } from '@common/api/balance';
import { paymentApi } from '@dashboard/features/payments/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  depositAmountAtom,
  openModalDepositAtom,
  statusTransactionAtom,
} from '@dashboard/features/payments/states';
import { useAtom } from 'jotai';
import { useLatestCreditId } from './useLatestCreditId';
import { UseDepositModalReturn } from '../types';

export const useDepositModal = (): UseDepositModalReturn => {
  const [isOpenDepositModal, setOpenDepositModal] = useAtom(openModalDepositAtom);
  const [statusTransaction, setStatusTransaction] = useAtom(statusTransactionAtom);
  const [depositAmount, setDepositAmount] = useAtom(depositAmountAtom);

  const { fetchBalance } = useBalanceRequest();
  const queryClient = useQueryClient();
  const { latestCreditId, fetchLatestCreditId } = useLatestCreditId();

  // Derive selectedAmount from depositAmount atom
  const selectedAmount = depositAmount ? parseInt(depositAmount) : null;

  const onOpenModalDeposit = () => {
    setOpenDepositModal(true);
    // Fetch latest credit ID when modal opens
    fetchLatestCreditId();
    // Set default deposit amount if none selected
    if (!depositAmount) {
      setDepositAmount('20000');
    }
  };

  const onCloseModalDeposit = () => {
    setOpenDepositModal(false);
    setStatusTransaction(false);
    setDepositAmount(undefined);
  };

  const handleAmountSelect = (amount: number) => {
    setDepositAmount(amount.toString());
  };

  const { mutate: checkDepositMutate } = useMutation({
    mutationKey: ['check-deposit_qr'],
    mutationFn: paymentApi.checkDeposit,
    onSuccess: async (data) => {
      if (data.status) {
        // Deposit success -> update statusTransaction to true, open modal congratulation and fetch balance
        // open modal congratulation  with case when user in page top-up
        setStatusTransaction(true);
        // Note: API doesn't return amount, keeping existing depositAmount value
        !isOpenDepositModal && setOpenDepositModal(true);
        queryClient.invalidateQueries({ queryKey: ['get-profile-me'] });
        await fetchBalance();
      }
    },
  });

  return {
    isOpenDepositModal,
    onOpenModalDeposit,
    onCloseModalDeposit,
    setOpenDepositModal,
    statusTransaction,
    setStatusTransaction,
    checkDepositMutate,
    formattedAmount: depositAmount,
    latestCreditId,
    selectedAmount,
    handleAmountSelect,
  };
};
