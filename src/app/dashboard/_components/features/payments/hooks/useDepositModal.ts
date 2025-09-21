import { useBalanceRequest } from '@common/api/balance';
import { paymentApi } from '@dashboard/features/payments/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  openModalDepositAtom,
  statusTransactionAtom,
  depositAmountAtom,
  transferedAmountAtom,
} from '@dashboard/features/payments/states';
import { useAtom } from 'jotai';
import { UseDepositModalReturn } from '../types';
import { formatPriceWithUnit } from '@common/priceHelpers';

const DEFAULT_DEPOSIT_AMOUNT = 20000;

export const useDepositModal = (): UseDepositModalReturn => {
  const [isOpenDepositModal, setOpenDepositModal] = useAtom(openModalDepositAtom);
  const [statusTransaction, setStatusTransaction] = useAtom(statusTransactionAtom);
  const [transferedAmount, setTransferedAmount] = useAtom(transferedAmountAtom);
  const [depositAmount, setDepositAmount] = useAtom(depositAmountAtom);

  const { fetchBalance } = useBalanceRequest();
  const queryClient = useQueryClient();


  // Derive selectedAmount from global depositAmount
  const selectedAmount = depositAmount ?? null;

  const onOpenModalDeposit = (isResetAmount = false) => {
    setOpenDepositModal(true);
    // Set default deposit amount if none selected
    if (isResetAmount || !depositAmount) {
      setDepositAmount(DEFAULT_DEPOSIT_AMOUNT);
    }
  };

  const onCloseModalDeposit = () => {
    setOpenDepositModal(false);
    setStatusTransaction(false);
    setDepositAmount(undefined);
  };

  const handleAmountSelect = (amount: number) => {
    setDepositAmount(amount);
  };

  const clearAmount = () => {
    setDepositAmount(undefined);
  };

  const { mutate: checkDepositMutate } = useMutation({
    mutationKey: ['check-deposit_qr'],
    mutationFn: paymentApi.checkDeposit,
    onSuccess: async (response: A) => {
      if (response.status) {
        // Deposit success -> update statusTransaction to true, open modal congratulation and fetch balance
        // open modal congratulation  with case when user in page top-up
        setStatusTransaction(true);
        if (response.data?.amount) {
          setTransferedAmount(response.data.amount);
        }
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
    formattedAmount: formatPriceWithUnit(depositAmount ?? 0),
    selectedAmount,
    handleAmountSelect,
    clearAmount,
    transferedAmount,
    setTransferedAmount,
  };
};
