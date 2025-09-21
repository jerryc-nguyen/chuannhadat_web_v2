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
import { useDepositModal } from '../hooks/useDepositModal';
import { useTopUpPolling } from '@dashboard/features/payments/hooks/useTopUpPolling';
import { BANK_ACCOUNT_NUMBER_QR } from '@common/constants';

export const DepositModal: React.FC = () => {
  const hookData = useDepositModal();

  const {
    isOpenDepositModal,
    setOpenDepositModal,
    transferedSuccess,
    setTransferedSuccess,
    selectedAmount,
    handleAmountSelect,
    formattedAmount: depositAmount,
  } = hookData;

  // Use polling hook when modal is open
  useTopUpPolling();

  const { bankTransferNote } = useAuth();
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
    navigator.clipboard.writeText(BANK_ACCOUNT_NUMBER_QR); // BANK_ACCOUNT_NUMBER
    setIsCopied(true);
  };

  useCleanupEffect(
    (_helpers) => {
      if (!isOpenDepositModal) {
        setTransferedSuccess(false);
      }
    },
    [isOpenDepositModal, setTransferedSuccess],
  );

  return (
    <AlertDialog open={isOpenDepositModal} onOpenChange={setOpenDepositModal}>
      <AlertDialogContent className="max-h-[100vh] overflow-y-auto overflow-x-hidden md:max-h-[80vh]">
        <AlertDialogHeader className="relative z-10 mb-2">
          <AlertDialogTitle>
            {transferedSuccess ? '' : 'QR code - Nạp tiền bằng chuyển khoản'}
          </AlertDialogTitle>
          {transferedSuccess ? (
            <TransactionSuccessful formattedAmount={depositAmount} />
          ) : (
            <GuideDeposit
              bankTransferNote={bankTransferNote}
              isCopied={isCopied}
              onCopy={handleCopy}
              selectedAmount={selectedAmount}
              onAmountSelect={handleAmountSelect}
            />
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Đóng</AlertDialogAction>
        </AlertDialogFooter>
        <Confetti
          numberOfPieces={100}
          run={transferedSuccess}
          width={512}
          height={300}
          recycle={true}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};
