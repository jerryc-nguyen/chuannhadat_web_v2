import { useAuth } from '@common/auth/AuthContext';
import useCleanupEffect from '@common/hooks/useCleanupEffect';
import React from 'react';
import Confetti from 'react-confetti';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog';
import { GuideDeposit } from './GuideDeposit';
import { TransactionSuccessful } from './TransactionSuccessful';
import { DepositModalProps } from '../types';
import { useDepositModal } from '../hooks/useDepositModal';

export const DepositModal: React.FC<DepositModalProps> = () => {
  const {
    isOpenDepositModal,
    setOpenDepositModal,
    statusTransaction,
    checkDepositMutate,
    setStatusTransaction,
    formattedAmount,
  } = useDepositModal();

  const { currentUser, bankTransferNote } = useAuth();
  const [isCopied, setIsCopied] = React.useState(false);

  useCleanupEffect(
    (helpers) => {
      if (isCopied) {
        helpers.setTimeout(() => {
          setIsCopied(false);
        }, 4000);
      }
    },
    [isCopied],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText('51938398888'); // BANK_ACCOUNT_NUMBER
    setIsCopied(true);
  };

  useCleanupEffect(
    (helpers) => {
      if (!statusTransaction && isOpenDepositModal) {
        helpers.setInterval(() => {
          checkDepositMutate(currentUser?.last_credit_id as number);
        }, 3000);
      }

      if (!isOpenDepositModal) {
        setStatusTransaction(false);
      }
    },
    [
      statusTransaction,
      isOpenDepositModal,
      currentUser?.last_credit_id,
      checkDepositMutate,
      setStatusTransaction,
    ],
  );

  return (
    <AlertDialog open={isOpenDepositModal} onOpenChange={setOpenDepositModal}>
      <AlertDialogContent className="max-h-[100vh] overflow-y-auto overflow-x-hidden md:max-h-[70vh]">
        <AlertDialogHeader className="relative z-10 mb-2">
          <AlertDialogTitle>
            {statusTransaction ? '' : 'QR code - Nạp tiền bằng chuyển khoản'}
          </AlertDialogTitle>
          {statusTransaction ? (
            <TransactionSuccessful formattedAmount={formattedAmount} />
          ) : (
            <GuideDeposit
              bankTransferNote={bankTransferNote}
              isCopied={isCopied}
              onCopy={handleCopy}
            />
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Đóng</AlertDialogAction>
        </AlertDialogFooter>
        <Confetti
          numberOfPieces={100}
          run={statusTransaction}
          width={512}
          height={300}
          recycle={true}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};
