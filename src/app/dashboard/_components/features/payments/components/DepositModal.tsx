import { useAuth } from '@common/auth/AuthContext';
import { useApp } from '@common/context/AppContext';
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
import { MobileGuideDeposit } from './MobileGuideDeposit';
import { TransactionSuccessful } from './TransactionSuccessful';
import { useDepositModal } from '../hooks/useDepositModal';
import { useTopUpPolling } from '@dashboard/features/payments/hooks/useTopUpPolling';

export const DepositModal: React.FC = () => {
  const hookData = useDepositModal();
  const { isMobile } = useApp();

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
      <AlertDialogContent className={`max-h-[100vh] overflow-y-auto overflow-x-hidden ${isMobile ? 'w-[95vw] max-w-md' : 'md:max-h-[80vh]'}`}>
        <AlertDialogHeader className="relative z-10 mb-2">
          <AlertDialogTitle className={isMobile ? 'text-center text-lg' : ''}>
            {transferedSuccess ? '' : 'QR code - Nạp tiền bằng chuyển khoản'}
          </AlertDialogTitle>
          {transferedSuccess ? (
            <TransactionSuccessful formattedAmount={depositAmount} />
          ) : isMobile ? (
            <MobileGuideDeposit
              bankTransferNote={bankTransferNote}
              selectedAmount={selectedAmount}
              onAmountSelect={handleAmountSelect}
            />
          ) : (
            <GuideDeposit
              bankTransferNote={bankTransferNote}
              selectedAmount={selectedAmount}
              onAmountSelect={handleAmountSelect}
            />
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className={isMobile ? 'w-full' : ''}>Đóng</AlertDialogAction>
        </AlertDialogFooter>
        <Confetti
          numberOfPieces={100}
          run={transferedSuccess}
          width={isMobile ? 300 : 512}
          height={isMobile ? 200 : 300}
          recycle={true}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};
