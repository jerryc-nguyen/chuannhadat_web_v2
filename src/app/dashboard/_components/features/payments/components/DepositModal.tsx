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

  const title = isMobile ? 'QR code - Nạp tiền' : 'QR code - Nạp tiền bằng chuyển khoản';

  return (
    <AlertDialog open={isOpenDepositModal} onOpenChange={setOpenDepositModal}>
      <AlertDialogContent className={`flex flex-col ${isMobile ? 'w-[95vw] max-w-md max-h-[90vh]' : 'md:max-h-[85vh] max-w-2xl'}`}>
        <AlertDialogHeader className="flex-shrink-0 relative z-10 mb-2">
          <AlertDialogTitle className={isMobile ? 'text-center text-lg' : ''}>
            {transferedSuccess ? '' : title}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
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
        </div>
        <AlertDialogFooter className="flex-shrink-0">
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
